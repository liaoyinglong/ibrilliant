import { webpack } from "umi";
import * as babel from "@babel/core";
import { ParserOptions, TransformOptions } from "@babel/core";
import * as esbuild from "esbuild";

export default async function ESBuildLoader(
  this: webpack.loader.LoaderContext,
  source: string
): Promise<void> {
  const done = this.async()!;

  try {
    const res = await transform(source, this.resourcePath);
    if (typeof res === "string") {
      done(null, res);
      return;
    }
    done(null, res.code, res.map && JSON.parse(res.map));
  } catch (error: unknown) {
    done(error as Error);
  }
}

interface FileTypes {
  isJs: boolean;
  isJsx: boolean;
  isTs: boolean;
  isTsx: boolean;
}

function transformByBabel(
  code: string,
  resourcePath: string,
  fileTypes: FileTypes
) {
  const parserPlugins: ParserOptions["plugins"] = [
    "classProperties",
    "decorators-legacy",
  ];
  const babelPlugins: TransformOptions["plugins"] = [];

  const babelPresets: TransformOptions["presets"] = [];
  // if (fileTypes.isJs || fileTypes.isJsx) {
  if ((fileTypes.isJs || fileTypes.isJsx) && code.includes("@connect(")) {
    babelPlugins.push([
      require.resolve("@umijs/deps/compiled/babel/plugin-proposal-decorators"),
      { legacy: true },
    ]);
  }

  if (!fileTypes.isTs) {
    parserPlugins.push("jsx");
  }

  if (fileTypes.isTs || fileTypes.isTsx) {
    parserPlugins.push("typescript");
  }

  if (fileTypes.isJsx || fileTypes.isTsx) {
    babelPlugins.push(require.resolve("react-refresh/babel"));
  }

  return babel.transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: resourcePath,
    sourceFileName: resourcePath,
    parserOpts: {
      sourceType: "module",
      allowAwaitOutsideFunction: true,
      plugins: parserPlugins,
    },
    plugins: babelPlugins,
    presets: babelPresets,
    ast: true,
    sourceMaps: true,
  });
}

function transformByEsbuild(
  code: string,
  resourcePath: string,
  fileTypes: FileTypes
) {
  return esbuild.transform(
    `import { Fragment as __Fragment} from 'react';
     import {jsx} from '@emotion/react';
     ${code}`,
    {
      // @ts-ignore
      loader:
        fileTypes.isJs || fileTypes.isJsx
          ? "jsx"
          : fileTypes.isTsx
          ? "tsx"
          : "ts",
      target: "es2015",
      jsxFactory: "jsx",
      jsxFragment: "__Fragment",
      //TODO: 开启压缩会导致 react-refresh 失效 原因未知，后续在看看
      // minify: true,
      treeShaking: true,
      sourcemap: true,
      sourcefile: resourcePath,
    }
  );
}

const options = {
  enableReactRefrsh: /(components|HComponents|routes|pages)/,
};

export async function transform(code: string, resourcePath: string) {
  const fileTypes = {
    isJs: resourcePath.endsWith(".js"),
    isJsx: resourcePath.endsWith(".jsx"),
    isTs: resourcePath.endsWith(".ts"),
    isTsx: resourcePath.endsWith(".tsx"),
  };
  let needEsbuildTransformCode = code;

  if (options.enableReactRefrsh.test(resourcePath)) {
    let babelRes = await transformByBabel(code, resourcePath, fileTypes);
    if (!babelRes?.code) {
      return code;
    }
    needEsbuildTransformCode = babelRes.code;
  }

  return transformByEsbuild(needEsbuildTransformCode, resourcePath, fileTypes);
}
