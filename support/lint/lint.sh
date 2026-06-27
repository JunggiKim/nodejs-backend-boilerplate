#!/bin/sh
# support/lint/lint.sh
# ESLint 정적 코드 분석 자동 실행 스크립트

echo "Running static code analysis (ESLint)..."

pnpm run lint

if [ $? -eq 0 ]; then
  echo "Static analysis passed. No issues found."
else
  echo "Static analysis failed. Please fix the lint errors."
  exit 1
fi
