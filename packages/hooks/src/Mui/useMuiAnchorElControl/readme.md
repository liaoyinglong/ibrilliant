## useMuiAnchorElControl

### Examples

```tsx
function App() {
  const anchorElControl = useMuiAnchorElControl();

  return (
    <>
      <ButtonBase onClick={anchorElControl.action.handleOpen}></ButtonBase>
      <Popper
        open={anchorElControl.open}
        anchorEl={anchorElControl.anchorEl}
        onClose={anchorElControl.action.handleClose}
      ></Popper>
    </>
  );
}
```
