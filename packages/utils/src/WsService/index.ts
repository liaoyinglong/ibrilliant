import debug from "debug";
import type { Dictionary } from "lodash";
import _ from "lodash";
import type { Observable } from "rxjs";
import { identity, interval, Subject, throwError, timer } from "rxjs";
import {
  delayWhen,
  exhaustMap,
  finalize,
  map,
  merge,
  pluck,
  retryWhen,
  skip,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import type { WebSocketSubject } from "rxjs/webSocket";
import { webSocket } from "rxjs/webSocket";

const pako = require("pako");

const heartbeatMsgMap = {
  ping: "ping",
  // 注意这里是带引号的  后台返回的字符串就是带引号的
  pong: `"pong"`,
};
type SubMsgAndUnsubMsg = Dictionary<any> | (() => Dictionary<any>);
type MessageFilter = string | (() => boolean);

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

export class WsService {
  private wsClose$ = new Subject<CloseEvent>();
  private wsOpen$ = new Subject<Event>();
  // 把ws关闭的流 转换成错误的流
  private wsCloseWithError$ = this.wsClose$.pipe(
    exhaustMap((err) => {
      return throwError(err);
    })
  );

  private config: WsServiceConfig;
  private lastReplayTime: number;
  private readonly logger: debug.Debugger;
  private readonly serializerLogger: debug.Debugger;
  private readonly deserializerLogger: debug.Debugger;
  private readonly errorLogger: debug.Debugger;
  private ws$: WebSocketSubject<any>;

  /**
   * @param {object} config
   * @param {function():string} config.resolveUrl  返回最新url的方法
   * @param {function():any} config.sendMsgFormater 处理发送过去的消息
   * @param {string} config.name 给定name 方便调试
   */
  constructor(config: Partial<WsServiceConfig>) {
    this.config = _.assign(new WsServiceConfig(), config);

    // 后台最后回复的时间
    this.lastReplayTime = Date.now();

    this.logger = debug(`${config.name}`);
    this.serializerLogger = debug(`${config.name}_发送`);
    this.deserializerLogger = debug(`${config.name}_接收`);
    this.errorLogger = debug(`${config.name}_错误`);

    this.ws$ = webSocket({
      url: config.resolveUrl!(),
      closeObserver: this.wsClose$,
      openObserver: this.wsOpen$,
      binaryType: "arraybuffer",
      serializer: (msg) => {
        if (msg !== heartbeatMsgMap.ping) {
          msg = JSON.stringify(msg);
        }
        if (this.config.debug) {
          this.serializerLogger(msg);
        }
        return msg;
      },
      deserializer: (event) => {
        // 每收到一条消息 更新一下最后接收消息的时间
        this.lastReplayTime = Date.now();
        let result = event.data;
        if (result instanceof ArrayBuffer) {
          result = pako.inflate(result, { to: "string" });
        }
        if (this.config.debug) {
          this.deserializerLogger(result);
        }
        if (result === heartbeatMsgMap.pong) {
          return result;
        }

        try {
          return JSON.parse(result);
        } catch (e) {
          this.errorLogger(
            `parse ws 返回数据错误，event:`,
            event,
            `result = `,
            result,
            `error:`,
            e
          );
          return {};
        }
      },
    });

    this.initHearbeat();
    this.initSubDomainNameChange();
  }

  private initSubDomainNameChange() {
    this.config.domainName$
      ?.pipe(
        // 第一次订阅 BehaviorSubject 会发出最后一次的值，导致进入死循环
        // 现忽略第一次的值
        skip(1),
        map((value) => {
          // 这个是hack方法 直接修改rxjs的 webSocket 私有配置 使得重连的时候使用最新的值
          // @ts-ignore
          this.ws$._config.url = this.config.resolveUrl();
          return `路线切换了，重新连接到:${value}`;
        })
      )
      .subscribe(() => {
        this.error({ code: 3001, reason: "路线切换了" });
      });
  }

  /**
   * 初始化心跳检测
   */
  private initHearbeat() {
    this.wsOpen$
      .pipe(
        switchMap(() => {
          this.logger("连接open, 重置lastReplayTime");
          this.lastReplayTime = Date.now();
          return interval(this.config.hearbeatInterval).pipe(
            tap(() => {
              // 发送ping之前检查一下 最后 当前时间 - 最后回复时间 是不是大于超时时间
              // 并且需要重置 最后接收到回复的时间
              const n = Date.now();
              const oldLastReplayTime = this.lastReplayTime;
              const diff = n - oldLastReplayTime;
              if (diff >= this.config.timeout) {
                this.lastReplayTime = n;
                this.errorLogger(`心跳检测超时 %O`, {
                  diff,
                  n,
                  oldLastReplayTime,
                  timeout: this.config.timeout,
                });
                this.error({
                  code: 4888,
                  reason: `心跳检测超时`,
                });
              } else {
                this.ws$.next(heartbeatMsgMap.ping);
              }
            }),
            takeUntil(this.wsClose$),
            finalize(() => {
              this.errorLogger("停止发送心跳检测");
            })
          );
        })
      )
      .subscribe();
  }

  next(value: any) {
    this.ws$.next(value);
  }

  private error({ code, reason }: { code: number; reason: string }) {
    this.ws$.error({ code, reason });
    this.errorLogger(reason);
  }

  toggleDebug() {
    this.config.debug = !this.config.debug;
  }

  /**
   * 创建订阅的流
   * @param  subMsg 发送订阅的数据
   * @param  unsubMsg 取消订阅的数据
   * @param  messageFilter 帅选订阅返回的数据
   */
  multiplex<T>(
    subMsg: SubMsgAndUnsubMsg,
    unsubMsg: SubMsgAndUnsubMsg,
    messageFilter: MessageFilter
  ): Observable<T> {
    const steam$ = this.ws$
      .multiplex(
        this.normalizeSubMsgAndUnsubMsg(subMsg, true),
        this.normalizeSubMsgAndUnsubMsg(unsubMsg),
        _.isFunction(messageFilter)
          ? messageFilter
          : (res) => res?.method === messageFilter
      )
      .pipe(pluck("data"));

    return this._withRetry(steam$);
  }

  private normalizeSubMsgAndUnsubMsg(
    msg: SubMsgAndUnsubMsg,
    wrapperWithFormater = false
  ) {
    return _.isFunction(msg)
      ? msg
      : () => {
          if (wrapperWithFormater) {
            return this.config.sendMsgFormater(msg);
          }
          return msg;
        };
  }

  private _withRetry(stream$: Observable<any>) {
    return stream$.pipe(
      merge(this.wsCloseWithError$),
      retryWhen((err$) => {
        return err$.pipe(
          delayWhen((err) => {
            let t = this.config.onSwithDomainInterval;
            if (err instanceof Event) {
              t = this.config.onErrorRetryInterval;
            }
            this.errorLogger("即将重新连接，错误是:", err?.reason, err);
            return timer(t);
          })
        );
      })
    );
  }
}
