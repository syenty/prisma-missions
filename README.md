# 📘 Prisma Journey

Prisma 학습을 위한 단계별 미션 프로젝트입니다.  
각 단계는 `schema.prisma`를 수정 → 마이그레이션 적용 → 타입 안전한 쿼리 작성 → API 구현 순으로 진행됩니다.

---

## 🚀 진행 단계

### ✅ Step 1: CRUD Basics

- **목표**
  - Prisma 설치 및 환경 설정
  - `User` 모델 정의 (`id`, `name`, `email`, `createdAt`)
  - 기본 CRUD API 구현 (`create`, `read`, `update`, `delete`)
- **핵심 기능**
  - `prisma.user.create()`
  - `prisma.user.findUnique()`
- **배운 점**
  - Prisma Client 사용법
  - `prisma migrate dev`와 `prisma studio` 활용

---

### ✅ Step 2: Relations (Blog API)

- **목표**
  - User – Post (1:N), Post – Comment (1:N) 관계 설정
  - 관계형 데이터 조회 및 삽입 실습
- **핵심 기능**
  - `include` 옵션으로 관계 데이터 불러오기
  - `connect`, `create` 옵션 활용
- **배운 점**
  - 관계형 모델링과 Prisma의 선언적 관계 매핑

---

### ✅ Step 3: Advanced Queries (SNS Timeline)

- **목표**
  - User – Follow (M:N) 관계 설정
  - 내가 팔로우한 사용자의 글만 조회하는 타임라인 API 만들기
- **핵심 기능**
  - `where`, `orderBy`, `take`, `skip`
- **배운 점**
  - Prisma로 복잡한 조건 쿼리 처리
  - SQL JOIN 없이 M:N 관계 처리 가능함을 체험

---

### ✅ Step 4: Schema Evolution & Migrations

- **목표**
  - `Post` 모델에 `likes` 컬럼 추가
  - 안전한 마이그레이션 생성 및 반영
- **핵심 기능**
  - `prisma migrate dev` vs `prisma db push`
- **배운 점**
  - DB 스키마 변경 시 안전하게 대응하는 방법

---

### ✅ Step 5: Small Real Project (Todo App)

- **목표**
  - User – Task (1:N) 구조
  - Task 상태(`pending`, `in-progress`, `done`) enum 컬럼 추가
  - REST API 또는 GraphQL API로 CRUD 구현
- **핵심 기능**
  - Prisma enum
  - 조건 필터링 쿼리
- **배운 점**
  - 실제 서비스 개발 흐름 속 Prisma 적용 감각

---

## 📂 프로젝트 구조

```
prisma-journey/
 ├── step01-crud-basics/
 ├── step02-relations-blog/
 ├── step03-advanced-queries/
 ├── step04-migrations/
 └── step05-todo-app/
```

---

## 📝 진행 로그

- [ ] Step 1 완료
- [ ] Step 2 완료
- [ ] Step 3 완료
- [ ] Step 4 완료
- [ ] Step 5 완료
