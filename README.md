# NestJS Backend Monorepo Boilerplate

**A NestJS & TypeScript multi-module backend monorepo boilerplate.**

**nestjs/ts 멀티모듈기반 모노레포 보일러플레이트**

본 프로젝트는 TypeScript 및 NestJS 생태계에 맞춰 포팅하고, 실무 표준 기술셋(Prisma v6, Redis, Object Storage SDK, Prometheus, Terminus 헬스 체크, ESLint v9, SWC)을 탑재한 보일러플레이트입니다.

---

## 1. 프로젝트 개요

- **목적**: NestJS 표준 패턴의 모노레포 아키텍처 보일러플레이트.
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
├── prisma/
│   └── schema.prisma              # 단일 소스 DB 엔티티/스키마 정의 파일
│
├── services/                      # 1. 하위의 독립 실행가능한 애플리케이션 목록들
│   └── example-service/           # 회원 및 핵심 API 제공용 실행 모듈
│       └── src/
│           ├── main.ts            # 어플리케이션 진입점 및 부트스트랩
│           ├── app.module.ts      # 글로벌 의존성 조립 모듈
│           └── users/             # 사용자 도메인
│               ├── dto/           # 레이어별 dto
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
    ├── db-migration/              # Prisma Migrate 배포 자동화 스크립트
    ├── static-analysis/           # ESLint 및 Prettier 캡슐화 정적분석 모듈
    │   ├── src/                   # 정적분석 제공 서비스 및 인터페이스
    │   ├── eslint.config.mjs      # ESLint v9 Flat Config 규칙
    │   ├── .prettierrc            # 코드 포맷터 규칙
    │   ├── tsconfig.lib.json      # 모듈 빌드 설정
    │   └── lint.sh                # 정적분석 자동화 쉘 스크립트
    └── monitoring/                # Terminus 헬스체크 및 Prometheus 메트릭스 모니터링 컨트롤러
```
