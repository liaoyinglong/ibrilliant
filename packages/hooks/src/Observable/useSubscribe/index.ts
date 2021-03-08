import type { Observable } from "rxjs";
import { isObservable } from "rxjs";
import type { DependencyList } from "react";
import { useEffect } from "react";

/**
 *
 * @param creator 创建observable的方法
 * @param deps  useEffect的第二个参数 发生变化时会重新订阅 observable
 */
export function useSubscribe<T>(
  creator: () => Observable<T> | void,
  deps?: DependencyList
) {
  useEffect(() => {
    const ob = creator();

    if (isObservable(ob)) {
      const subscription = ob.subscribe();
      return () => {
        subscription.unsubscribe();
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
