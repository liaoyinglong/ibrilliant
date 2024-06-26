import type { IApi } from "umi";
import { signale } from "@umijs/utils";

export default emotion;

function emotion(api: IApi) {
  api.modifyBabelPresetOpts((options) => {
    return {
      ...options,
      react: {
        runtime: "automatic",
        importSource: "@emotion/react",
      },
    };
  });

  api.modifyBabelOpts((babelOpts) => {
    babelOpts.plugins.unshift([
      require.resolve("@emotion/babel-plugin"),
      {
        // sourceMap is on by default but source maps are dead code eliminated in production
        sourceMap: api.env === "development",
        autoLabel: "dev-only",
        labelFormat: "[local]",
        cssPropOptimization: true,
      },
    ]);
    return babelOpts;
  });

  signale.note("配置 emotion ");
}
