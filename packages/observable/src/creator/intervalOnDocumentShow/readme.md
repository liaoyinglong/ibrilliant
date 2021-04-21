# intervalOnDocumentShow

类似`interval`，不同点在于，只有`document.visibilityState !== "hidden"`的情况下才会发出值。

## usage

```tsx
intervalOnDocumentShow(1000).subscribe((i) => {
  console.log(i); // 每隔1S打印值
});
```
