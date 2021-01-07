import { useDebugValue, useMemo } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { wrapperedQs } from "../shared/wrapperedQs";

const memoizedQsParse = _.memoize(wrapperedQs.parse);

export function useLocationQuery<T = Record<string, any>>() {
  const location = useLocation();

  const res = useMemo(() => {
    return memoizedQsParse(location.search);
  }, [location.search]);

  useDebugValue(res);
  return (res as unknown) as T;
}
