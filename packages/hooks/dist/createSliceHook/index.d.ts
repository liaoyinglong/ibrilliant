import { Slice } from "@reduxjs/toolkit";
import { createSliceActionHook, useSliceActions } from "./useSliceActions";
import { createSliceStateHook, useSliceState } from "./useSliceState";
export { createSliceActionHook, createSliceStateHook, useSliceActions, useSliceState };
export declare const createSliceHook: <T extends Slice<any, import("@reduxjs/toolkit").SliceCaseReducers<any>, string>>(slice: T) => { [k in `use${Capitalize<T["name"]>}SliceActions`]: () => { [k_1 in `${T["name"]}SliceActions`]: T["actions"]; }; } & { [key in `use${Capitalize<T["name"]>}SliceState`]: {
    (): ReturnType<T["reducer"]>;
    <K extends keyof ReturnType<T["reducer"]>>(keys?: K[] | undefined): Pick<ReturnType<T["reducer"]>, K>;
}; };
