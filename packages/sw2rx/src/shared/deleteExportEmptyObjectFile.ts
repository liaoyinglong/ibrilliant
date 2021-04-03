import fs from "fs-extra";
import { createLogger } from "@ibrilliant/utils";
import path from "path";
import { Config } from "./config";

const log = createLogger("sw2rx");

export async function deleteExportEmptyObjectFile(
  outputPath: string,
  swaggerUrls: Config["swaggerUrls"]
) {
  await Promise.all(
    swaggerUrls.map(async (item) => {
      await work(item.name);
    })
  );

  async function work(dir: string) {
    const modelsPath = path.join(outputPath, dir, "models");
    const items = await fs.readdir(modelsPath);

    const indexBuffer = await fs.readFile(`${modelsPath}/index.js`);
    let indexContent = indexBuffer.toString();
    await Promise.all(
      items.map(async (item) => {
        const p = path.join(modelsPath, item);
        const r = await fs.readFile(p);
        const content = r.toString();
        if (content.includes("export {};")) {
          log(`删除 ${dir}/models/${item}`);
          await fs.remove(p);
          indexContent = indexContent.replace(
            `export * from './${item.replace(".js", "")}';`,
            ""
          );
        }
      })
    );
    await fs.writeFile(`${modelsPath}/index.js`, `export {};${indexContent}`);
  }
}
