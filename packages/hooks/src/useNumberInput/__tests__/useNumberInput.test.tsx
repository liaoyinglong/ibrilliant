import type { NumberInputProps } from "../index";
import { useNumberInput } from "../index";
import React, { useState } from "react";
import { fireEvent, render } from "@testing-library/react";

function renderTestComponent(
  opt: Pick<NumberInputProps, "decimalScale" | "step">
) {
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

  return render(<TestComponent></TestComponent>);
}
describe("测试数字输入框逻辑", () => {
  it("2 位小数，最小变动价位 0.05", () => {
    const { container } = renderTestComponent({ decimalScale: 2, step: 0.05 });
    const inputNode = container.querySelector("input")!;

    fireEvent.change(inputNode, { target: { value: "1.11" } });
    expect(inputNode.value).toBe("1.10");

    fireEvent.change(inputNode, { target: { value: "1.16" } });
    expect(inputNode.value).toBe("1.15");
  });

  it("1 位小数，最小变动价位 0.3", () => {
    const { container } = renderTestComponent({ decimalScale: 1, step: 0.3 });
    const inputNode = container.querySelector("input")!;

    fireEvent.change(inputNode, { target: { value: "1.1" } });
    expect(inputNode.value).toBe("0.9");

    fireEvent.change(inputNode, { target: { value: "1.3" } });
    expect(inputNode.value).toBe("1.2");
  });

  it("1 位小数，最后一位输入不足step需要补零", () => {
    const { container } = renderTestComponent({ decimalScale: 1, step: 0.5 });
    const inputNode = container.querySelector("input")!;

    fireEvent.change(inputNode, { target: { value: "1.2" } });
    expect(inputNode.value).toBe("1.0");
  });

  it("2 位小数，最后一位输入不足step需要补零", () => {
    const { container } = renderTestComponent({ decimalScale: 2, step: 0.05 });
    const inputNode = container.querySelector("input")!;

    fireEvent.change(inputNode, { target: { value: "1.22" } });
    expect(inputNode.value).toBe("1.20");
  });
});
