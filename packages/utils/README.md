# @ibrilliant/utils

内部使用的一些工具合集

## 简介

| operators                                                             | 简介                              |
| --------------------------------------------------------------------- | --------------------------------- |
| [AppMethods](./src/App/AppMethods.ts)                                 | `App`方法的封装                   |
| [AppChannel](./src/App/AppChannel.ts)                                 | `App` `channel`常量               |
| [getDeviceID](./src/getDeviceID/index.ts)                             | 使用`fingerprintjs`生成唯一机器码 |
| [isDeepEqual](./src/isDeepEqual/index.ts)                             | 从`fast-deep-equal/react`重新导出 |
| [logger](./src/logger/index.ts)                                       | `debug`的封装                     |
| [normalizeKLinesWithAction](./src/normalizeKLinesWithAction/index.ts) | 对 K 线数据的清洗                 |
| [normalizeLink](./src/normalizeLink/index.ts)                         | 对`url`处理，方便添加`query`      |
| [openWindowByBlank](./src/openWindowByBlank/index.ts)                 | 安全的新建标签打开窗口            |
| [wrapperedQs](./src/wrapperedQs/index.ts)                             | 对`qs`的封装                      |
| [WsService](./src/WsService/readme.md)                                | 使用`rxjs`封装的`websocket`       |
