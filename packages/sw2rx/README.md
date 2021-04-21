# @ibrilliant/sw2rx

根据`swagger`文档生成对应请求代码。

## 配置文件

见`packages/sw2rx/src/shared/config.ts`

```ts
export interface Config {
  // 输出文件夹路径
  outputPath: string;
  swaggerUrls: {
    // 对应swagger输出文件夹name
    name: string;
    // swagger描述
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
      desc: "Hopex Api Gateway Doc",
      url: "http://192.168.70.131:5003/swagger/v1/swagger.json",
    },
    {
      name: "oc",
      desc:
        "Hopex Operation Center Doc,运营中心api文件（公告/banner/app版本更新等）",
      url: "http://192.168.70.131:5100/swagger/v1/swagger.json",
    },
    {
      name: "user",
      desc: "Hopex User System API Doc",
      url: "http://192.168.70.131:5001/swagger/v1/swagger.json",
    },
    {
      name: "cbbcApi",
      desc: "Hopex CBBC ApiGateway",
      url: "http://192.168.70.153:53030/swagger/v1/swagger.json",
    },
    {
      name: "facade",
      desc: "Hopex.Facade.ApiGateway 合约 牛熊证api文件",
      url: "http://192.168.70.131:53050/swagger/v1/swagger.json",
    },
    {
      name: "otc",
      desc: "Hopex OTC System Doc 法币交易",
      url: "http://192.168.70.131:5105/swagger/v1/swagger.json",
    },
    {
      name: "news",
      desc: "Hopex News Doc 资讯api",
      url: "http://192.168.70.131:5007/swagger/v1/swagger.json",
    },
    {
      name: "asset",
      desc: "用户资产API",
      url: "http://192.168.70.131:5600/swagger/v1/swagger.json",
    },
    {
      name: "community",
      desc: "社区（聊天室）API",
      url: "http://192.168.70.131:5306/swagger/v1/swagger.json",
    },
  ],
};
```
