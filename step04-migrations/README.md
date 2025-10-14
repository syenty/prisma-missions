# Step 4: Schema Evolution & Migrations

## 🎯 목표 (Objectives)

- `Post` 모델에 `likes` 컬럼 추가
- 안전한 마이그레이션 생성 및 반영

## ✨ 핵심 기능 (Key Features)

### Prisma CLI (명령어)

- **`prisma migrate dev`**: (개발 환경) 스키마 변경사항을 감지하여 새로운 마이그레이션 파일을 생성하고, 데이터베이스에 적용합니다.
- **`prisma migrate deploy`**: (프로덕션/배포 환경) 생성된 마이그레이션 파일들을 데이터베이스에 적용합니다.

### Prisma Client (라이브러리)

- **`increment` (Atomic Operation)**: 데이터베이스에서 직접 숫자 필드의 값을 경쟁 조건(race condition) 없이 안전하게 증가시킵니다.
