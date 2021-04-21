import { Observable, timer } from "rxjs";
import { map, mergeMap, retryWhen } from "rxjs/operators";
import { BaseRes } from "../../shared/types";

class ShouldRetryError extends Error {}

export function retryWhenFailedRes() {
  return <T>(source: Observable<BaseRes<T>>) => {
    return source.pipe(
      map((res) => {
        if (!!res.success) {
          return res.data;
        }
        throw new ShouldRetryError("接口请求失败 正在重试");
      }),
      retryWhen((errors) => {
        return errors.pipe(
          mergeMap((err, i) => {
            console.log(`[retryWhenFailedRes]:${i + 1}次: ${err?.message}`);

            return timer(Math.min((i + 1) * 1000, 10 * 1000));
          })
        );
      })
    );
  };
}
