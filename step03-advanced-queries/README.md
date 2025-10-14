# Step 3: Advanced Queries (SNS Timeline)

## 🎯 목표 (Objectives)

- `User` – `Follow` (M:N) 관계 설정
- 내가 팔로우한 사용자의 글만 조회하는 타임라인 API 만들기

## ✨ 핵심 기능 (Key Features)

### Prisma Schema (스키마)

- **M:N 관계 설정**: 명시적(explicit) 조인 테이블(`Follow` 모델)을 사용하여 다대다(Many-to-Many) 관계를 정의합니다.

### Prisma Client (라이브러리)

- **`where` (관계 필터)**: 중첩된 필터를 사용하여 관계 모델의 데이터를 기반으로 쿼리합니다. (e.g., `followers: { some: { ... } }`)
- **`orderBy` (정렬)**: 쿼리 결과를 특정 필드 기준으로 정렬합니다.
- **`take` & `skip` (페이지네이션)**: 쿼리 결과의 일부만 가져와 페이지네이션을 구현합니다.
