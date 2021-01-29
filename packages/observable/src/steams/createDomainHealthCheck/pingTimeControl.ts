import { Subject } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";

const statusMap = {
  best: "best",
  good: "good",
  bad: "bad",
};

export function createPingTimeControl() {
  const startTimeSubject = new Subject<number>();
  const endTimeSubject = new Subject<number>();

  function pushStartTime() {
    startTimeSubject.next(Date.now());
  }
  function pushEndTime() {
    endTimeSubject.next(Date.now());
  }

  return {
    pushStartTime,
    pushEndTime,
    statusMap,
    status$: endTimeSubject.asObservable().pipe(
      withLatestFrom(startTimeSubject.asObservable()),
      map(([start, end]) => {
        // console.log({ start, end });
        const diff = end - start;
        if (diff < 1000) {
          return statusMap.best;
        } else {
          return statusMap.good;
        }
      })
    ),
  };
}
