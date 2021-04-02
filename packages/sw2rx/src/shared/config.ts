import { cosmiconfig } from "cosmiconfig";

const explorer = cosmiconfig("sw2rx");

export async function getConfig() {
  const res = await explorer.search();
  return res.config as Config;
}

export interface Config {
  outputPath: string;
  swaggerUrls: {
    name: string;
    desc?: string;
    url: string;
  }[];
}
