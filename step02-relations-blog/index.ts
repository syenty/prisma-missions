import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  // 이전 데이터 삭제 (매번 실행 시 깨끗한 상태에서 시작)
  console.log("🧹 기존 데이터를 삭제합니다...");
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ 데이터 삭제 완료");

  // 1. 사용자 생성
  console.log("\n👤 사용자(Alice)를 생성합니다...");
  const son = await prisma.user.create({
    data: {
      name: "Son",
      email: "son@test.com",
    },
  });
  console.log("생성된 사용자:", son);

  // 2. `connect`를 사용하여 기존 사용자와 연결된 새 게시물 생성
  console.log("\n📝 `connect`를 사용하여 Son의 새 게시물을 생성합니다...");
  const postBySon = await prisma.post.create({
    data: {
      title: "Prisma Client 시작하기",
      content: "Prisma를 사용하면 관계형 쿼리가 정말 쉬워집니다.",
      author: {
        connect: {
          email: "son@test.com", // email은 unique 필드이므로 사용 가능
        },
      },
    },
  });
  console.log("생성된 게시물:", postBySon);

  // 3. `create`를 사용하여 새 게시물과 댓글을 동시에 생성
  console.log("\n📝 `create`를 사용하여 Son의 새 게시물과 댓글을 동시에 생성합니다...");
  const postWithComments = await prisma.post.create({
    data: {
      title: "관계형 쿼리 마스터하기",
      author: {
        connect: {
          id: son.id, // id로도 연결 가능
        },
      },
      comments: {
        create: [{ text: "정말 유용한 기능이네요!" }, { text: "`include`도 사용해보세요." }],
      },
    },
  });
  console.log("생성된 게시물과 댓글:", postWithComments);

  // 4. `include`를 사용하여 사용자와 게시물을 함께 조회
  console.log("\n🔍 `include`를 사용하여 모든 사용자와 게시물을 함께 조회합니다...");
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true, // User에 연결된 모든 Post를 포함
    },
  });
  console.dir(usersWithPosts, { depth: null });

  // 5. 중첩 `include`를 사용하여 게시물, 작성자, 댓글을 모두 함께 조회
  console.log("\n🔍 중첩 `include`를 사용하여 모든 게시물과 그 작성자, 댓글을 함께 조회합니다...");
  const postsWithDetails = await prisma.post.findMany({
    include: {
      author: true, // Post의 작성자(User)를 포함
      comments: true, // Post에 달린 모든 Comment를 포함
    },
  });
  console.dir(postsWithDetails, { depth: null });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
