# createNotify

## usage

```tsx
export const notifiers = {
  contractPositionRefresh: createNotify("合约 持仓"),
};

function App() {
  useSubscribe(() => {
    // 订阅通知
    return notifiers.contractPositionRefresh.observable.pipe(
      tap(() => {
        // do something
      })
    );
  }, []);

  // 发出通知
  notifiers.contractPositionRefresh.notify();
}
```
