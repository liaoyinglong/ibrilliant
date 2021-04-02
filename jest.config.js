module.exports = {
  transform: { "^.+\\.tsx?$": "custom-esbuild-jest" },
  rootDir: ".",
  collectCoverageFrom: [
    "packages/*/src/**/*.{ts,tsx}",
    "!packages/**/*.spec.{ts,tsx}",
    "!packages/**/*.test.{ts,tsx}",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/examples/",
    "\\.js$",
    "\\.d\\.ts$",
  ],
};
