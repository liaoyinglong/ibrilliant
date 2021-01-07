import baseQs from "qs";
import type { IParseOptions, IStringifyOptions } from "qs";

interface PlainObj {
  [key: string]: any;
}

export const wrapperedQs = {
  stringify(obj: any, options?: IStringifyOptions) {
    return baseQs.stringify(obj, {
      arrayFormat: "comma",
      addQueryPrefix: true,
      ...options,
    });
  },

  parse<T extends PlainObj>(str: string, options?: IParseOptions) {
    return baseQs.parse(str, {
      ignoreQueryPrefix: true,
      comma: true,
      decoder(str, decoder, charset) {
        const keywords = {
          true: true,
          false: false,
          null: null,
          undefined,
        };
        if (str in keywords) {
          return keywords[str as keyof typeof keywords];
        }
        return decodeURIComponent(str);
      },
      ...options,
    }) as T;
  },
};
