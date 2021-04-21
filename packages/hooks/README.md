# `hooks`

## install

```bash
$ yarn add @ibrilliant/hooks
```

| hooks                                                                             | 简介                                                                   |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [createProviderAndHooks](./src/createProviderAndHooks/readme.md)                  | 对`provider`进行的包装                                                 |
| [createSliceHook](./src/createSliceHook/readme.md)                                | 简化获取`slice` `state`的方式                                          |
| [DispatcherProvider](./src/DispatcherProvider/readme.md)                          | 简化派发`action`调用                                                   |
| [makeSlice](./src/makeSlice/readme.md)                                            | 使用`slice`来封装`useReducer`                                          |
| [useMuiAnchorElControl](./src/Mui/useMuiAnchorElControl/readme.md)                | 管理`material-ui`的`AnchorEl`                                          |
| [useMuiInputControl](./src/Mui/useMuiInputControl/readme.md)                      | 管理`material-ui` `input` `value`                                      |
| [useMuiTabsControl](./src/Mui/useMuiTabsControl/readme.md)                        | 管理`material-ui` `tabs` `value`                                       |
| [useBehaviorSubjectControl](./src/Observable/useBehaviorSubjectControl/readme.md) | 管理`rxjs` `BehaviorSubject`                                           |
| [useSubject](./src/Observable/useSubject/readme.md)                               | 管理`rxjs` `subject`                                                   |
| [useSubscribe](./src/Observable/useSubscribe/readme.md)                           | 自动订阅、取消 `rxjs` `observable`                                     |
| [useActionPending](./src/useActionPending/readme.md)                              | 管理`loading`，避免出现较短时间的闪烁                                  |
| [useConstant](./src/useConstant/readme.md)                                        | reexport from [use-constant](https://github.com/Andarist/use-constant) |
