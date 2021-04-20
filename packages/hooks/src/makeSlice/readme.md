## makeSlice

### Examples

```tsx
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

function Comp() {
  const [state, actions] = useSlice();

  return (
    <div>
      {state.count}
      <hr />
      <button onClick={actions.increment}>increment</button>
      <button onClick={actions.decrement}>decrement</button>
    </div>
  );
}
```
