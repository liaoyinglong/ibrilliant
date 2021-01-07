import opencc from 'opencc';
import { Dictionary } from 'lodash';
import { config, formatAndWrite } from './shared';
import debug from 'debug';

debug.enable('*');
const log = debug('[简体转繁体]');

export async function converCnToHk(cnJson = config.zh_CN) {
  const converter = new opencc.OpenCC('s2t.json');
  const zh_HK: Dictionary<string> = {};

  for (const [key, value] of Object.entries(cnJson)) {
    const result = await converter.convertPromise(value as string);
    zh_HK[key] = result;
  }
  return zh_HK;
}

export async function genTraditional() {
  const zh_HK: Dictionary<string> = await converCnToHk();

  await formatAndWrite(config.filePath.zh_HK, zh_HK);

  log('更新 【%s】 繁体文件成功', config.filePath.zh_HK);
}
