/**
 * 暂时弃用 father-build 来构建
 * 后续引入部分ui可能会启用
 *
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
    "qs",
  ],
};

module.exports = defaultOptions;
