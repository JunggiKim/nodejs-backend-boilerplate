# NestJS Backend Monorepo Boilerplate

**nestjs/ts 멀티모듈기반 모노레포 보일러플레이트**

본 프로젝트는 Kotlin/Spring Boot 멀티모듈 아키텍처를 TypeScript 및 NestJS 생태계에 맞춰 포팅하고, 2026년 기준 실무 표준 기술셋(Prisma v6, Redis, AWS S3 SDK v3, Prometheus, Terminus 헬스 체크, ESLint v9 Flat Config, SWC)을 탑재한 완성형 보일러플레이트입니다.

---

## 1. 프로젝트 개요

- **목적**: Spring Boot 멀티모듈 패턴의 강한 결합 제어 및 계층 격리 기법을 NestJS 생태계 표준으로 매핑한 아키텍처 학습 및 실무 보일러플레이트.
- **특징**:
  - `services/` 하위의 독립 실행 서비스 아키텍처.
  - `libs/` 하위의 비즈니스 웹 공통 및 DB 라이브러리 격리.
  - `external/` 하위의 외부 의존(Redis, AWS S3) 라이브러리 차단 및 추상 클래스/인터페이스 주입.
  - `support/` 하위의 운영 및 품질 도구(마이그레이션, 모니터링, 린터) 모듈화.
- **아키텍처**: Layered Architecture (Controller ➔ Service ➔ Repository ➔ Prisma ➔ PostgreSQL)

---

## 2. 기술 스택 (2026년 표준 스펙)

| 구분 | 라이브러리 | 버전 | 설명 |
|---|---|---|---|
| **Core** | **NestJS** | v10 | 선언적 DI(의존성 주입) 및 데코레이터 표준 프레임워크 |
| **Compiler** | **SWC** | - | Rust 기반 초고속 TypeScript 컴파일러 (tsc 대비 10배 이상 빌드 속도) |
| **Language** | **TypeScript** | v5 strict | strictNullChecks, noUncheckedIndexedAccess 옵션 활성화 |
| **ORM** | **Prisma** | v6 | 타입 안전 자동 쿼리 빌더 및 선언적 DB 스키마 모델링 |
| **Cache** | **ioredis** | v5 | 고성능 Redis 클라이언트 드라이버 |
| **Storage** | **@aws-sdk/client-s3** | v3 | AWS S3 업로드용 최신 SDK v3 모듈 |
| **Health Check** | **@nestjs/terminus** | v10 | 어플리케이션 및 의존 환경 가용성 상태 체크 도구 |
| **Metrics** | **@willsoto/nestjs-prometheus** | v6 | 프로메테우스 시계열 메트릭 수집 엔드포인트 `/metrics` 연동 |
| **Logging** | **nestjs-pino + pino-http** | v4 / v10 | 고성능 구조화 JSON 로깅 환경 |
| **Docs** | **@nestjs/swagger** | v8 | OpenAPI 3.0 명세서 자동 연동 및 API Docs 웹 노출 |

---

## 3. 디렉토리 구조 및 역할

```
nestjs-backend/
├── package.json                   # 루트 패키지 및 워크스페이스 의존성 중앙 통제
├── pnpm-workspace.yaml            # pnpm 모노레포 패키지 경로 지정
├── nest-cli.json                  # monorepo 빌드 타겟 및 SWC 컴파일러 플러그인 지정
├── tsconfig.json                  # strict 옵션이 활성화된 전체 공통 TSConfig
├── eslint.config.mjs              # ESLint v9 Flat Config 정적분석 룰
├── prisma/
│   └── schema.prisma              # 단일 소스 DB 엔티티/스키마 정의 파일
│
├── services/                      # 1. 독립 실행 가능한 애플리케이션 레이어 (apis/ -> services/ 변경)
│   └── example-service/           # 회원 및 핵심 API 제공용 실행 모듈
│       └── src/
│           ├── main.ts            # 어플리케이션 진입점 및 부트스트랩
│           ├── app.module.ts      # 글로벌 의존성 조립 모듈
│           └── users/             # 사용자 도메인 (구현 단순화를 위해 플랫 구조화)
│               ├── dto/           # DTO 영역은 계층 분리 컨벤션 유지
│               │   ├── controller/# API 입출력 경계 DTO (Request/Response)
│               │   ├── service/   # 비즈니스 서비스용 입력 DTO (Command)
│               │   └── repository/# 리포지토리 레이어용 데이터 바인딩 DTO (DbDto)
│               ├── users.controller.ts
│               ├── users.service.ts
│               ├── users.repository.ts
│               └── users.module.ts
│
├── libs/                          # 2. 비즈니스 공유 라이브러리 레이어
│   ├── web-infra/                 # 웹 프레임워크 표준 응답(ApiResult), 예외 필터 (common -> web-infra 변경)
│   ├── database/                  # PrismaService, PrismaModule을 포함하는 전역 DB 연결 모듈
│   └── util/                      # DateTimeUtil 등 순수 비즈니스 공통 헬퍼 라이브러리
│
├── external/                      # 3. 외부 타사 서비스 격리 레이어 (타사 의존 전파 차단)
│   ├── aws/                       # AWS 공통 인프라
│   ├── cache/                     # Redis 캐싱 서비스 (ioredis 캡슐화 및 CacheRepository 제어)
│   └── storage/                   # AWS S3 파일 스토리지 업로드 격리 모듈
│
└── support/                       # 4. 운영 지원 및 시스템 도구 레이어
    ├── db-migration/              # Prisma Migrate 배포 자동화 및 시딩 스크립트
    ├── static-analysis/           # ESLint 및 코드 품질 분석 자동화 스크립트
    └── monitoring/                # Terminus 헬스체크 및 Prometheus 메트릭스 모니터링 컨트롤러
```

