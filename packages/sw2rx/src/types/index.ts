export interface Config {
  outputPath: string;
  swaggerUrls: {
    name: string;
    desc?: string;
    url: string;
  }[];
}
