/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.css$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        verbatimModuleSyntax: false
      }
    }]
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  errorOnDeprecated: true,
  testTimeout: 10000,
  verbose: true,
  injectGlobals: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globals: {
    chrome: {
      storage: {
        local: {
          get: () => Promise.resolve({}),
          set: () => Promise.resolve()
        }
      }
    }
  }
}; 