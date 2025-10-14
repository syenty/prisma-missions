# Step 5: Small Real Project (Todo App)

## 🎯 목표 (Objectives)

- `User` – `Task` (1:N) 구조
- `Task` 상태(`PENDING`, `IN_PROGRESS`, `DONE`) `enum` 컬럼 추가
- REST API로 CRUD 구현

## ✨ 핵심 기능 (Key Features)

### Prisma Schema (스키마)

- **`enum`**: `TaskStatus`와 같이 특정 필드가 가질 수 있는 값의 집합을 데이터베이스 레벨에서 정의합니다.

### Prisma Client (라이브러리)

- **관계형 CRUD**: `x-user-id`와 같은 식별자를 사용하여 특정 사용자에 종속된 데이터를 생성, 조회, 수정, 삭제합니다.
- **조건부 필터링**: 쿼리 파라미터(`?status=...`) 유무에 따라 동적으로 `where` 절을 구성하여 데이터를 필터링합니다.
- **데이터 수정/삭제 권한**: `update` 및 `delete` 쿼리의 `where` 절에 `authorId`를 포함하여, 자신의 데이터만 수정/삭제할 수 있도록 보장합니다.
