import { useCallback, useState } from "react";

export function useMuiInputControl(initValue = "") {
  const [value, setValue] = useState(initValue);

  const onChange = useCallback((event) => {
    setValue((event.target as HTMLInputElement).value);
  }, []);

  return {
    value,
    onChange,
    setValue,
  };
}
