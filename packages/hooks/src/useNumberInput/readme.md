# useNumberInput

对数字输入框做一系列数据清洗，确保返回的数字是符合条件的。

返回的`inputComponent`可以直接传递给`material-ui`的相关`input`组件，
也可以直接当做组件使用

### 参数

详见`NumberInputProps`

### Usage

```tsx
const TestComponent = () => {
  const [value, setValue] = useState("");
  const { inputComponent, ...otherProps } = useNumberInput({
    ...opt,
    value,
    onChange: setValue,
  });

  return React.createElement(inputComponent, {
    value: otherProps.value,
    onChange: otherProps.onChange,
    onBlur: otherProps.onBlur,
  });
};
```

## 底层依赖

- [numbro](http://numbrojs.com/format.html) 数字格式化、操作
- [react-number-format](https://github.com/s-yadav/react-number-format) React component to format number in an input or as a text
