/** @type {import("jest").Config} */
/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
const config = {
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/$1",
  },
  rootDir: "src",
  testEnvironment: "node",
  testRegex: ".*\\.(test|spec)\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};

module.exports = config;
