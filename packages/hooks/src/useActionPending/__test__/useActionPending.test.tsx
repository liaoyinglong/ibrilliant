import { useActionPending } from "../index";
import { act, fireEvent, render } from "@testing-library/react";

function TestComponent() {
  const [pending, actions] = useActionPending({ delay: 500 });

  return (
    <div>
      <span aria-label={"toShowPendingText"}>{String(pending)}</span>
      <button aria-label={"setTrue"} onClick={actions.setTrue}>
        setTrue
      </button>
      <button aria-label={"setFalse"} onClick={actions.setFalse}>
        setFalse
      </button>
    </div>
  );
}

describe("useActionPending", () => {
  let span: HTMLElement;
  let setTrueBtn: HTMLElement;
  let setFalseBtn: HTMLElement;
  beforeEach(() => {
    const res = render(<TestComponent></TestComponent>);
    span = res.getByLabelText("toShowPendingText");
    setTrueBtn = res.getByLabelText("setTrue");
    setFalseBtn = res.getByLabelText("setFalse");
    // we're using fake timers because we don't want to
    // wait a full second for this test to run.
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("耗时1S应该显示pending", () => {
    fireEvent.click(setTrueBtn);
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(span.textContent).toBe("false");
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(span.textContent).toBe("true");
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(span.textContent).toBe("true");

    fireEvent.click(setFalseBtn);
    expect(span.textContent).toBe("false");
  });

  it("耗时小于500ms 应该不显示pending", () => {
    fireEvent.click(setTrueBtn);
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(span.textContent).toBe("false");
    fireEvent.click(setFalseBtn);
    expect(span.textContent).toBe("false");
  });
});
