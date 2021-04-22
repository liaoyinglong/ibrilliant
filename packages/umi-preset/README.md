# @ibrilliant/umi-preset

对`umi`的一些预设

## usage

#### 使用全量

```ts
// .umirc.ts 或者 config/config.ts
export default defineConfig({
  presets: [require.resolve("@ibrilliant/umi-preset")],
});
```

#### 只使用部分

```ts
// .umirc.ts 或者 config/config.ts
export default defineConfig({
  plugins: [
    require.resolve("@ibrilliant/umi-preset/dist/plugins/webpack5"),
    require.resolve("@ibrilliant/umi-preset/dist/plugins/esBuildMinify"),
  ],
});
```

## plugins

| operators                                                           | 简介                                            |
| ------------------------------------------------------------------- | ----------------------------------------------- |
| [applyEsbuildInDev](./src/plugins/applyEsbuildInDev/index.ts)       | 开发环境使用`esbuild-loader`编译                |
| [esbuild-loader](./src/plugins/applyEsbuildInDev/esbuild-loader.ts) | 对`esbuild`进行封装的`loader`                   |
| [webpack5](./src/plugins/webpack5/index.ts)                         | 兼容一些`webpack5`的配置，等`umi`完全适配可移除 |
| [css](./src/plugins/css.ts)                                         | 对`umi` `css`配置的一些修改                     |
| [emotion](./src/plugins/emotion.ts)                                 | 配置`emotion`                                   |
| [ignoreApisLib](./src/plugins/ignoreApisLib.ts)                     | 让`babel`忽略`apis/lib`文件夹                   |
| [rewriteFastRefresh](./src/plugins/rewriteFastRefresh.ts)           | 让`fastRefresh`只支持`/\.([jt]sx)$/i`文件       |
| [sass](./src/plugins/sass.ts)                                       | 开启`sass`支持                                  |
| [splitChunks](./src/plugins/splitChunks.ts)                         | 开启`splitChunks`分包策略                       |
| [terser](./src/plugins/terser.ts)                                   | 对`terser`的调整，忽略`tradingview`文件的压缩   |
