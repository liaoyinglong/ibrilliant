import { BehaviorSubject } from "rxjs";
import { act, renderHook } from "@testing-library/react-hooks";
import { useBehaviorSubjectControl } from "./index";

function createTest() {
  const subject = new BehaviorSubject(1);
  return {
    ...renderHook(() => useBehaviorSubjectControl(subject)),
    subject,
  };
}

describe("测试 useBehaviorSubjectControl", () => {
  it("不做更改应该只渲染一次", () => {
    const { result } = createTest();
    expect(result.all.length).toBe(1);
  });

  it("外部调用subject.next，hooks应该同步同步状态", () => {
    const { result, subject } = createTest();
    act(() => {
      subject.next(22);
    });
    expect(result.current.value).toBe(22);
    expect(subject.value).toBe(22);
    expect(result.all.length).toBe(2);
  });

  it("hooks更新状态 subject应该同步", () => {
    const { result, subject } = createTest();
    act(() => {
      result.current.setValue(22);
    });
    expect(result.current.value).toBe(22);
    expect(subject.value).toBe(22);
    expect(result.all.length).toBe(2);
  });
});
