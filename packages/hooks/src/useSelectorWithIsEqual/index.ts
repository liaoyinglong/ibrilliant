import { useSelector } from "react-redux";
import { isDeepEqual } from "../shared/isDeepEqual";

export const useSelectorWithIsEqual: typeof useSelector = (
  selector,
  equalityFn = isDeepEqual
) => {
  return useSelector(selector, equalityFn);
};
