import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { createLogger } from "../logger";

const errorLog = createLogger("唯一机器码:生成失败");

export async function getDeviceID() {
  try {
    const fp = await FingerprintJS.load();
    const res = await fp.get();
    return res.visitorId;
  } catch (e) {
    errorLog(e);
    return "";
  }
}
