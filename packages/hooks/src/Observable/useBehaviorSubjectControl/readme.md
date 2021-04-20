## useBehaviorSubjectControl

### Examples

```tsx
const subject = new BehaviorSubject({ age: 18, name: "xx" });

function App() {
  const control = useBehaviorSubjectControl(subject);
  control.value; // 取值
  control.setValue(); // 使用hooks赋值

  subject.next(); // 调用直接调用subject赋值

  return null;
}
```
