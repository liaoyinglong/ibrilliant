import { BehaviorSubject, interval, of, race, TimeoutError, timer } from "rxjs";
import { ApiEnvType, createLogger } from "@ibrilliant/utils";
import {
  catchError,
  distinctUntilChanged,
  mapTo,
  switchMap,
  tap,
  timeout,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { createPingTimeControl } from "./pingTimeControl";

interface DomainHealthCheckParams {
  // 线路超时时间 默认 3S
  checkTimeout?: number;
  // 检查间隔 默认 10s
  checkInterval?: number;

  ApiEnv: ApiEnvType;
}

const debug = createLogger("createDomainHealthCheck");

export type DomainRelatedType = ReturnType<typeof createDomainRelated>;

export function createDomainRelated(config: DomainHealthCheckParams) {
  const { ApiEnv, checkInterval = 10 * 1000, checkTimeout = 3 * 1000 } = config;

  const pingTimeControl = createPingTimeControl();

  const domainNameSubject = new BehaviorSubject(getCurrnetDomainName(ApiEnv));
  const domainName$ = domainNameSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  const requestHealth = (domain: string) => {
    return ajax
      .get(`https://${ApiEnv.urlEnvPrefix}api.${domain}/health`)
      .pipe(mapTo(domain));
  };

  const autoSwitchDomainName$ = interval(checkInterval).pipe(
    switchMap(() => {
      const prev = domainNameSubject.getValue();
      return of(prev).pipe(
        switchMap((domain) => {
          pingTimeControl.pushStartTime();
          return requestHealth(domain);
        }),
        timeout(checkTimeout),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            debug(
              `检测上一次可用域名 [${prev}] 是否可以用：超时 ${checkTimeout}ms`,
              err
            );
          } else {
            debug(`检测上一次可用域名 [${prev}] 是否可以用：接口报错`, err);
          }
          const others = ApiEnv.domains.filter((domain) => domain !== prev);
          return race(
            ...others.map((domain) => {
              return requestHealth(domain).pipe(
                catchError((err) => {
                  debug(
                    `检测域名 [${domain}] 是否可以用：接口报错，将继续使用上一次可用域名:${prev}`,
                    err
                  );
                  return of(prev);
                })
              );
            }),
            timer(checkTimeout).pipe(
              tap(() => {
                debug(
                  `检测 [${others}] 等域名超时 ${checkTimeout}ms，继续使用上一个可用:${prev}`
                );
              }),
              mapTo(prev)
            )
          );
        }),
        tap(() => {
          pingTimeControl.pushEndTime();
        }),
        distinctUntilChanged(),
        tap((t) => {
          if (t !== prev) {
            debug(`切换到域名`, t);
          }
        })
      );
    })
  );

  return {
    domainNameSubject,
    domainName$,
    autoSwitchDomainName$,
    pingTimeControl,
  };
}

/**
 * @returns {string}
 */
function getCurrnetDomainName(ApiEnv: ApiEnvType): string {
  const defaultUrl = ApiEnv.defaultDomain;
  if (ApiEnv.isDevLocal) {
    return defaultUrl;
  }
  const t = window.location.host.split(".");
  if (t.length > 2) {
    t.shift();
    return t.join(".");
  }
  return defaultUrl;
}
