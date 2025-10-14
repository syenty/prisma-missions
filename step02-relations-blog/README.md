# Step 2: Relations (Blog API)

## 🎯 목표 (Objectives)

- `User` – `Post` (1:N), `Post` – `Comment` (1:N) 관계 설정
- 관계형 데이터 조회 및 삽입 실습

## ✨ 핵심 기능 (Key Features)

### Prisma Schema (스키마)

- **1:N 관계 설정**: `@relation` 속성을 사용하여 일대다(One-to-Many) 관계를 정의합니다.

### Prisma Client (라이브러리)

- **`include` (Option)**: 쿼리 시 관계 모델의 데이터를 함께 로드합니다. (e.g., `user.posts`)
- **`connect` (Nested Write)**: 레코드 생성 시 기존의 다른 레코드와 관계를 연결합니다.
- **`create` (Nested Write)**: 레코드 생성 시 관계가 있는 레코드를 함께 생성합니다.
