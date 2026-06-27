#!/bin/sh
# support/db-migration/migrate.sh
# Prisma 데이터베이스 마이그레이션 배포 자동화 스크립트

echo "Starting database migration deployment..."

# DATABASE_URL 환경변수 존재 유무 확인
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

# Prisma Client 생성 코드 빌드
pnpm prisma generate

# 배포용 마이그레이션 SQL 스크립트 순차 적용 (Flyway의 migrate와 동일)
pnpm prisma migrate deploy

echo "Database migration successfully deployed."
