import xlsx from 'node-xlsx';
import fs from 'fs-extra';
import { config, sortKeys } from './shared';
import _, { Dictionary } from 'lodash';
import { createLogger } from '@ibrilliant/utils';

const log = createLogger('[语言文件转换成xlsx]');

function len(obj: Dictionary<any>) {
  return Object.keys(obj || {}).length;
}

export async function genXlsx() {
  if (!fs.existsSync(config.tempDirPath)) {
    await fs.mkdir(config.tempDirPath);
  }
  const tips = config.xlsxColums.map((localeName) => {
    if (localeName === '') {
      return '';
    }
    return `${localeName}: ${len(_.get(config, localeName))}`;
  });

  log(`【各语言key的数量】  ${tips.join(' ')}`);

  const keys = sortKeys(Object.keys(config.zh_CN));

  let data: any[][] = keys.map((k) => {
    /* prettier-ignore */

    return  config.xlsxColums.map(localeName=>{
      if (localeName === '') {
        return k
      }
      // @ts-ignore
      return config?.[localeName]?.[k]
    })
  });
  data.unshift(config.xlsxColumTitles);

  const xlsxBuffer = xlsx.build([{ name: config.name, data }]);

  // 生成的 xlsx 文件路径
  const outputPath = config.getTempXlsxFilePath();

  if (!fs.existsSync(outputPath)) {
    await fs.createFile(outputPath);
  }

  await fs.writeFile(outputPath, xlsxBuffer);

  // log('config = %O', config);
  log(`生成【 ${outputPath}】文件成功`);
}
