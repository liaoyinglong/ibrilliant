const { join } = require("path");

module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  rootDir: ".",
  collectCoverageFrom: ["./src/**/*.{ts,tsx}"],
  // moduleNameMapper: {
  //   "@sigi/([^/]+)(.*)$": "<rootDir>/packages/$1/src$2",
  // },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/examples/",
    "\\.js$",
    "\\.d\\.ts$",
  ],
};
