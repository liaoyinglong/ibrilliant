import type { Slice } from '@reduxjs/toolkit';
export declare function createSliceStateHook<T extends Slice, State extends ReturnType<T['reducer']>>(slice: T): { [key in `use${Capitalize<T["name"]>}SliceState`]: {
    (): State;
    <K extends keyof State>(keys?: K[] | undefined): Pick<State, K>;
}; };
export declare function useSliceState<T extends Slice, State extends ReturnType<T['reducer']>>(slice: T): State;
export declare function useSliceState<T extends Slice, State extends ReturnType<T['reducer']>, K extends keyof State>(slice: T, keys?: K[]): Pick<State, K>;
