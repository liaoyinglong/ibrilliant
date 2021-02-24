import type { NumberFormatProps } from "react-number-format";
import NumberFormat from "react-number-format";
import React from "react";

type NumberInputProps = Omit<NumberFormatProps, "getInputRef">;

export interface NumberFormatInputComponentProps
  extends Pick<NumberFormatProps, "onValueChange"> {
  inputRef?: (instance: NumberFormat | null) => void;
  onChange?: (event: { target: { value: string } }) => void;
}

/**
 * @description 返回值写了any，目的是为了传递个 mui 的inputcomponent 的时候通过编译
 * 一般是将传递给 mui 的input 的 的inputcomponent使用
 * @example
 * <InputBase inputComponent={createNumberFormatInputComponent(options)} />
 */
export const createNumberFormatInputComponent = (
  options?: NumberInputProps
): any => {
  return function NumberFormatInputComponent(
    props: NumberFormatInputComponentProps
  ) {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        isNumericString
        inputMode={"decimal"}
        {...options}
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange?.({ target: { value: values.value } });
          other.onValueChange?.(values);
        }}
      />
    );
  };
};
