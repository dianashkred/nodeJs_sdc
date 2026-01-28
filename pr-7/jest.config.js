module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
  "services/**/*.js",
  "auth/guard/**/*.js",
  "auth/utils/**/*.js",
  "models/**/**.validation.js",

  "!**/node_modules/**",
  "!**/routes/**",
  "!**/controllers/**",
  "!**/auth/auth.controller.js",
  "!**/auth/dto/**",
  "!**/models/**/index.js",
  "!**models/User/User.js",
  "!**models/Student/Student.js",
  "!**/models/**/**.types.js",
  "!**/database/**",
  "!**/config/**",
  "!**/swagger.js",
  "!**/api-server.js",
  "!**/reporters/**",
  "!**/services/BackupService.js",
  "!**/services/StudentDbService.js",
  "!**/services/users.service.js",
]
};
