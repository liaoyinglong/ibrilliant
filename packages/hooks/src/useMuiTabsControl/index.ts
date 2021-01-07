import { useCallback, useState } from "react";

export function useMuiTabsControl<T>(initValue: T) {
  const [value, setValue] = useState<T | false>(() => {
    if (typeof initValue === "undefined") {
      return false;
    }
    return initValue;
  });

  const onChange = useCallback((event: any, nextActive: T) => {
    setValue(nextActive);
  }, []);

  return {
    value,
    onChange,
    setValue,
  };
}
