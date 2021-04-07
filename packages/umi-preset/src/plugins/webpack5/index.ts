import type { IApi } from "umi";

export default function webpack5(api: IApi) {
  api.chainWebpack((config) => {
    [
      config.module.rule("images"),
      config.module.rule("svg"),
      config.module.rule("fonts"),
      config.module.rule("plaintext"),
    ].forEach((item) => {
      item.set("type", "javascript/auto");
    });

    [
      config.module.rule("js").use("babel-loader"),
      config.module.rule("js-for-umi-dist").use("babel-loader"),
      config.module.rule("ts-in-node_modules").use("babel-loader"),
      config.module.rule("js-in-node_modules").use("babel-loader"),
    ].forEach((item) => {
      item.tap((options = {}) => {
        options.cacheDirectory = false;
        return options;
      });
    });
    if (api.env !== "development") {
      config.plugins.delete("optimize-css");
      config.optimization
        .minimizer("CssMinimizerPlugin")
        .use(require.resolve("css-minimizer-webpack-plugin"), []);
    }

    return config;
  });
}
