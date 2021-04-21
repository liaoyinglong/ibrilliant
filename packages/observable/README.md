# @ibrilliant/observable

## install

```bash
$ yarn add @ibrilliant/observable
```

## `creator` 简介

| creator                                                                  | 简介                                           |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| [createNotify](./src/creator/createNotify/readme.md)                     | 统一管理的发布订阅，通过 rxjs 赋予更强大的能力 |
| [intervalOnDocumentShow](./src/creator/intervalOnDocumentShow/readme.md) | 类似`interval`                                 |

## `operators` 简介

| operators                                                         | 简介                   |
| ----------------------------------------------------------------- | ---------------------- |
| [ignoreFailedRes](./src/operators/ignoreFailedRes/index.ts)       | 忽略失败的响应         |
| [retryWhenFailedRes](./src/operators/retryWhenFailedRes/index.ts) | 忽略失败的响应，并重试 |
