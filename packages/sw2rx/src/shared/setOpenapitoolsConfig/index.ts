import { pathRelativeCwd, pathRelativeProject } from "../../helpers";
import * as fs from "fs-extra";
import { createLogger } from "@ibrilliant/utils";

const log = createLogger("sw2rx.设置openapitools.json");

/**
 * TODO:
 * 5.0.0 版本编译出来少了部分枚举。暂时先使用 4.3.1.jar
 * openapi-generator-4.3.1.jar
 * 1. https://maven.aliyun.com/mvn/search
 * 2. 搜索仓库 central 关键字 org.openapitools 选中对应jar包下载 放到
 * node_modules\@openapitools\openapi-generator-cli\versions 目录 名称改为 {version}.jar
 */
export async function setOpenapitoolsConfig() {
  const jsonPath = pathRelativeProject("openapitools.json");
  const targetPath = pathRelativeCwd("openapitools.json");

  await fs.copyFile(jsonPath, targetPath);

  log(`复制`);
  log(jsonPath);
  log("到");
  log(targetPath);
  log("成功");
}
