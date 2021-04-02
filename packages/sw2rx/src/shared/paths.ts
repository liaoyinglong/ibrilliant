import findCacheDir from "find-cache-dir";
import path from "path";
import { pathRelativeCwd } from "../helpers";
const name = require("../../package.json").name;

const thunk = findCacheDir({ name: "ibr.sw2rx", thunk: true });
const projectPath = path.dirname(require.resolve(`${name}/package.json`));

export const paths = {
  tempPath: thunk("temp"),
  templatePath: path.join(projectPath, "dist/template-typescript-rxjs"),
  runtime: path.join(projectPath, "dist/lib/runtime"),
  defaultOpenapitoolsJson: path.join(projectPath, "openapitools.json"),
  userOpenapitoolsJson: pathRelativeCwd("openapitools.json"),
};

console.log(paths);
