import type { IApi } from "umi";

export default function applyEsbuildInDev(api: IApi) {
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

      item.loader(require.resolve("./esbuild.loader"));
    });

    config.devtool(false);

    return config;
  });
}
