import { normalizeLink } from "./index";

describe("normalizeLink.test", () => {
  it("输入的url有参数", () => {
    const url = `https://github.com?q=xxxxx`;

    expect(normalizeLink(url, {})).toBe(url);

    expect(
      normalizeLink(url, {
        a: 1,
      })
    ).toBe(`${url}&a=1`);
  });

  it("输入的url无参数", () => {
    const url = `https://github.com`;

    expect(normalizeLink(url, {})).toBe(url);

    expect(
      normalizeLink(url, {
        a: 1,
      })
    ).toBe(`${url}?a=1`);
  });
});
