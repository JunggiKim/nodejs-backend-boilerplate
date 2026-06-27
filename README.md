# NestJS Backend Monorepo Boilerplate

**A NestJS & TypeScript multi-module backend monorepo boilerplate.**

**nestjs/ts 멀티모듈기반 모노레포 보일러플레이트**

본 프로젝트는 TypeScript 및 NestJS 생태계에 맞춰 포팅하고, 실무 표준 기술셋(Prisma v6, Redis, Object Storage SDK, Prometheus, Terminus 헬스 체크, ESLint v9, SWC)을 탑재한 보일러플레이트입니다.

---

## 1. 프로젝트 개요

- **목적**: NestJS 표준 패턴의 모노레포 아키텍처 보일러플레이트.
- **특징**:
  - `services/`: 하위의 독립 실행가능한 애플리케이션 목록들.
  - `libs/`: 공통 웹 인프라 공유 모듈 목록.
  - `external/`: 외부 시스템의 데이터베이스 연결, 캐시, 스토리지, 메시지큐 기능 모듈들 목록.
  - `support/`: 데이터베이스 마이그레이션, 모니터링, 정적 분석 린트 등 시스템 및 레포지토리 지원 모듈 목록.

---

## 2. 디렉토리 구조 및 역할

```
nestjs-backend/
├── package.json                   # 루트 패키지 및 워크스페이스 의존성 중앙 통제
├── pnpm-workspace.yaml            # pnpm 모노레포 패키지 경로 지정
├── nest-cli.json                  # monorepo 빌드 타겟 및 SWC 컴파일러 플러그인 지정
├── tsconfig.json                  # strict 옵션이 활성화된 전체 공통 TSConfig
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
│   ├── web-infra/                 # 웹 인프라 모듈
│   └── util/                      # 공통 유틸리티 모듈
│
├── external/                      # 3. 외부 시스템의 데이터베이스 연결, 캐시, 스토리지, 메시지큐 기능 모듈들 목록
│   ├── database/                  # 데이터베이스 연결 모듈
│   ├── cache/                     # 캐시 서비스 모듈
│   ├── message-queue/             # 메시지큐 모듈
│   └── storage/                   # 오브젝트 스토리지 모듈
│
└── support/                       # 4. 데이터베이스 마이그레이션, 모니터링, 정적 분석 린트 등 시스템 및 레포지토리 지원 모듈 목록
    ├── db-migration/              # 데이터베이스 마이그레이션 모듈
    ├── lint/                      # 정적분석 및 린트 모듈
    └── monitoring/                # 모니터링 모듈
```
