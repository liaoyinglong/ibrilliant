import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { BaseRes } from "../../shared/types";

/**
 * 返回的 res 不是成功的 忽略掉这个消息 防止出现报错
 * 返回的 res 是成功的，会取出 res.data 的数据
 */
export function ignoreFailedRes() {
  return <T>(source: Observable<BaseRes<T>>) => {
    return source.pipe(
      filter((res) => Boolean(res.success)),
      map((res) => res.data)
    );
  };
}
