import type { IApi } from "umi";
import { signale } from "@umijs/utils";

export default function esBuildMinify(api: IApi) {
  if (api.env === "development") {
    return;
  }

  api.chainWebpack((config) => {
    // @ts-ignore
    config.optimization.minimizers.delete("terser");

    config.optimization
      .minimizer("esbuild-minify")
      .use(require.resolve("./ESBuildMinifyPlugin"), [{ target: "es2015" }]);

    signale.note("使用 esBuildMinify 压缩");

    return config;
  });
}
