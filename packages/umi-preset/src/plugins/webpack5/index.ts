import type { IApi } from "umi";
import { signale } from "@umijs/utils";

export default function webpack5(api: IApi) {
  api.chainWebpack((config) => {
    config.optimization.delete("noEmitOnErrors").set("emitOnErrors", false);
    //region asset 不稳定，使用filecache会打包失败
    // config.output.set("assetModuleFilename", "static/[name].[hash:8][ext]");
    // config.module.rule("images").uses.clear().end().set("type", "asset");
    // config.module.rule("svg").uses.clear().end().set("type", "asset/resource");
    // config.module
    //   .rule("fonts")
    //   .uses.clear()
    //   .end()
    //   .set("type", "asset/resource");
    // config.module
    //   .rule("plaintext")
    //   .uses.clear()
    //   .end()
    //   .set("type", "asset/source ");
    // // @see https://webpack.js.org/guides/asset-modules/
    // signale.note("使用 webpack5 Asset Modules 处理图片等资源");
    //endregion
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
      signale.note("使用 CssMinimizerPlugin 压缩 css");
    }

    return config;
  });
}
