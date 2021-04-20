## useSubject

### Examples

```tsx
function App() {
  const subject = useSubject<SyntheticEvent<HTMLButtonElement>>();

  useSubscribe(() => {
    return subject.pipi(
      tap((event) => {
        console.log(event);
      })
    );
  }, [subject]);

  return <button onClick={subject.next}>click me</button>;
}
```
