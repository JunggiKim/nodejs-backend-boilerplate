# NestJS Backend Monorepo Boilerplate

**nestjs/ts 멀티모듈기반 모노레포 보일러플레이트**

본 프로젝트는 TypeScript 및 NestJS 생태계에 맞춰 포팅하고, 실무 표준 기술셋(Prisma v6, Redis, AWS S3 SDK v3, Prometheus, Terminus 헬스 체크, ESLint v9 Flat Config, SWC)을 탑재한 완성형 보일러플레이트입니다.

---

## 1. 프로젝트 개요

- **목적**: NestJS 표준 패턴의 모노레포 아키텍처 학습 및 실무 보일러플레이트.
- **특징**:
  - `services/`: 하위의 독립 실행가능한 애플리케이션 목록들.
  - `libs/`: 공통 웹 인프라 및 전역 데이터베이스 접근 공유 모듈 목록.
  - `external/`: 외부 의존성의 캐시, 스토리지 기능 모듈들 목록.
  - `support/`: 데이터 마이그레이션, 모니터링, 정적 분석 린트 등 시스템 및 레포지토리 지원 모듈 목록.

---

## 2. 디렉토리 구조 및 역할

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
├── services/                      # 1. 하위의 독립 실행가능한 애플리케이션 목록들
│   └── example-service/           # 회원 및 핵심 API 제공용 실행 모듈
│       └── src/
│           ├── main.ts            # 어플리케이션 진입점 및 부트스트랩
│           ├── app.module.ts      # 글로벌 의존성 조립 모듈
│           └── users/             # 사용자 도메인
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
│   ├── web-infra/                 # 웹 프레임워크 표준 응답(ApiResult), 예외 필터
│   ├── database/                  # PrismaService, PrismaModule을 포함하는 전역 DB 연결 모듈
│   └── util/                      # DateTimeUtil 등 순수 비즈니스 공통 헬퍼 라이브러리
│
├── external/                      # 3. 외부 의존성의 캐시, 스토리지 기능 모듈들 목록
│   ├── cache/                     # Redis 캐싱 서비스 (ioredis 캡슐화 및 CacheRepository 제어)
│   ├── message-queue/             # 이벤트 메시지 전송 및 발행/구독 연동 모듈
│   └── storage/                   # 오브젝트 스토리지 파일 업로드 연동 모듈
│
└── support/                       # 4. 데이터 마이그레이션, 모니터링, 정적 분석 린트 등 시스템 및 레포지토리 지원 모듈 목록
    ├── db-migration/              # Prisma Migrate 배포 자동화 및 시딩 스크립트
    ├── static-analysis/           # ESLint 및 코드 품질 분석 자동화 스크립트
    └── monitoring/                # Terminus 헬스체크 및 Prometheus 메트릭스 모니터링 컨트롤러
```

---

## 3. 아키텍처 컨벤션 및 팩트

### 3-1. 계층 격리 및 DTO 흐름 규칙
모든 도메인 작업은 외부의 물리적/논리적 변경 사항이 인접 비즈니스 코드에 전파되지 않도록 설계 단계에서 완전히 격리합니다.
- **Request DTO** ([create-user.request.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/controller/create-user.request.ts)): 외부 HTTP 입력을 파싱하고 유효성을 1차 검사합니다.
- **Command DTO** ([create-user.command.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/service/create-user.command.ts)): 비즈니스 서비스 레이어가 실행을 위해 제공받는 도메인 중심의 안전한 Command 명세입니다.
- **Db DTO** ([create-user-db.dto.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/repository/create-user-db.dto.ts)): 데이터베이스 테이블에 접근할 때 ORM(Prisma) 타입에 종속되지 않도록 리포지토리 레이어만을 위해 데이터 필드를 정의한 DTO입니다.
- **Response DTO** ([user.response.ts](file:///Users/kjg/workspace/solodev_root/learn-projects/nestjs-backend/services/example-service/src/users/dto/controller/user.response.ts)): Prisma DB 엔티티가 비즈니스 서비스 밖으로 유출되는 것을 차단하고 클라이언트에 리턴될 필드만 노출합니다.
