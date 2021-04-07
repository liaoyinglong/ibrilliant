import type { IApi } from "umi";
import { signale } from "@umijs/utils";

export default function ignoreApisLib(api: IApi) {
  api.chainWebpack((config) => {
    config.module.rule("js").exclude.add((p: string) => {
      // sw2rx 工具会生成es5的代码
      if (p.includes("apis/lib") || p.includes("apis\\lib")) {
        return true;
      }
      return false;
    });

    signale.note("忽略 apis/lib");

    return config;
  });
}
