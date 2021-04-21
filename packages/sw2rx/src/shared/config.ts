import { cosmiconfig } from "cosmiconfig";

const explorer = cosmiconfig("sw2rx");

export async function getConfig() {
  const res = await explorer.search();
  return res.config as Config;
}

export interface Config {
  // 输出文件夹路径
  outputPath: string;
  swaggerUrls: {
    // 对应swagger输出文件夹name
    name: string;
    // swagger描述
    desc?: string;
    // swagger 地址
    url: string;
  }[];
}
