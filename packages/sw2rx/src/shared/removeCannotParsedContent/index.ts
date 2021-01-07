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
