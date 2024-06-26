import type { IApi } from "umi";
import { signale } from "@umijs/utils";

export default function applyEsbuildInDev(api: IApi) {
  api.describe({
    key: "applyEsbuildInDev",
    config: {
      schema(joi) {
        return joi.object();
      },
    },
    enableBy: api.EnableBy.config,
  });

  if (api.env !== "development") {
    return;
  }

  api.chainWebpack((config) => {
    config.module.rules
      .delete("ts-in-node_modules")
      .delete("js-in-node_modules");

    [
      config.module.rule("js").use("babel-loader"),
      config.module.rule("js-for-umi-dist").use("babel-loader"),
    ].forEach((item) => {
      item.tap(() => {
        return {};
      });

      item.loader(require.resolve("./esbuild-loader")).options({
        extraBabelPlugins: api.config.extraBabelPlugins,
      });
    });

    signale.note("使用 esbuild-loader 编译");

    return config;
  });
}
