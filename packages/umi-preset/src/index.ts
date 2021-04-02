export default () => {
  return {
    plugins: [
      require.resolve("./plugins/sass"),
      require.resolve("./plugins/rewriteFastRefresh"),
      require.resolve("./plugins/ignoreApisLib"),
      require.resolve("./plugins/emotion"),
      require.resolve("./plugins/rewriteExtractCssLoader"),
      require.resolve("./plugins/rewritePostcssLoader"),
      require.resolve("./plugins/updateCssModulesQuery"),
      require.resolve("./plugins/webpack5"),
      require.resolve("./plugins/applyEsbuildInDev"),
    ],
  };
};
