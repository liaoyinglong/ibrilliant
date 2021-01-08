interface PlainObj {
  [key: string]: any;
}

export function removeCannotParsedContent<T>(json: T) {
  const res = transformer(json);

  return res as T;
}

export function normalize(str: string) {
  let res = str.replace(/`1\[\[/g, ".");
  res = res.replace(/,\s.*=.*]]/g, "");

  /**
   * 1. application/json-patch+json
   * 2. 收益率 (+3.20%)
   * 类似这种直接忽略
   */
  if (!(str.startsWith("application") || /[\u4e00-\u9fa5]/.test(str))) {
    res = res.replace(/\+/g, "");
  }

  return res;
}

function transformer(data: PlainObj): PlainObj;
function transformer(data: any[]): any[];
function transformer(data: string): string;
function transformer(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => {
      return transformer(item);
    });
  }
  if (typeof data === "object") {
    const res: PlainObj = {};
    Object.keys(data).forEach((key) => {
      const oldValue = data[key];

      const newKey = normalize(key);

      res[newKey] = transformer(oldValue);
    });

    return res;
  }

  if (typeof data === "string") {
    return normalize(data);
  }

  return data;
}
