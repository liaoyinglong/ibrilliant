# useSelectorWithIsEqual

对`useSelector`包装，默认传入 深对比 的`equalityFn`做性能提升

### 参数

与`useSelector`一样

### Usage

```tsx
const TestComponent = () => {
  const { contractLongInfo, contractShortInfo } = useSelectorWithIsEqual(
    (state) => {
      return {
        contractLongInfo: state.contractLongInfo,
        contractShortInfo: state.contractLongInfo,
      };
    }
  );
};
```
