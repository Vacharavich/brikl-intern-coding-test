/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ["<rootDir>/src/tests"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testEnvironment: "node",
};
