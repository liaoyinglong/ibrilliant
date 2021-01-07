import type { Slice } from '@reduxjs/toolkit';
declare type ActionName<T extends string> = `${T}SliceActions`;
export declare function createSliceActionHook<T extends Slice>(slice: T): { [k in `use${Capitalize<T["name"]>}SliceActions`]: () => { [k_1 in `${T["name"]}SliceActions`]: T["actions"]; }; };
export declare function useSliceActions<T extends Slice, R extends {
    [k in ActionName<T['name']>]: T['actions'];
}>(slice: T): R;
export {};
