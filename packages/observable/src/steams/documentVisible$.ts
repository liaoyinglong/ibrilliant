import { fromEvent, partition } from "rxjs";
import { map, shareReplay, startWith } from "rxjs/operators";

/**
 *
 * @returns {boolean} 返回true 可见  false 不可见
 */
function getDocumentVisible() {
  if (
    typeof document !== "undefined" &&
    typeof document.visibilityState !== "undefined"
  ) {
    return document.visibilityState !== "hidden";
  }

  return true;
}
const visibilitychange$ = fromEvent(window, "visibilitychange").pipe(
  startWith(getDocumentVisible()),
  map(() => getDocumentVisible()),
  shareReplay(1)
);

const [documentShow$, documentHiden$] = partition(visibilitychange$, Boolean);

export { documentShow$, documentHiden$, visibilitychange$ };
