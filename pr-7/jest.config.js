module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "services/**/*.js",
    "auth/**/*.js",
    "utils/**/*.js",
    "models/**/*.js",
    "!**/node_modules/**",
    "!**/routes/**",
    "!**/database/**",
    "!**/config/**",
    "!**/swagger.js",
    "!**/api-server.js",
  ],
  coverageReporters: ["text", "html"],
};
