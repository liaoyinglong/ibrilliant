const options = require("../../.fatherrc");

module.exports = {
  ...options,
  entry: ["src/index.ts", "src/operators.ts"],
};
