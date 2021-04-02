import { IApi } from "umi";

export default function css(api: IApi) {
  api.chainWebpack((config) => {
    [
      config.module.rule("css").oneOf("css"),
      config.module.rule("css").oneOf("css-modules"),
      config.module.rule("less").oneOf("css"),
      config.module.rule("less").oneOf("css-modules"),
      config.module.rule("sass").oneOf("css"),
      config.module.rule("sass").oneOf("css-modules"),
    ].forEach((item) => {
      item
        .use("postcss-loader")
        .clear()
        .loader(require.resolve("postcss-loader"));

      item.use("extract-css-loader").options({
        publicPath: api.userConfig.publicPath,
        hmr: api.env === "development",
      });
    });

    [
      config.module.rule("less").oneOf("css-modules"),
      config.module.rule("sass").oneOf("css-modules"),
    ].forEach((item) => {
      item.delete("resourceQuery");
    });

    return config;
  });
}
