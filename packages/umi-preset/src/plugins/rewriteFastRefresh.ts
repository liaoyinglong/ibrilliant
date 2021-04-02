import type { IApi } from "umi";

export default function rewriteFastRefresh(api: IApi) {
  api.chainWebpack((config) => {
    config.plugin("fastRefresh").tap(([options]) => {
      return [
        {
          ...options,
          overlay: false,
          exclude: /node_modules/i,
          include: /\.([jt]sx)$/i,
        },
      ];
    });

    return config;
  });
}
