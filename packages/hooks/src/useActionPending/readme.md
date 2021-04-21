## useActionPending

很多时候，在一个异步过程中，我们需要给用户一个指示，无论是一个遮罩层这样的阻塞式的，还是一个旋转的小圈这种非阻塞式的。但从另一个角度看，不管异步的实际情况，二话不说地用上指示器，有时候反而会带来用户体验上的倒退。有不少 100-200ms 就能完成的请求，突兀地调起指示器，又很快消失，对用户会造成一种不适感。因此，我们需要根据异步的时长来做判断，短时间内不出现指示器，而超过一定时长后则出现。

### Examples

```tsx
function App() {
  const [loading, loadingAction] = useActionPending();

  return (
    <ActionButton
      loading={loading}
      onClick={loading ? loadingAction.setTrue : loadingAction.setFalse}
    >
      click me
    </ActionButton>
  );
}
```
