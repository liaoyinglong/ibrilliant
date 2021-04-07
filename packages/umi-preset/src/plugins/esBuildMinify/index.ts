import { ESBuildMinifyPlugin } from "./ESBuildMinifyPlugin";
import type { IApi } from "umi";

export default function umiEsbuild(api: IApi) {
  if (api.env === "development") {
    return;
  }

  api.chainWebpack((config) => {
    // @ts-ignore
    config.optimization.minimizers.delete("terser");

    config.optimization
      .minimizer("esbuild-minify")
      .use(ESBuildMinifyPlugin, [{ target: "es2015" }]);

    return config;
  });
}
