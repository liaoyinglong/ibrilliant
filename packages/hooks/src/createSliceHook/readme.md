## createSliceStateHook

### Examples

```tsx
export const appSlice = createSlice({
  name: "app",
  initialState: { count: 0, appid: "" },
  reducers: {
    increase(state) {
      state.count++;
    },
  },
});
export const { useAppSliceState } = createSliceStateHook(appSlice);

function App() {
  const { count } = useAppSliceState(["count"]);
}

function App2() {
  const { count, appid } = useAppSliceState();
}
```

---

## useSliceState

### Examples

```tsx
export const appSlice = createSlice({
  name: "app",
  initialState: { count: 0, appid: "" },
  reducers: {
    increase(state) {
      state.count++;
    },
  },
});

function App() {
  const { count } = useSliceState(appSlice, ["count"]);
}
function App2() {
  const { count, appid } = useSliceState(appSlice);
}
```
