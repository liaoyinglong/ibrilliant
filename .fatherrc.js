/**
 * @type {import('father').IBundleOptions}
 */
const defaultOptions = {
  esm: "rollup",
  runtimeHelpers: true,
  extraExternals: [
    "react",
    "react-redux",
    "react-dom",
    "react-router",
    "react-router-dom",
    "redux",

    "lodash",
    "@reduxjs/toolkit",
    "fast-deep-equal",
    "rxjs",
  ],
};

module.exports = defaultOptions;
