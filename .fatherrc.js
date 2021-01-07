/**
 * @type {import('father').IBundleOptions}
 */
const defaultOptions = {
  esm: "rollup",
  runtimeHelpers: true,
  extraExternals: [
    "react",
    "react-dom",
    "redux",
    "react-redux",
    "lodash",
    "@reduxjs/toolkit",
    "fast-deep-equal",
  ],
};

module.exports = defaultOptions;
