import type { IApi } from "umi";
import { signale } from "@umijs/utils";
import { ESBuildMinifyPlugin } from "./ESBuildMinifyPlugin";

export default function esBuildMinify(api: IApi) {
  if (api.env === "development") {
    return;
  }

  api.chainWebpack((config) => {
    // @ts-ignore
    config.optimization.minimizers.delete("terser");

    config.optimization.minimizer("esbuild-minify").use(ESBuildMinifyPlugin, [
      {
        target: "es2015",
        exclude: [
          /charting_library\/bundles\//,
          /charting_library\/charting_library\//,
          /NIM_Web_Chatroom_v.+/,
        ],
      },
    ]);

    signale.note("使用 esBuildMinify 压缩 js");

    return config;
  });
}
