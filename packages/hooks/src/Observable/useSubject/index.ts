import { Subject } from "rxjs";
import { useConstant } from "../../useConstant";

/**
 * 这个hooks返回的subject做了bind this 的处理
 * 目的是为了在 jsx 里面使用起来更方便
 */
export function useSubject<T>() {
  return useConstant(() => {
    const subject = new Subject<T>();
    subject.next = subject.next.bind(subject);
    subject.error = subject.error.bind(subject);
    subject.complete = subject.complete.bind(subject);
    subject.unsubscribe = subject.unsubscribe.bind(subject);
    return subject;
  });
}
