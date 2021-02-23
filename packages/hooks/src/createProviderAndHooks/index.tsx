import type { FC } from "react";
import React, { useContext } from "react";

interface createProviderAndHooksParams<T> {
  /**
   * 传入一个hooks 返回值会给 context 的 value
   */
  useValueHooks: () => T;
  defaultValue?: any;
}

export function createProviderAndHooks<T>(
  params: createProviderAndHooksParams<T>
) {
  const { useValueHooks, defaultValue } = params;
  const Context = React.createContext<T>(defaultValue);

  const Provider: FC = (props) => {
    const value = useValueHooks();
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  function useContextValue() {
    return useContext(Context);
  }

  return {
    Provider,
    useContextValue,
  };
}