---

## 4. 아키텍처 컨벤션 및 팩트

### 4-1. 계층 격리 및 DTO 흐름 규칙
모든 도메인 작업은 외부의 물리적/논리적 변경 사항이 인접 비즈니스 코드에 전파되지 않도록 설계 단계에서 완전히 격리합니다.
- **Request DTO** ([create-user.request.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/controller/create-user.request.ts)): 외부 HTTP 입력을 파싱하고 유효성을 1차 검사합니다.
- **Command DTO** ([create-user.command.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/service/create-user.command.ts)): 비즈니스 서비스 레이어가 실행을 위해 제공받는 도메인 중심의 안전한 Command 명세입니다.
- **Db DTO** ([create-user-db.dto.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/repository/create-user-db.dto.ts)): 데이터베이스 테이블에 접근할 때 ORM(Prisma) 타입에 종속되지 않도록 리포지토리 레이어만을 위해 데이터 필드를 정의한 DTO입니다.
- **Response DTO** ([user.response.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/controller/user.response.ts)): Prisma DB 엔티티가 비즈니스 서비스 밖으로 유출되는 것을 차단하고 클라이언트에 리턴될 필드만 노출합니다.

### 4-2. 느슨한 결합을 위한 DI 문자열 토큰 기법
TypeScript 컴파일 완료 시 인터페이스 정보가 런타임 자바스크립트에서 사라지는 한계를 해소하기 위해, `CACHE_REPOSITORY_TOKEN` 상수를 활용하여 의존성을 주입합니다. 이를 통해 향후 Redis에서 다른 인프라 캐시로 갈아끼울 때 비즈니스 코드를 전혀 수정하지 않고 주입 바인딩만 교체 가능합니다.

---

## 5. 로컬 실행 가이드

### 사전 설치 항목
- Node.js v22 이상
- pnpm v11 이상
- Docker Desktop

### 1단계: 환경변수 동기화
`.env.example` 스펙을 복사하여 `.env` 파일을 생성합니다.
```bash
cp .env.example .env
```

### 2단계: 의존 패키지 설치 및 빌드
```bash
pnpm install
```

### 3단계: 로컬 DB 실행 및 마이그레이션
```bash
pnpm db:up
pnpm prisma:migrate # 마이그레이션 생성 시 이름 입력 (예: init)
```

### 4단계: 개발 서버 기동
```bash
pnpm start:dev
```
- **API 서버 주소**: `http://localhost:3000`
- **Swagger 문서 주소**: `http://localhost:3000/api-docs`
- **프로메테우스 메트릭 수집**: `http://localhost:3000/metrics`
- **어플리케이션 헬스체크**: `http://localhost:3000/health`

---

## 6. 테스트 및 도구 실행

### 단위 테스트
```bash
pnpm test
```

### 마이그레이션 배포 자동화
운영 및 CD 배포 환경에서 Prisma Migrate를 전파하기 위해 신설한 스크립트를 활용합니다:
```bash
bash support/db-migration/migrate.sh
```

### 정적 분석 툴 가동
코드 작성 규칙을 검사하고 자동 포맷팅하기 위해 정적 분석 스크립트를 가동합니다:
```bash
bash support/static-analysis/lint.sh
pnpm format
```
