import type { IBundleOptions } from "father";

const options: IBundleOptions = {
  esm: "rollup",
  runtimeHelpers:true,
  extraExternals:[
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'lodash',
    '@reduxjs/toolkit',
    'fast-deep-equal',
  ]
};

export default options;
