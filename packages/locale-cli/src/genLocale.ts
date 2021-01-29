import xlsx from 'node-xlsx';
import _, {Dictionary} from 'lodash';
import {config, formatAndWrite, sortKeys} from './shared';
import {converCnToHk} from './genTraditional';
import {createLogger} from '@ibrilliant/utils';

const log = createLogger('[genLocale]');

type Langs = keyof typeof config.filePath;

export async function genLocale(shouldLoadOldJson = true) {
  const res = xlsx.parse(config.getTempXlsxFilePath());

  const arr = (res.find((item) => item.name === config.name)?.data ??
    []) as string[][];

  // 第一行是对应标识符 应该过滤掉
  const firstRow = _.head(arr);
  if (_.isEqual(config.xlsxColumTitles, firstRow)) {
    arr.shift();
  }

  const json = {} as Record<Langs, Dictionary<string>>;
  if (shouldLoadOldJson) {
    // 先保存旧的数据
    for (let i = 1; i < config.xlsxColums.length; i++) {
      const langName = config.xlsxColums[i];
      // @ts-ignore
      json[langName] = { ...config[langName] };
    }
  }

  const sortedArr = sortKeys(arr, (item: string[]) => item[0]);

  // 二维数组 转换成 json
  for (const row of sortedArr) {
    const key = row[0];

    for (let i = 1; i < config.xlsxColums.length; i++) {
      const langName = config.xlsxColums[i];
      let col = row[i] || '';

      // @ts-ignore
      const resource = json[langName] || (json[langName] = {});
      resource[key] = col || '';
    }
  }
  json.zh_HK = await converCnToHk(json.zh_CN);

  log(`将生成 【${Object.keys(json).join(',')}】 的语言文件`);

  for (const [langName, path] of Object.entries(config.filePath)) {
    await formatAndWrite(path, _.get(json, langName));
    log(`写入【${langName}】语言文件到【${path}】  √`);
  }
}
