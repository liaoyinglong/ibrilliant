import type { Dispatch, PayloadActionCreator, Slice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import type { FC } from "react";
import React, {
  createContext,
  useContext,
  useDebugValue,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";

type SliceMap = Record<string, Slice>;
export type SliceActionsMap<T extends SliceMap> = {
  [SliceName in keyof T]: T[SliceName]["actions"];
};
type SliceReducerMap<T extends SliceMap> = {
  [SliceName in keyof T]: T[SliceName]["reducer"];
};

export type AppActionMap = Record<
  string,
  Record<string, PayloadActionCreator<any>>
>;

interface DispatcherContextValue<T extends SliceMap = SliceMap> {
  sliceDispatcher: SliceActionsMap<T>;
  appDispatcher: AppActionMap;
}

export function convertSliceMapToReducerMap<T extends SliceMap>(
  sliceMap: T
): SliceReducerMap<T> {
  const res = {} as SliceReducerMap<T>;
  Object.keys(sliceMap).forEach((sliceName) => {
    res[sliceName as keyof T] = sliceMap[sliceName].reducer;
  });
  return res;
}

function combineSliceActions<T extends SliceMap>(
  sliceMap: T,
  dispatch: Dispatch
): SliceActionsMap<T> {
  const res = {} as SliceActionsMap<T>;
  Object.keys(sliceMap).forEach((sliceName) => {
    res[sliceName as keyof T] = bindActionCreators(
      sliceMap[sliceName].actions,
      dispatch
    );
  });

  return res;
}

function combineAppActions<T extends AppActionMap>(
  appAction: T,
  dispatch: Dispatch
): T {
  const res = {} as T;
  Object.keys(appAction).forEach((key: keyof T) => {
    res[key] = bindActionCreators(appAction[key], dispatch);
  });

  return res;
}

export function createDispatcherProviderAndHooks<
  TSliceMap extends SliceMap,
  TAppActionMap extends AppActionMap
>(sliceMap: TSliceMap, appAction: TAppActionMap) {
  const DispatcherContext = createContext<DispatcherContextValue>({
    sliceDispatcher: {},
    appDispatcher: {},
  });

  const DispatcherProvider: FC = (props) => {
    const dispatch = useDispatch();
    const sliceDispatcher = useMemo(() => {
      return combineSliceActions(sliceMap, dispatch);
    }, [dispatch]);

    const appDispatcher = useMemo(() => {
      return combineAppActions(appAction, dispatch);
    }, [dispatch]);

    const value = useMemo(() => {
      return { sliceDispatcher, appDispatcher };
    }, [appDispatcher, sliceDispatcher]);

    return (
      <DispatcherContext.Provider value={value}>
        {props.children}
      </DispatcherContext.Provider>
    );
  };

  function useSliceDispatcher() {
    const dispatcherMap = useContext(DispatcherContext);
    useDebugValue(dispatcherMap);
    return dispatcherMap.sliceDispatcher as SliceActionsMap<TSliceMap>;
  }
  function useAppDispatcher() {
    const dispatcherMap = useContext(DispatcherContext);
    useDebugValue(dispatcherMap);
    return dispatcherMap.appDispatcher as TAppActionMap;
  }

  return {
    DispatcherProvider,
    useSliceDispatcher,
    useAppDispatcher,
  };
}
