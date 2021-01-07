import prettier from 'prettier';
import debug from 'debug';
import path from 'path';
import _, { Dictionary } from 'lodash';
import fs from 'fs-extra';

const log = debug('shared.ts');

export const defaultConfigFileName = 'locale-cli.config.js';

export function sortKeys(arr: any[], selector: Function = _.identity) {
  return _.orderBy(arr, selector, 'desc');
}

export async function formatStr(str: string) {
  const prettierConfigFilePath = await prettier.resolveConfigFile();
  log('prettierConfigFilePath = %s', prettierConfigFilePath);
  if (prettierConfigFilePath) {
    const options = await prettier.resolveConfig(prettierConfigFilePath);
    if (options) {
      options.parser = options.parser || 'json';
      // log('options = %o', options);
      return prettier.format(str, options);
    }
  }

  return str;
}

export async function formatAndWrite(
  filePath: string,
  data: Dictionary<any> | string
) {
  let content = typeof data === 'string' ? data : JSON.stringify(data);
  if (!fs.existsSync(filePath)) {
    await fs.createFile(filePath);
  }
  const formated = await formatStr(content);
  await fs.writeFile(filePath, formated);
}

function pathRelativeCwd(str: string) {
  return path.resolve(process.cwd(), str);
}

const otherConfig = {
  pathRelativeCwd,
  // 生成文件的名称
  name: '语言文件',
  //   临时文件夹
  tempDirPath: pathRelativeCwd('.localeHelperTemp'),
  xlsxColumTitles: ['字段', '中文', '英文', '日文', '韩文'],
  // xlsx 文件列的 顺序
  xlsxColums: [
    '', // 第一列默认是 key
    'zh_CN',
    'en',
    'ja_JP',
    'ko_KR',
  ],
};

const filePath = {
  zh_CN: pathRelativeCwd('./src/locale/zh_CN.json'),
  zh_HK: pathRelativeCwd('./src/locale/zh_HK.json'),
  en: pathRelativeCwd('./src/locale/en.json'),
  ko_KR: pathRelativeCwd('./src/locale/ko_KR.json'),
  ja_JP: pathRelativeCwd('./src/locale/ja_JP.json'),
};

type FilePathKeys = keyof typeof filePath;

type Config = typeof otherConfig & {
  filePath: typeof filePath;
  getTempXlsxFilePath: () => string;
} & Record<FilePathKeys, Dictionary<any>>;

export const config = {
  ...otherConfig,
  filePath,
  // xlsx 文件路径
  getTempXlsxFilePath() {
    return path.resolve(config.tempDirPath, `${config.name}.xlsx`);
  },
} as Config;
Object.keys(filePath).forEach((k) => {
  const p = filePath[k as FilePathKeys];
  try {
    if (p) {
      config[k as FilePathKeys] = require(p);
    }
  } catch (e) {
    console.log(e);
  }
});
export function tryMergeUserConfig(fileName = defaultConfigFileName) {
  try {
    const userConfig = require(pathRelativeCwd(fileName)) as Config;
    // @ts-ignore
    _.assign(config, userConfig);
  } catch (e) {
    log(e.message);
    log('未提供自定义配置，使用默认配置');
  }
}

export function defineConfig(config: Partial<Config>) {
  return config;
}
