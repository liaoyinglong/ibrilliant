import { Slice } from "@reduxjs/toolkit";
import { createSliceActionHook, useSliceActions } from "./useSliceActions";
import { createSliceStateHook, useSliceState } from "./useSliceState";

export {
  createSliceActionHook,
  createSliceStateHook,
  useSliceActions,
  useSliceState,
};

export function createSliceHook<T extends Slice>(slice: T) {
  return {
    ...createSliceActionHook(slice),
    ...createSliceStateHook(slice),
  };
}
