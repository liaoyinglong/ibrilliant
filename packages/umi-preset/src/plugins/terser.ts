import type { IApi } from "umi";

export default function esBuildMinify(api: IApi) {
  if (api.env === "development") {
    return;
  }

  api.chainWebpack((config) => {
    config.optimization.minimizer("terser").tap(([options]) => {
      return [
        {
          exclude: [
            /charting_library\/bundles\//,
            /charting_library\/charting_library\//,
            /NIM_Web_Chatroom_v.+/,
          ],
          ...options,
        },
      ];
    });
    return config;
  });
}
