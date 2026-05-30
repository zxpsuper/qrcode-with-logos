module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  roots: ['<rootDir>/e2e'],
  testMatch: ['**/node.test.ts'],
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
  setupFiles: ['<rootDir>/e2e/setup.node.ts'],
  collectCoverage: false,
  verbose: true,
};