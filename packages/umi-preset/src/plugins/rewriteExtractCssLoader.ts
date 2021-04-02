import { IApi } from "umi";

export default function rewriteExtractCssLoader(api: IApi) {
  api.chainWebpack((config) => {
    [
      config.module.rule("css").oneOf("css").use("extract-css-loader"),
      config.module.rule("css").oneOf("css-modules").use("extract-css-loader"),
      config.module.rule("less").oneOf("css").use("extract-css-loader"),
      config.module.rule("less").oneOf("css-modules").use("extract-css-loader"),
      config.module.rule("sass").oneOf("css").use("extract-css-loader"),
      config.module.rule("sass").oneOf("css-modules").use("extract-css-loader"),
    ].forEach((item) => {
      item.options({
        publicPath: api.userConfig.publicPath,
        hmr: api.env === "development",
      });
    });

    return config;
  });
}
