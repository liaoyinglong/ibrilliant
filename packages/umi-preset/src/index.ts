export default () => {
  return {
    plugins: [
      require.resolve("./plugins/sass"),
      require.resolve("./plugins/css"),

      require.resolve("./plugins/rewriteFastRefresh"),
      require.resolve("./plugins/emotion"),

      require.resolve("./plugins/ignoreApisLib"),

      require.resolve("./plugins/webpack5"),
      require.resolve("./plugins/splitChunks"),

      require.resolve("./plugins/applyEsbuildInDev"),
      // 暂时禁用等esbuild稳定后开启
      // https://github.com/evanw/esbuild/issues/1121
      require.resolve("./plugins/esBuildMinify"),
    ],
  };
};
