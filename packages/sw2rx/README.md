# @ibrilliant/sw2rx

根据`swagger`文档生成对应请求代码。

## 配置文件

见`packages/sw2rx/src/shared/config.ts`

```ts
export interface Config {
  // 输出文件夹路径
  outputPath: string;
  swaggerUrls: {
    // 对应 swagger 输出文件夹 name
    name: string;
    // swagger 描述
    desc?: string;
    // swagger 地址
    url: string;
  }[];
}
```

## 常规配置文件

```js
const path = require("path");

function resolvePath(str) {
  return path.resolve(__dirname, str);
}

module.exports = {
  outputPath: resolvePath("./src/apis/lib"),
  swaggerUrls: [
    {
      name: "gateway",
      desc: " Api Gateway Doc",
      url: "http://127.0.0.1:5003/swagger/v1/swagger.json",
    },
    {
      name: "oc",
      desc:
        " Operation Center Doc，运营中心 api 文件（公告/banner/app 版本更新等）",
      url: "http://127.0.0.1:5100/swagger/v1/swagger.json",
    },
    {
      name: "user",
      desc: " User System API Doc",
      url: "http://127.0.0.1:5001/swagger/v1/swagger.json",
    },
    {
      name: "cbbcApi",
      desc: " CBBC ApiGateway",
      url: "http://127.0.0.1:53030/swagger/v1/swagger.json",
    },
    {
      name: "facade",
      desc: ".Facade.ApiGateway 合约 牛熊证 api 文件",
      url: "http://127.0.0.1:53050/swagger/v1/swagger.json",
    },
    {
      name: "otc",
      desc: " OTC System Doc 法币交易",
      url: "http://127.0.0.1:5105/swagger/v1/swagger.json",
    },
    {
      name: "news",
      desc: " News Doc 资讯 api",
      url: "http://127.0.0.1:5007/swagger/v1/swagger.json",
    },
    {
      name: "asset",
      desc: "用户资产 API",
      url: "http://127.0.0.1:5600/swagger/v1/swagger.json",
    },
    {
      name: "community",
      desc: "社区（聊天室）API",
      url: "http://127.0.0.1:5306/swagger/v1/swagger.json",
    },
  ],
};
```
