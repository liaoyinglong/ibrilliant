import type { Slice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useDebugValue, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

type HookName<T extends string> = `use${Capitalize<T>}SliceActions`;
type ActionName<T extends string> = `${T}SliceActions`;

const cacheedBindActionCreators = _.memoize(bindActionCreators);

export function createSliceActionHook<T extends Slice>(slice: T) {
  const fn = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSliceActions(slice);
  };

  const res = { [`use${_.upperFirst(slice.name)}SliceActions`]: fn } as {
    [k in HookName<T['name']>]: typeof fn;
  };

  return res;
}

export function useSliceActions<
  T extends Slice,
  R extends {
    [k in ActionName<T['name']>]: T['actions'];
  }
>(slice: T) {
  const dispatch = useDispatch();

  const actions = useMemo(() => {
    return cacheedBindActionCreators(slice.actions, dispatch);
  }, [dispatch, slice.actions]);

  const res = {
    [`${slice.name}SliceActions`]: actions,
  } as R;

  useDebugValue(res);

  return res;
}
