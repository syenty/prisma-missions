# Step 1: CRUD Basics

## 🎯 목표 (Objectives)

- Prisma 설치 및 환경 설정
- `User` 모델 정의 (`id`, `name`, `email`, `createdAt`)
- 기본 CRUD API 구현 (`create`, `read`, `update`, `delete`)

## ✨ 핵심 기능 (Key Features)

### Prisma CLI (명령어)

- **`prisma migrate dev`**: Prisma 스키마 변경사항을 데이터베이스에 안전하게 적용합니다.
- **`prisma studio`**: GUI를 통해 데이터베이스를 시각적으로 확인하고 관리합니다.

### Prisma Client (라이브러리)

- **`PrismaClient` (Class)**: 타입 안전한 데이터베이스 쿼리를 위한 클라이언트 클래스입니다.
- **`prisma.user.create()` (Method)**: 새로운 사용자 레코드를 생성합니다.
- **`prisma.user.findMany()` (Method)**: 여러 사용자 레코드를 조회합니다.
- **`prisma.user.findUnique()` (Method)**: 고유(unique) 필드를 기준으로 단일 사용자 레코드를 조회합니다.
- **`prisma.user.update()` (Method)**: 특정 사용자 레코드의 정보를 수정합니다.
- **`prisma.user.delete()` (Method)**: 특정 사용자 레코드를 삭제합니다.
