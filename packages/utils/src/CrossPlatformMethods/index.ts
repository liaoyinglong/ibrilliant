import { ApiEnvType } from "../ApiEnv";
import { wrapperedQs } from "../wrapperedQs";
import jsCookies from "js-cookie";
import { AppMethods } from "../App/AppMethods";

function getUserTokenFromCookie(ApiEnv: ApiEnvType) {
  let key = "userToken";
  if (ApiEnv.isTestNet) {
    key = "testUserToken";
  }
  if (ApiEnv.isDev) {
    key = "devUserToken";
  }
  return jsCookies.get(key);
}

function parseUrlToken() {
  const parsed = wrapperedQs.parse(window.location.search);
  return parsed.token || parsed.userToken;
}

interface CreateCrossPlatformMethodsParams {
  ApiEnv: ApiEnvType;
}

export function createCrossPlatformMethods({
  ApiEnv,
}: CreateCrossPlatformMethodsParams) {
  return class CrossPlatformMethods {
    /**
     * 获取token 顺序
     * 1. url上获取
     * 2. app 内打开使用 app方法获取
     * 3. 从cookie上获取
     */
    static getUserToken() {
      return (
        parseUrlToken() ||
        AppMethods.getUserToken() ||
        getUserTokenFromCookie(ApiEnv)
      );
    }

    // TODO: 需要配置完成 urlMaps
    static goLogin() {
      if (AppMethods.isInAppWebView) {
        AppMethods.goLogin();
        return;
      }
      return;
    }
  };
}
