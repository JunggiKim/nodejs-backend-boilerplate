# PLANS.md - NestJS 모노레포 리팩토링 계획 (2차)

`nestjs-backend` 프로젝트의 모듈 구조를 `deartail-backend` 패턴에 맞춰 `services/example-service`로 마이그레이션하고 최신 기술셋을 연동합니다.

## 목표
- 디렉토리 명칭 변경: `apis/` -> `services/` (`services/example-service`)
- `auth` 도메인을 완전히 제거하고 `user` 도메인만 남겨 단순화
- `users` 도메인 하위 폴더 플랫화 (DTO 폴더 구조만 유지)
- 2026년 기준 NestJS 최신 생태계(Redis, S3, Prometheus, Terminus, ESLint v9, Prisma v6) 기술셋 추가
- 빌드와 모든 단위 테스트 정상 작동 검증

## 작업 순서 및 체크리스트

### 1단계: 디렉토리 명칭 변경 및 auth 제거
- [x] `apis` 디렉토리를 `services`로 변경
- [x] `services/example-service/src/auth` 디렉토리 완전 삭제
- [x] `services/example-service/src/app.module.ts`에서 `AuthModule` 임포트 제거

### 2단계: users 도메인 플랫화 (DTO 폴더 유지)
- [x] `users/controller/users.controller.ts` -> `users/users.controller.ts` 이동
- [x] `users/service/users.service.ts` -> `users/users.service.ts` 이동
- [x] `users/repository/users.repository.ts` -> `users/users.repository.ts` 이동
- [x] `users/controller/users.controller.spec.ts` -> `users/users.controller.spec.ts` 이동
- [x] `users/service/users.service.spec.ts` -> `users/users.service.spec.ts` 이동
- [x] `users/repository/users.repository.spec.ts` -> `users/users.repository.spec.ts` 이동
- [x] DTO 구조 (`users/dto/controller/`, `users/dto/service/`) 유지 확인
- [x] 불필요해진 빈 서브 디렉토리 삭제

### 3단계: 소스코드 내 auth 의존성 제거 및 경로 수정
- [x] `users.controller.ts`에서 `JwtAuthGuard` 가드 제거 및 `@ApiBearerAuth()` 제거
- [x] 플랫화에 따른 상대 임포트 경로 전면 수정 (`../dto/...` -> `./dto/...`, `../repository/...` -> `./users.repository` 등)
- [x] 테스트 파일들 내 임포트 경로 수정

### 4단계: 2026년 최신 기술셋 모듈 구성 (deartail 역할 대응)
- [x] `external/cache`: `ioredis` 라이브러리를 연동한 Redis 모듈 뼈대 작성
- [x] `external/storage`: `@aws-sdk/client-s3` 라이브러리를 연동한 AWS S3 모듈 뼈대 작성
- [x] `support/monitoring`: `@nestjs/terminus` 및 Prometheus 연동 모듈 뼈대 작성
- [x] `support/db-migration`: Prisma migrate 설정 연동 확인

### 5단계: 설정 파일 업데이트
- [x] `nest-cli.json` 내 `projects` 정보 갱신 (`services/example-service` 및 신규 라이브러리 등록)
- [x] `tsconfig.json` 내 path alias 설정 갱신 (`@service/example-service`, `@ext/cache`, `@ext/storage`, `@support/monitoring` 등)
- [x] `package.json` 스크립트 수정 (`nest start example-service` 등) 및 의존성 패키지 명시
- [x] `jest.config.ts` 및 `test/jest-e2e.json` 내 `roots` 및 `moduleNameMapper` 업데이트

### 6단계: E2E 테스트 수정 및 최종 검증
- [x] `test/users.e2e-spec.ts` 내 auth 관련 및 경로 수정
- [x] `pnpm install`로 신규 패키지 설치
- [x] `pnpm run lint` 수행 및 통과 검증 (통과)
- [x] `pnpm run build` 수행 및 통과 검증 (통과)
- [x] `pnpm run test` (단위 테스트) 실행 및 통과 검증 (20개 단위 테스트 통과)
