import { PrismaClient } from "@prisma/client";

// PrismaClient 인스턴스 생성
const prisma = new PrismaClient();

async function main() {
  const info = {
    email: "son@test.com",
    name: "Son",
  };
  // 1. 새로운 사용자 생성
  console.log("새로운 사용자를 생성합니다...");
  const newUser = await prisma.user.create({
    data: {
      ...info,
    },
  });
  console.log("생성된 사용자:", newUser);

  // 2. 모든 사용자 조회
  console.log("모든 사용자를 조회합니다...");
  const allUsers = await prisma.user.findMany();
  console.log("모든 사용자 목록:", allUsers);

  // 3. 특정 사용자 조회
  console.log("특정 사용자를 조회합니다...");
  const specificUser = await prisma.user.findUnique({ where: { email: info.email } });
  console.log("특정 사용자:", specificUser);

  // 4. 특정 사용자 정보 수정 (선택 사항)
  console.log("Son의 이름을 YeongTak Son로 변경합니다...");
  const updatedUser = await prisma.user.update({
    where: { email: "son@test.com" },
    data: { name: "YeongTak Son" },
  });
  console.log("수정된 사용자 정보:", updatedUser);

  // 5. 특정 사용자 삭제 (선택 사항)
  console.log("YeongTak Son 사용자를 삭제합니다...");
  const deletedUser = await prisma.user.delete({
    where: { email: "son@test.com" },
  });
  console.log("삭제된 사용자 정보:", deletedUser);

  // 5. 다시 모든 사용자 조회
  console.log("삭제 후 모든 사용자를 다시 조회합니다...");
  const finalUsers = await prisma.user.findMany();
  console.log("최종 사용자 목록:", finalUsers);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
