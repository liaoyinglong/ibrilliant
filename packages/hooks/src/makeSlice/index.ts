import { useMemo, useReducer } from "react";
import type { CreateSliceOptions, SliceCaseReducers } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import { createLogger } from "@ibrilliant/utils";
import _ from "lodash";

/**
 * @description 返回对`useReducer`进行封装的hooks 内部使用 `@reduxjs/toolkit`的`slice`来处理
 * @param options @reduxjs/toolkit createSlice 的配置项
 */
export function makeSlice<
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string = string
>(
  options: CreateSliceOptions<State, CaseReducers, Name> & { debug?: boolean }
) {
  const slice = createSlice(options);

  const log = options.debug
    ? createLogger(`${options.name}:debug` || "makeSlice:debug")
    : _.noop;

  return function useSlice(initialState = options.initialState) {
    const [state, dispatch] = useReducer(slice.reducer, initialState);

    const actions = useMemo(() => {
      return (bindActionCreators(
        // TODO: fix type error
        // @ts-ignore
        slice.actions,

        options.debug
          ? (action) => {
              log(`type:${action.type},payload:%o`, action.payload);
              dispatch(action);
            }
          : dispatch
      ) as unknown) as typeof slice["actions"];
    }, []);

    return [state, actions] as [State, typeof actions];
  };
}
