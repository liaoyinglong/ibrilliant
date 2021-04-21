# WsService

## 参数

```ts
class WsServiceConfig {
  // 返回最新url的方法
  resolveUrl: () => string = () => "";
  // 处理发送过去的消息
  sendMsgFormater = identity as (...args: any) => any;
  // 方便调试
  name = "";
  // 超时时长
  timeout = 30 * 1000;
  // 心跳检测间隔
  hearbeatInterval = 5 * 1000;
  // 发生错误的时候 重试间隔
  onErrorRetryInterval = 3 * 1000;
  // 自动切换线路后的 重连间隔
  onSwithDomainInterval = 1000;
  // debug 开关
  debug = false;
  // 域名切换的流
  domainName$?: Observable<any>;
}
```

## usage

```ts
const contractSocket = new WsService({
  resolveUrl: () => SOCKETURL.ws,
  name: "合约",
  sendMsgFormater: (v) => createRequestParams(v),
  domainName$,
});

const subscription = contractSocket
  .multiplex<Data>(
    // 订阅的时候发送的消息
    { head: { method: "traderatio.subscribe" }, param: { contractCode: code } },
    // 取消订阅的时候发送的消息
    { head: { method: "traderatio.unsubscribe" } },
    // 过滤
    "traderatio.update"
  )
  .subscribe(setData);
```
