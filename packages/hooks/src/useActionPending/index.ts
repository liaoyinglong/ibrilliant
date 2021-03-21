import { useMemo, useState } from "react";
import { EMPTY, timer } from "rxjs";
import { useSubscribe } from "../Observable/useSubscribe";
import { useSubject } from "../Observable/useSubject";
import { switchMap, tap } from "rxjs/operators";

interface useActionPendingParams {
  // 小于这个间隔重复更改值 不会真的改 看test
  delay?: number;
}

/**
 * @description
 很多时候，在一个异步过程中，我们需要给用户一个指示，无论是一个遮罩层这样的阻塞式的，还是一个旋转的小圈这种非阻塞式的。但从另一个角度看，不管异步的实际情况，二话不说地用上指示器，有时候反而会带来用户体验上的倒退。有不少100-200ms就能完成的请求，突兀地调起指示器，又很快消失，对用户会造成一种不适感。因此，我们需要根据异步的时长来做判断，短时间内不出现指示器，而超过一定时长后则出现。
 作者：张立理
 链接：https://zhuanlan.zhihu.com/p/338763096
 */
export function useActionPending(params: useActionPendingParams = {}) {
  const { delay = 200 } = params;
  const [pending, setPending] = useState(false);

  const subject = useSubject<boolean>();

  useSubscribe(() => {
    return subject.asObservable().pipe(
      switchMap((nextPending) => {
        if (nextPending) {
          return timer(delay).pipe(
            tap(() => {
              setPending(nextPending);
            })
          );
        }

        setPending(nextPending);
        return EMPTY;
      })
    );
  }, [delay, subject]);

  const actions = useMemo(() => {
    return {
      setTrue() {
        subject.next(true);
      },
      setFalse() {
        subject.next(false);
      },
      set(v: boolean) {
        subject.next(v);
      },
    };
  }, [subject]);

  return [pending, actions] as const;
}
