import inquirer from 'inquirer';
import { genTraditional } from './genTraditional';
import { genLocale } from './genLocale';
import { genXlsx } from './genXlsx';
import { diffLocaleKeys } from './diffLocaleKeys';
import { Command } from 'commander';
import { defaultConfigFileName, tryMergeUserConfig } from './shared';
import { enableLogger } from '@ibrilliant/utils';
const version = require('../package').version;

enableLogger();
const program = new Command();
program
  .version(version)
  .option(
    '-c, --config [fileName]',
    `指定配置文件路径，默认<root-dir>/${defaultConfigFileName}`
  )
  .parse(process.argv);

tryMergeUserConfig(program.config);

main();

function main() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: '选择以下选项，回车确定',
        choices: [
          { name: '生成繁体文件(从简体文件转换)', value: genTraditional },
          { name: '生成excel文件', value: genXlsx },
          {
            name: 'excel生成语言配置文件(合并)',
            value: () => {
              genLocale(true);
            },
          },
          {
            name: 'excel生成语言配置文件(以excel的覆盖)',
            value: () => {
              genLocale(false);
            },
          },
          { name: '对比各个语言文件的key', value: diffLocaleKeys },
        ],
      },
    ])
    .then((answers) => {
      answers.action();
    });
}
