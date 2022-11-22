module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '/src/*.test|spec.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  testEnvironment: 'node',
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // "text-summary"
}
