import { isObservable, Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { documentHiden$, documentShow$ } from "../steams/documentVisible$";

export function subscribeWhenDocumentShow<T>(
  observable: Observable<T> | (() => Observable<T>)
) {
  return documentShow$.pipe(
    switchMap(() => {
      return (isObservable(observable) ? observable : observable()).pipe(
        takeUntil(documentHiden$)
      );
    })
  );
}
