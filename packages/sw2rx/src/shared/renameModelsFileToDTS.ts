import fs from "fs-extra";
import { paths } from "./paths";
import { createLogger } from "@ibrilliant/utils";
import path from "path";
import { Config } from "./config";

const log = createLogger("sw2rx.renameModelsFileToDTS");

export async function renameModelsFileToDTS(
  outputPath: string,
  swaggerUrls: Config["swaggerUrls"]
) {
  await Promise.all(
    swaggerUrls.map(async (item) => {
      await work(item.name);
    })
  );

  async function work(dir: string) {
    const modelsPath = path.join(paths.tempPath, dir, "models");
    const newModelsPath = path.join(outputPath, dir, "models");
    const items = await fs.readdir(modelsPath);
    await Promise.all(
      items.map(async (item) => {
        const p = path.join(modelsPath, item);
        await fs.rename(p, p.replace(".ts", ".d.ts"));
      })
    );

    await fs.copy(modelsPath, newModelsPath);
    log(`移动 【${dir}/models】 到 output目录`);
  }
}
