import type { IApi } from "umi";

export default function ignoreApisLib(api: IApi) {
  api.chainWebpack((config) => {
    config.module.rule("js").exclude.add((p: string) => {
      // sw2rx 工具会生成es5的代码
      if (p.includes("apis/lib") || p.includes("apis\\lib")) {
        return true;
      }
      return false;
    });

    return config;
  });
}
