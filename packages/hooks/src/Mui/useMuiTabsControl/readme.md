## useMuiTabsControl

### Examples

```tsx
function App() {
  const muiTabsController = useMuiTabsControl(tabTypes.add);

  return (
    <Tabs onChange={muiTabsController.onChange} value={muiTabsController.value}>
      {[
        { label: intl("increament", "增加"), value: tabTypes.add },
        { label: intl("reduce", "减少"), value: tabTypes.reduce },
      ].map((item) => {
        return (
          <Tab key={item.label} value={item.value} label={item.label}></Tab>
        );
      })}
    </Tabs>
  );
}
```
