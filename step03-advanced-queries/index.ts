import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  // --- 테스트 데이터 설정 ---
  console.log("🧹 기존 데이터를 삭제합니다...");
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ 데이터 삭제 완료");

  console.log("\n👤 테스트 사용자를 생성합니다...");
  const me = await prisma.user.create({ data: { name: "Me", email: "me@test.com" } });
  const user1 = await prisma.user.create({ data: { name: "User1", email: "user1@test.com" } });
  const user2 = await prisma.user.create({ data: { name: "User2", email: "user2@test.com" } });
  const user3 = await prisma.user.create({ data: { name: "User3", email: "user3@test.com" } });

  console.log("\n🤝 팔로우 관계를 설정합니다...");
  // 내가 User1과 User2를 팔로우
  await prisma.follow.createMany({
    data: [
      { followerId: me.id, followingId: user1.id },
      { followerId: me.id, followingId: user2.id },
    ],
  });

  console.log("\n📝 테스트 게시물을 생성합니다...");
  // User1, User2, User3가 각각 게시물 작성
  await prisma.post.create({ data: { title: "User1의 첫 번째 글", authorId: user1.id } });
  await prisma.post.create({ data: { title: "User2의 첫 번째 글", authorId: user2.id } });
  await prisma.post.create({ data: { title: "User3의 첫 번째 글", authorId: user3.id } });
  await prisma.post.create({ data: { title: "User1의 두 번째 글", authorId: user1.id } });

  // --- 타임라인 API 구현 ---
  console.log("\n🔍 'Me'의 타임라인을 조회합니다 (내가 팔로우한 User1, User2의 글만)...");

  const currentUserId = me.id;
  const timelinePosts = await prisma.post.findMany({
    where: {
      // 게시물의 작성자(author)가...
      author: {
        // ...나를 팔로우하는 사람들(followers) 중에...
        followers: {
          // ...'나(currentUserId)'를 팔로워로 가지는 경우가 있는지(some) 확인
          some: {
            followerId: currentUserId,
          },
        },
      },
    },
    include: {
      author: {
        select: { name: true }, // 작성자 이름만 포함
      },
    },
    orderBy: {
      createdAt: "desc", // 최신순으로 정렬
    },
  });

  console.log("💌 타임라인 게시물 목록:");
  console.dir(timelinePosts, { depth: null });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
