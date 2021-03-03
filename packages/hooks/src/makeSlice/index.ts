import { useMemo, useReducer } from "react";
import type { CreateSliceOptions, SliceCaseReducers } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";

/**
 * @description 返回对`useReducer`进行封装的hooks 内部使用 `@reduxjs/toolkit`的`slice`来处理
 * @param options @reduxjs/toolkit createSlice 的配置项
 * @example
 * ```js
const useSlice = makeSlice({
  name: "name是为了debug用的",
  initialState: { count: 0 },
  reducers: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
  },
});
 function Comp(){
  const [state, actions] = useSlice();
 }
 * ```
 */
export function makeSlice<
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string = string
>(options: CreateSliceOptions<State, CaseReducers, Name>) {
  const slice = createSlice(options);

  return function useSlice(initialState = options.initialState) {
    const [state, dispatch] = useReducer(slice.reducer, initialState);

    const actions = useMemo(() => {
      return (bindActionCreators(
        // TODO: fix type error
        // @ts-ignore
        slice.actions,
        dispatch
      ) as unknown) as typeof slice["actions"];
    }, []);

    return [state, actions] as [State, typeof actions];
  };
}
