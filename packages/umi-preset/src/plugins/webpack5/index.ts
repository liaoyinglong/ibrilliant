import type { IApi } from "umi";
import { signale } from "@umijs/utils";

export default function webpack5(api: IApi) {
  api.chainWebpack((config) => {
    config.optimization.delete("noEmitOnErrors").set("emitOnErrors", false);
    //region asset 不稳定，使用filecache会打包失败
    // RealContentHashPlugin
    // Some kind of unexpected caching problem occurred.
    //   An asset was cached with a reference to another asset (89fd473c) that's not in the compilation anymore.
    // Either the asset was incorrectly cached, or the referenced asset should also be restored from cache.
    //   Referenced by:
    //   - umi.847ed504.css: ...ound:url(/static/bg.89fd473c.png) no-repeat top}...
    // @see https://webpack.js.org/guides/asset-modules/
    // signale.note("使用 webpack5 Asset Modules 处理图片等资源");
    // config.output.set("assetModuleFilename", "static/[name].[hash:8][ext]");
    // [
    //   config.module.rule("images").set("type", "asset"),
    //   config.module.rule("plaintext").set("type", "asset/source "),
    // ].forEach((item) => item.uses.clear());
    // [
    //   // config.module.rule("images"),
    //   config.module.rule("svg"),
    //   config.module.rule("fonts"),
    //   // config.module.rule("plaintext"),
    // ].forEach((item) => {
    //   item.set("type", "javascript/auto");
    // });

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
        .use(require.resolve("css-minimizer-webpack-plugin"), [
          {
            exclude: [
              /charting_library\/bundles\//,
              /charting_library\/charting_library\//,
              /NIM_Web_Chatroom_v.+/,
            ],
          },
        ]);
      signale.note("使用 CssMinimizerPlugin 压缩 css");
    }

    return config;
  });
}
