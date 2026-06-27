import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/services/', '<rootDir>/libs/', '<rootDir>/external/', '<rootDir>/support/'],
  moduleNameMapper: {
    '^@app/web-infra(|/.*)$': '<rootDir>/libs/web-infra/src/$1',
    '^@app/database(|/.*)$': '<rootDir>/libs/database/src/$1',
    '^@app/util(|/.*)$': '<rootDir>/libs/util/src/$1',
    '^@ext/aws(|/.*)$': '<rootDir>/external/aws/src/$1',
    '^@ext/cache(|/.*)$': '<rootDir>/external/cache/src/$1',
    '^@ext/storage(|/.*)$': '<rootDir>/external/storage/src/$1',
    '^@support/monitoring(|/.*)$': '<rootDir>/support/monitoring/src/$1',
    '^@service/example-service(|/.*)$': '<rootDir>/services/example-service/src/$1',
  },
};

export default config;
