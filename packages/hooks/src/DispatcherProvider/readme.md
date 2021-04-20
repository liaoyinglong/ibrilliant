## createDispatcherProviderAndHooks

### Examples

```tsx
const sliceMap = {
  [settingsSlice.name]: settingsSlice,
};
const tmp = createDispatcherProviderAndHooks(sliceMap, rootAction);

export const { DispatcherProvider } = tmp;
export const useAppDispatcher = tmp.useAppDispatcher as () => typeof rootAction;
export const useSliceDispatcher = tmp.useSliceDispatcher as () => SliceActionsMap<
  typeof sliceMap
>;
```
