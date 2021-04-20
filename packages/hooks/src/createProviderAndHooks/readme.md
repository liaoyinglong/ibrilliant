## createProviderAndHooks

### params

见`createProviderAndHooksParams`类型定义

## Examples

```tsx
// shared.tsx
function useThemeSettingInner() {
  const current = useSelector((state) => state.settings.theme);

  const res = useMemo(() => {
    return {
      current,
      isDark: current === THEME_NAME.DARK,
      isLight: current === THEME_NAME.LIGHT,
    };
  }, [current]);

  useDebugValue(res);

  return res;
}

export const {
  Provider: ThemeSettingProvider,
  useContextValue: useThemeSetting,
} = createProviderAndHooks({
  useValueHooks: useThemeSettingInner,
});

// app.tsx

<ThemeSettingProvider>
  <App />
</ThemeSettingProvider>;

function App() {
  const themeSetting = useThemeSetting();
}
```
