import _ from "lodash";
import { useUpdate } from "react-use";
import type React from "react";
import { useCallback, useMemo } from "react";
import numbro from "numbro";
import {
  createNumberFormatInputComponent,
  NumberFormatInputComponentProps,
} from "./createNumberInputComponent";

export { createNumberFormatInputComponent, NumberFormatInputComponentProps };

export interface NumberInputProps {
  /**
   * 几位小数  一般是 最小单位精度
   */
  decimalScale?: number;
  /**
   * 点击 加减号 的 步长  一般是最小交易单位
   */
  step?: number;
  onChange?: (num: string) => void;
  value?: string;
  max?: number;
  min?: number;

  // 是否显示 负数 默认不显示
  allowNegative?: boolean;

  // 是否是市价
  isMarketPrice?: boolean;
}

/**
 * 公用的 数字输入框处理逻辑
 */
export function useNumberInput(props: NumberInputProps) {
  const {
    decimalScale,
    step,
    // 最大值三段统一  控制在整数位8个
    max = 99999999,
    min = 0,
    isMarketPrice,
    value,
    onChange: propsOnChange = _.noop,

    allowNegative = false,

    ...otherProps
  } = props;

  const forceUpdate = useUpdate();
  const normalizedStep = useMemo(() => {
    if (Number.isNaN(+step!)) {
      if (decimalScale) {
        // 小数 位数 为 0 个
        if (decimalScale === 0) {
          return 1;
        }
        return +`0.${_.padEnd(``, decimalScale - 1, "0")}1`;
      }
      return 0.001;
    }

    return step!;
  }, [decimalScale, step]);

  const inputComponent = useMemo(() => {
    return createNumberFormatInputComponent({ decimalScale, allowNegative });
  }, [allowNegative, decimalScale]);

  const normalizNextValue = useCallback(
    (nextValue: string) => {
      if (nextValue === ".") {
        return "0.";
      }
      if ((allowNegative && nextValue === "-") || nextValue === "") {
        return nextValue;
      }

      const fn = _.startsWith(nextValue, "-") ? Math.ceil : Math.floor;

      const t = numbro(
        fn(numbro(nextValue).divide(normalizedStep).value())
      ).multiply(normalizedStep);

      const res = numbro(Math.max(min, Math.min(t.value(), max)));

      //#region fix IBR-3220
      /**
       * bug： 1. => 1.2 => 1
       * 预期： 1. => 1.2 => 1.0
       * bug： 1.2 => 1.21 => 1.2
       * 预期： 1.2 => 1.21 => 1.20
       * to fix http://192.168.92.154:8080/browse/IBR-3220
       */
      const hasPadEnd = res.format({ mantissa: decimalScale || 0 });
      if (
        nextValue === hasPadEnd ||
        (nextValue.length === hasPadEnd.length && res.value() === +hasPadEnd)
      ) {
        return hasPadEnd;
      }
      //#endregion
      return String(res.value());
    },
    [allowNegative, decimalScale, max, min, normalizedStep]
  );

  const onChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = useCallback(
    (event) => {
      let nextValue = event.target.value;

      if (nextValue === "") {
        propsOnChange(nextValue);
        return;
      }
      // console.log('befort nextValue = ', nextValue);

      if (normalizedStep < 1) {
        nextValue = normalizNextValue(nextValue);
      }

      // console.log('end nextValue = ', nextValue);
      propsOnChange(nextValue);
      // console.log({
      //   decimalScale,
      //   step,
      //   normalizedStep,
      //   nextValue,
      //   'event.target.value': event.target.value,
      // });
      /**
       * 加 这个的原因 nextValue 可能跟前一次值相同 导致 react不走update
       * 解决以下case
       *  step=0.5  decimalScale = 1
       *  输入0.4 显示 0.4  不符合
       *  输入0.6 显示 0.5  符合
       */
      forceUpdate();
    },
    [forceUpdate, normalizNextValue, normalizedStep, propsOnChange]
  );

  const onBlur = useCallback(() => {
    const nextValue = normalizNextValue(String(value));
    if (nextValue === value) {
      return;
    }
    propsOnChange(nextValue);
    forceUpdate();
  }, [forceUpdate, normalizNextValue, propsOnChange, value]);

  const onPlus = useCallback(() => {
    if (isMarketPrice) {
      return;
    }
    const nextValueNumber = numbro(value || min)
      .add(normalizedStep)
      .value();

    const nextValueString = numbro(Math.min(nextValueNumber, max)).format({
      mantissa: decimalScale,
    });

    propsOnChange(nextValueString);
  }, [
    decimalScale,
    isMarketPrice,
    max,
    min,
    normalizedStep,
    propsOnChange,
    value,
  ]);

  const onMinus = useCallback(() => {
    if (isMarketPrice) {
      return;
    }
    const nextValueNumber = numbro(value || min)
      .subtract(normalizedStep)
      .value();

    const nextValueString = numbro(Math.max(nextValueNumber, min)).format({
      mantissa: decimalScale,
    });

    propsOnChange(nextValueString);
  }, [decimalScale, isMarketPrice, min, normalizedStep, propsOnChange, value]);

  return {
    otherProps,
    isMarketPrice,
    onPlus,
    onMinus,
    inputComponent,
    onChange,
    value,
    onBlur,
  };
}
