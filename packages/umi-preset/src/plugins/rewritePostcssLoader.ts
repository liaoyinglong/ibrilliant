import { IApi } from "umi";

export default function rewritePostcssLoader(api: IApi) {
  api.chainWebpack((config) => {
    [
      config.module.rule("css").oneOf("css").use("postcss-loader"),
      config.module.rule("css").oneOf("css-modules").use("postcss-loader"),
      config.module.rule("less").oneOf("css").use("postcss-loader"),
      config.module.rule("less").oneOf("css-modules").use("postcss-loader"),
      config.module.rule("sass").oneOf("css").use("postcss-loader"),
      config.module.rule("sass").oneOf("css-modules").use("postcss-loader"),
    ].forEach((item) => {
      item.clear().loader(require.resolve("postcss-loader"));
    });

    return config;
  });
}
