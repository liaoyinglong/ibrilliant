import { config } from './shared';
import _ from 'lodash';
import debug from 'debug';
debug.enable('*');
const log = debug('[比对语言文件是否一致]');

/**
 * 输入 ：
 *  第一列默认是 key
 *   ['', 'zh_CN', 'en', 'zh_HK']
 * 输出
 *   [ [ 'zh_CN', 'en' ], [ 'zh_CN', 'zh_HK' ], [ 'en', 'zh_HK' ] ]
 */
const shouldDiffKeysArr = (() => {
  // 去除第一个
  const langNames = _.drop(config.xlsxColums);

  const arr = [];
  for (let i = 0; i < langNames.length; i++) {
    for (let j = i; j < langNames.length; j++) {
      if (langNames[i] !== langNames[j]) {
        arr.push([langNames[i], langNames[j]]);
      }
    }
  }
  return arr;
})();

export const diffLocaleKeys = () => {
  shouldDiffKeysArr.forEach((arr) => {
    const [a, b] = arr;

    // @ts-ignore
    const aKeys = Object.keys(config[a]);
    // @ts-ignore
    const bKeys = Object.keys(config[b]);

    let res1 = _.difference(aKeys, bKeys);

    // @ts-ignore
    let res2 = _.difference(bKeys, aKeys);

    if (res1.length || res2.length) {
      log(`【${a}】 与 【${b}】 语言文件不一致`);
      log(`${a} vs ${b} : %o`, res1);
      log(`${b} vs ${a} : %o`, res2);
    } else {
      log(`【${a}】 与 【${b}】 语言文件一致`);
    }
  });
};
