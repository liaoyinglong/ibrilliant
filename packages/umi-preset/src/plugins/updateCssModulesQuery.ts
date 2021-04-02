import { IApi } from "umi";

export default function updateCssModulesQuery(api: IApi) {
  api.chainWebpack((config) => {
    [
      config.module.rule("css").oneOf("css-modules"),
      config.module.rule("less").oneOf("css-modules"),
      config.module.rule("sass").oneOf("css-modules"),
    ].forEach((item) => {
      item.resourceQuery(/modules?/);
    });

    return config;
  });
}
