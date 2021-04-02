export default () => {
  return {
    plugins: [
      require.resolve("./plugins/rewriteFastRefresh"),
      require.resolve("./plugins/emotion"),
      require.resolve("./plugins/rewriteExtractCssLoader"),
      require.resolve("./plugins/rewritePostcssLoader"),
      require.resolve("./plugins/webpack5"),
      require.resolve("./plugins/applyEsbuildInDev"),
    ],
  };
};
