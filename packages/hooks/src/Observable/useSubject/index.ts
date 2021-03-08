import { Subject } from "rxjs";
import { useConstant } from "../../useConstant";

export function useSubject<T>() {
  return useConstant(() => new Subject<T>());
}
