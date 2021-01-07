import * as fs from "fs-extra";
import axios from "axios";
import {
  pathRelativeCwd,
  pathRelativeProject,
  spawnWork,
  delUnnecessaryFile,
} from "./helpers";
import { Config } from "./types";
import path from "path";
import { removeCannotParsedContent } from "./shared/removeCannotParsedContent";
import { Command } from "commander";
const version = require("../package").version;

const defaultConfigFileName = `sw2rx.config.js`;

const program = new Command();
program
  .version(version)
  .option(
    "-c, --config [fileName]",
    `指定配置文件路径，默认<root-dir>/${defaultConfigFileName}`
  )
  .option("--skipDownLoad", "跳过下载swagger.json步骤")
  .option("--keepTempFile", "跳过删除临时文件步骤")
  .parse(process.argv);

const config: Config = require(pathRelativeCwd(defaultConfigFileName));

const { outputPath, swaggerUrls } = config;

const tempPath = pathRelativeProject(".temp");

async function main() {
  if (!program.skipDownLoad) {
    await fs.emptyDir(outputPath);
    await fs.emptyDir(tempPath);
    console.log("清空上一版本文件 √");
  }
  for (const item of swaggerUrls) {
    const jsonPath = `${outputPath}/swagger-jsons/${item.name}.json`;

    if (!program.skipDownLoad) {
      const res = await axios.get(item.url);
      const fileData = removeCannotParsedContent(res.data);
      if (!fs.existsSync(jsonPath)) {
        await fs.createFile(jsonPath);
      }
      await fs.writeFile(jsonPath, JSON.stringify(fileData, null, 2));
      console.log(`更新【${item.name}】的swagger.json √`);
    }

    await spawnWork(
      [
        "openapi-generator-cli generate",
        `-i  ${jsonPath}`,
        `-g typescript-rxjs`,
        `-o ${tempPath}/${item.name}`,
        `--skip-validate-spec`,
        `-t ${pathRelativeProject("dist/template-typescript-rxjs")}`,
        `--additional-properties=supportsES6=true`,
      ].join(" ")
    );

    await fs.move(
      `${tempPath}/${item.name}/tsconfig.json`,
      `${tempPath}/tsconfig.json`,
      { overwrite: true }
    );

    await delUnnecessaryFile(tempPath, item.name);
  }
  await fs.copy(pathRelativeProject("dist/lib/runtime"), `${tempPath}/runtime`);
  console.log(`更新runtime文件 √`);

  await spawnWork(`tsc -p ${path.resolve(tempPath, "./tsconfig.json")}`);
  console.log(`使用tsc编译成功 √`);

  await fs.copy(`${tempPath}/dist`, outputPath);

  console.log(`copy到${outputPath}成功 √`);

  if (!program.keepTempFile) {
    await fs.remove(tempPath);
  }
}

main();
