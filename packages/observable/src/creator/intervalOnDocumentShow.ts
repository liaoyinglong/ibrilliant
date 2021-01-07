import { timer } from "rxjs";
import { subscribeWhenDocumentShow } from "./subscribeWhenDocumentShow";

/**
 * @param pollingInterval 轮询间隔
 * @param delay 延迟多久后开始第一次轮询 默认 0
 */
export function intervalOnDocumentShow(pollingInterval = 5000, delay = 0) {
  return subscribeWhenDocumentShow(timer(delay, pollingInterval));
}
