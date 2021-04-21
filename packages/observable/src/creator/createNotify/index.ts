import { Subject } from "rxjs";
import { filter, map, startWith, switchMap } from "rxjs/operators";
import { intervalOnDocumentShow } from "../intervalOnDocumentShow";

const sub = new Subject<{ type: string; payload: any }>();

let typesSet: Set<string>;

export function createNotify<T extends any = any, Type extends string = string>(
  type: Type
) {
  if (process.env.NODE_ENV === "development") {
    typesSet = typesSet || new Set();
    if (typesSet.has(type)) {
      throw new Error(`notifier 有重复的 type 声明。重复项为 : ${type}`);
    }
    typesSet.add(type);
  }

  const observable = sub.asObservable().pipe(
    filter((value) => value.type === type),

    map((item) => item.payload as T),
    startWith(void 0)
  );

  return {
    name: type,
    // 订阅的时候就会发出一条消息
    observable,
    intervalOnDocumentShow(...ags: Parameters<typeof intervalOnDocumentShow>) {
      return observable.pipe(
        switchMap(() => {
          return intervalOnDocumentShow(...ags);
        })
      );
    },
    notify(payload?: T) {
      sub.next({ type, payload });
    },
  };
}
