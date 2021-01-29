import _ from "lodash";
import { wrapperedQs as qs } from "../wrapperedQs";

export function normalizeLink(url: string, query: Record<any, any> = {}) {
  const querystr = qs.stringify(query, { addQueryPrefix: false });

  if (!querystr) {
    return url;
  }
  if (_.includes(url, "?")) {
    return url + `&${querystr}`;
  }
  return url + `?${querystr}`;
}
