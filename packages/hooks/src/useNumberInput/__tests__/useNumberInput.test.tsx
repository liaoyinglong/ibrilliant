import type { NumberInputProps } from "../index";
import { useNumberInput } from "../index";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import React, { useEffect, useState } from "react";
import { fireEvent, render } from "@testing-library/react";

function renderTestComponent(opt: NumberInputProps) {
  const setValueRef: MutableRefObject<Dispatch<
    SetStateAction<string>
  > | null> = {
    current: null,
  };
  const TestComponent = () => {
    const [value, setValue] = useState("");
    setValueRef.current = setValue;
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
  const renderRes = render(<TestComponent></TestComponent>);

  return {
    ...renderRes,
    inputNode: renderRes.container.querySelector("input")!,
    setValueRef,
  };
}
describe("测试数字输入框逻辑", () => {
  it("2 位小数，最小变动价位 0.05", () => {
    const { inputNode } = renderTestComponent({ decimalScale: 2, step: 0.05 });

    fireEvent.change(inputNode, { target: { value: "1.11" } });
    expect(inputNode.value).toBe("1.10");

    fireEvent.change(inputNode, { target: { value: "1.16" } });
    expect(inputNode.value).toBe("1.15");
  });

  it("支持删除全部", () => {
    const { inputNode } = renderTestComponent({ decimalScale: 1, step: 0.3 });
    fireEvent.change(inputNode, { target: { value: "" } });
    expect(inputNode.value).toBe("");

    fireEvent.change(inputNode, { target: { value: " " } });
    expect(inputNode.value).toBe("");
  });

  it("1 位小数，最小变动价位 0.3", () => {
    const { inputNode } = renderTestComponent({ decimalScale: 1, step: 0.3 });

    fireEvent.change(inputNode, { target: { value: "1.1" } });
    expect(inputNode.value).toBe("0.9");

    fireEvent.change(inputNode, { target: { value: "1.3" } });
    expect(inputNode.value).toBe("1.2");
  });

  it("1 位小数，最后一位输入不足step需要补零", () => {
    const { inputNode } = renderTestComponent({ decimalScale: 1, step: 0.5 });

    fireEvent.change(inputNode, { target: { value: "1.2" } });
    expect(inputNode.value).toBe("1.0");
  });

  it("1 位小数，最小变动价位 0.5", () => {
    const setValueSpy = jest.fn();
    function InputComponent(props: any) {
      const { inputComponent, ...otherProps } = useNumberInput(props);

      return React.createElement(inputComponent, {
        value: otherProps.value,
        onChange: otherProps.onChange,
        onBlur: otherProps.onBlur,
      });
    }

    const TestComponent = () => {
      const [value, setValue] = useState("");
      const [isMarketPrice, setIsMarketPrice] = useState(true);
      useEffect(() => {
        if (isMarketPrice) {
          setValue("");
        } else {
          setValue("56683.0");
        }
        setValueSpy();
      }, [isMarketPrice]);

      return (
        <>
          <button
            onClick={() => {
              setIsMarketPrice(!isMarketPrice);
            }}
          >
            toggle price type
          </button>
          <InputComponent
            isMarketPrice={isMarketPrice}
            decimalScale={1}
            step={0.5}
            value={value}
            onChange={setValue}
          ></InputComponent>
        </>
      );
    };
    const renderRes = render(<TestComponent></TestComponent>);
    const inputNode = renderRes.container.querySelector("input")!;
    const btnNode = renderRes.container.querySelector("button")!;

    expect(inputNode.value).toBe("");
    expect(setValueSpy).toBeCalledTimes(1);

    fireEvent.click(btnNode);
    expect(inputNode.value).toBe("56683.0");
    expect(setValueSpy).toBeCalledTimes(2);

    fireEvent.click(btnNode);
    expect(inputNode.value).toBe("");
    expect(setValueSpy).toBeCalledTimes(3);

    fireEvent.click(btnNode);
    expect(inputNode.value).toBe("56683.0");
    expect(setValueSpy).toBeCalledTimes(4);
  });

  it("2 位小数，最后一位输入不足step需要补零", () => {
    const { inputNode } = renderTestComponent({ decimalScale: 2, step: 0.05 });

    fireEvent.change(inputNode, { target: { value: "1.22" } });
    expect(inputNode.value).toBe("1.20");
  });

  it("最大值限制应该生效", () => {
    const { inputNode } = renderTestComponent({
      max: 1.1,
      step: 0.1,
      decimalScale: 1,
    });

    fireEvent.change(inputNode, { target: { value: "1.22" } });
    expect(inputNode.value).toBe("1.1");
  });

  it("最小值限制应该生效", () => {
    const { inputNode } = renderTestComponent({
      min: 1.1,
      step: 0.1,
      decimalScale: 1,
    });
    fireEvent.change(inputNode, { target: { value: "0.92" } });
    expect(inputNode.value).toBe("1.1");
  });

  it("负数的处理", () => {
    const { inputNode } = renderTestComponent({
      decimalScale: 2,
      step: 0.05,
      allowNegative: true,
      min: -Infinity,
    });

    fireEvent.change(inputNode, { target: { value: "1.11" } });
    expect(inputNode.value).toBe("1.10");

    fireEvent.change(inputNode, { target: { value: "1.16" } });
    expect(inputNode.value).toBe("1.15");

    fireEvent.change(inputNode, { target: { value: "-1.16" } });
    expect(inputNode.value).toBe("-1.15");
  });

  it("不传step应该根据decimalScale生成", () => {
    const { inputNode } = renderTestComponent({
      decimalScale: 5,
    });
    fireEvent.change(inputNode, { target: { value: "0.123456" } });
    expect(inputNode.value).toBe("0.12345");
  });

  it("直接输入小数点应该补零到最前面", () => {
    const { inputNode } = renderTestComponent({
      decimalScale: 2,
      step: 0.05,
    });
    fireEvent.change(inputNode, { target: { value: "." } });
    expect(inputNode.value).toBe("0.");
  });

  it("onBlur的时候应该修正最小变动价位", () => {
    const { inputNode } = renderTestComponent({
      decimalScale: 0,
      step: 5,
    });
    fireEvent.change(inputNode, { target: { value: "12" } });
    fireEvent.blur(inputNode);
    expect(inputNode.value).toBe("10");

    fireEvent.change(inputNode, { target: { value: "10" } });
    fireEvent.blur(inputNode);
    expect(inputNode.value).toBe("10");
  });
});
