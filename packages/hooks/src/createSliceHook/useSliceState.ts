import type { Slice } from '@reduxjs/toolkit';
import { DefaultRootState, useSelector } from 'react-redux';
import _ from 'lodash';
import isDeepEqual from 'fast-deep-equal/react';

type HookName<T extends string> = `use${Capitalize<T>}SliceState`;

export function createSliceStateHook<
  T extends Slice,
  State extends ReturnType<T['reducer']>
>(slice: T) {
  function useSliceStateHookInner(): State;
  function useSliceStateHookInner<K extends keyof State>(
    keys?: K[],
  ): Pick<State, K>;
  function useSliceStateHookInner(keys?: any): any {
    return useSliceState(slice, keys);
  }

  const res = {
    [`use${_.upperFirst(slice.name)}SliceState`]: useSliceStateHookInner,
  } as {
    [key in HookName<T['name']>]: typeof useSliceStateHookInner;
  };

  return res;
}

export function useSliceState<
  T extends Slice,
  State extends ReturnType<T['reducer']>
>(slice: T): State;
export function useSliceState<
  T extends Slice,
  State extends ReturnType<T['reducer']>,
  K extends keyof State
>(slice: T, keys?: K[]): Pick<State, K>;
export function useSliceState(slice: any, keys?: any): any {
  const selectorState = useSelector(
    (state) => {
      const sliceState = state[slice.name as keyof DefaultRootState];

      if (keys?.length) {
        return _.pick(sliceState, keys);
      }

      return sliceState;
    },
    keys?.length ? isDeepEqual : void 0,
  );

  return selectorState;
}
