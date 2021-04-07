import type { IApi } from "umi";

export default function webpack5(api: IApi) {
  api.chainWebpack((config) => {
    [
      config.module.rule("images").use("url-loader"),
      config.module.rule("svg").use("file-loader"),
      config.module.rule("fonts").use("file-loader"),
      config.module.rule("plaintext").use("raw-loader"),
    ].forEach((item) => {
      item.tap((opts = {}) => {
        opts.type = "javascript/auto";
        if (opts.fallback?.options) {
          opts.fallback.options.type = "javascript/auto";
        }
        return opts;
      });
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
