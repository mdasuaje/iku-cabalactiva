module.exports = {
  testEnvironment: "node",
  testMatch: ["**/workspace/**/*.test.js"],
  rootDir: "/",
  collectCoverageFrom: ["**/workspace/**/*.js", "!**/workspace/**/*.test.js"]
};