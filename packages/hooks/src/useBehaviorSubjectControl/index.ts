import { BehaviorSubject, noop } from "rxjs";
import { useCallback, useEffect, useState } from "react";
import { skip } from "rxjs/operators";

export function useBehaviorSubjectControl<T>(subject?: BehaviorSubject<T>) {
  const [value, _setValue] = useState(subject?.value);

  useEffect(() => {
    if (!subject) {
      return noop;
    }

    const subscription = subject.pipe(skip(1)).subscribe(_setValue);
    return () => {
      subscription.unsubscribe();
    };
  }, [subject]);

  const setValue = useCallback(
    (v: T) => {
      _setValue(v);
      subject?.next(v);
    },
    [subject]
  );

  return {
    value,
    setValue,
  };
}
