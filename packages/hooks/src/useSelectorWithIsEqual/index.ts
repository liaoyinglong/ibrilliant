import { useSelector } from "react-redux";
import { isDeepEqual } from "@ibrilliant/utils";

export const useSelectorWithIsEqual: typeof useSelector = (
  selector,
  equalityFn = isDeepEqual
) => {
  return useSelector(selector, equalityFn);
};
