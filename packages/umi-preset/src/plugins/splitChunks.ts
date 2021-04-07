import { IApi } from "umi";

export default function splitChunks(api: IApi) {
  // @ts-ignore
  api.modifyHTMLChunks((memo, options) => {
    const { chunks } = options;

    const res = chunks
      .filter((item) => item.canBeInitial() || item.isOnlyInitial())
      .map((item) => item.name || item.id);

    console.log("[modifyHTMLChunks]: 入口 chunks", res);

    return res;
  });

  api.chainWebpack((config) => {
    config.optimization
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      .splitChunks({
        chunks: "all",
      })
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      .runtimeChunk({
        // @ts-ignore
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      });

    return config;
  });
}
