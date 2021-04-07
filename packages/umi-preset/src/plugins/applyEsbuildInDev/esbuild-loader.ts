import { webpack } from "umi";
import * as babel from "@babel/core";
import { ParserOptions, TransformOptions } from "@babel/core";
import * as esbuild from "esbuild";
import * as os from "os";
import { Loader } from "esbuild";

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
    babelPlugins.push([
      require.resolve("@emotion/babel-plugin"),
      {
        // sourceMap is on by default but source maps are dead code eliminated in production
        sourceMap: true,
        autoLabel: "dev-only",
        labelFormat: "[local]",
        cssPropOptimization: true,
      },
    ]);

    if (process.env.NODE_ENV === "development") {
      babelPlugins.push(require.resolve("react-refresh/babel"));
    }
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

const jsxInject = [
  `import { Fragment as __Fragment} from 'react';`,
  `import {jsx} from '@emotion/react';`,
].join(os.EOL);

const nodeModuleReg = /node_modules/;

function transformByEsbuild(
  code: string,
  resourcePath: string,
  fileTypes: FileTypes
) {
  let loader: Loader = "ts";
  const isInNodeModule = nodeModuleReg.test(resourcePath);
  /**
   * node_modules 文件
   * ts 文件
   * 都不需要注入jsx
   */
  let prefixCode = isInNodeModule ? "" : jsxInject;

  if (fileTypes.isJs || fileTypes.isJsx) {
    loader = "jsx";
  } else if (fileTypes.isTsx) {
    loader = "tsx";
  } else {
    prefixCode = "";
  }

  return esbuild.transform(prefixCode + code, {
    loader,
    target: "es2015",
    jsxFactory: "jsx",
    jsxFragment: "__Fragment",
    //TODO: 开启压缩会导致 react-refresh 失效 原因未知，后续在看看
    // minify: true,
    treeShaking: true,
    sourcemap: true,
    sourcefile: resourcePath,
  });
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
