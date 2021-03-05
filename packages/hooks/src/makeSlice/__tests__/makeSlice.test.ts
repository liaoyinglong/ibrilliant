import { makeSlice } from "../index";
import { renderHook, act } from "@testing-library/react-hooks";

const useSlice = makeSlice({
  name: "name是为了debug用的",
  initialState: { count: 0 },
  reducers: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
  },
});

describe("测试 makeSlice", () => {
  it("hooks调用时传入默认state", () => {
    const { result } = renderHook(() => useSlice({ count: 222 }));
    act(() => {
      result.current[1].increment();
    });
    expect(result.current[0].count).toBe(223);
  });
  it("actions 是不可变的", () => {
    const { result } = renderHook(() => useSlice());
    const prevActions = result.current[1];

    act(() => {
      prevActions.increment();
    });

    expect(result.current[0].count).toBe(1);
    expect(result.current[1]).toBe(prevActions);
  });
});
