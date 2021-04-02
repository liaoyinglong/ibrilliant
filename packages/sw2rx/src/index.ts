import * as fs from "fs-extra";
import axios from "axios";
import { delUnnecessaryFile, spawnWork } from "./helpers";
import path from "path";
import { removeCannotParsedContent } from "./shared/removeCannotParsedContent";
import { Command } from "commander";
import { createLogger, enableLogger } from "@ibrilliant/utils";
import { setOpenapitoolsConfig } from "./shared/setOpenapitoolsConfig";
import { normalizeResponseType } from "./shared/normalizeResponseType";
import { getConfig } from "./shared/config";
import { paths } from "./shared/paths";

enableLogger("sw2rx*");

const version = require("../package").version;

const defaultConfigFileName = `sw2rx.config.js`;

const log = createLogger("sw2rx");
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

async function main() {
  const config = await getConfig();
  const tempPath = paths.tempPath;

  const { outputPath, swaggerUrls } = config;

  await setOpenapitoolsConfig();
  if (!program.skipDownLoad) {
    await fs.emptyDir(outputPath);
    await fs.emptyDir(tempPath);
    log("清空上一版本文件 √");
  }
  for (const item of swaggerUrls) {
    const jsonPath = path.join(
      outputPath,
      "swagger-jsons",
      `${item.name}.json`
    );

    if (!program.skipDownLoad) {
      const res = await axios.get(item.url);
      let fileData = removeCannotParsedContent(res.data);
      fileData = normalizeResponseType(fileData);

      if (!fs.existsSync(jsonPath)) {
        await fs.createFile(jsonPath);
      }
      await fs.writeFile(jsonPath, JSON.stringify(fileData, null, 2));
      log(`更新【${item.name}】的swagger.json √`);
    }

    await spawnWork(
      [
        "openapi-generator-cli generate",
        `-i  ${jsonPath}`,
        `-g typescript-rxjs`,
        `-o ${tempPath}/${item.name}`,
        `--skip-validate-spec`,
        `-t ${paths.templatePath}`,
        `--additional-properties=supportsES6=false`,
      ].join(" ")
    );

    await fs.move(
      `${tempPath}/${item.name}/tsconfig.json`,
      `${tempPath}/tsconfig.json`,
      { overwrite: true }
    );

    await delUnnecessaryFile(tempPath, item.name);
  }
  await fs.copy(paths.runtime, `${tempPath}/runtime`);
  log(`更新runtime文件 √`);

  await spawnWork(`tsc -b ${path.resolve(tempPath, "./tsconfig.json")}`);
  log(`使用tsc编译成功 √`);

  await fs.copy(`${tempPath}/dist`, outputPath);

  log(`copy到${outputPath}成功 √`);

  // if (!program.keepTempFile) {
  //   await fs.remove(tempPath);
  // }
}

main();
