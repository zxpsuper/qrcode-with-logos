module.exports = {
  rootDir: '..',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/e2e'],
  testMatch: ['**/cjs.test.ts', '**/umd.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        resolveJsonModule: true,
        esModuleInterop: true,
      }
    }],
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFiles: ['<rootDir>/e2e/setup.ts'],
  collectCoverage: false,
  verbose: true,
};
