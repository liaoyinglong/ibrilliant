export default () => {
  return {
    plugins: [
      require.resolve("./plugins/sass"),
      require.resolve("./plugins/css"),
      require.resolve("./plugins/rewriteFastRefresh"),
      require.resolve("./plugins/ignoreApisLib"),
      require.resolve("./plugins/emotion"),
      require.resolve("./plugins/webpack5"),
      require.resolve("./plugins/applyEsbuildInDev"),
    ],
  };
};
