import _ from "lodash";

// ios app 提供的方法
const iosHelper = _.get(window, "webkit.messageHandlers");
// 安卓 app 提供的方法
const androidHelper = _.get(window, "android");

export class AppMethods {
  static isInAppWebView = !!iosHelper || !!androidHelper;

  static get constant() {
    const nativeUrl = {
      // 资金记录 app原生界面标识
      fundingRecords: `{"path": "HPAssetRecordController"}`,
      //  支付方式列表页面
      payMethodsListPage: `{"path": "HPCollectionMethodController"}`,
      // 实名认证界面
      HPSeniorVerifyController: `{"path": "HPSeniorVerifyController"}`,
    };

    if (androidHelper) {
      nativeUrl.payMethodsListPage = `{"uri":"model.mine.activity.PaymentActivity","isReload":true}`;
      nativeUrl.HPSeniorVerifyController = `{"uri":"model.kyc.activity.VerifiedActivity","isReload":true}`;
    }

    return nativeUrl;
  }
  // app 右上角显示的按钮
  static showMenu(title: string, url: string) {
    if (iosHelper) {
      iosHelper.showMenu.postMessage({ title, url });
    }
    if (androidHelper) {
      androidHelper.showMenu?.(true, title, url);
    }
  }

  static getUserToken() {
    // @ts-ignore
    if (window.iOSInfo) {
      // @ts-ignore
      return window.iOSInfo.token;
    }
    return androidHelper?.getUserToken();
  }

  // 去登陆
  static goLogin() {
    if (iosHelper) {
      iosHelper.goLogin.postMessage("goLogin");
    }
    if (androidHelper) {
      androidHelper.goLogin();
    }
  }

  // 跳转到原生界面
  static goNativePage(url: string) {
    if (iosHelper) {
      iosHelper.goNativePage.postMessage(url);
    }
    if (androidHelper) {
      androidHelper.goNativePage(url);
    }
  }
  /**
   * APP分享：
   * @param payload {object}
   * @param payload.type {string|number} 1分享微信  2 分享朋友圈
   * @param payload.invitedCode {string} 邀请码
   * @param payload.addQrcode {boolean} 是否添加二维码
   * @param payload.url {string} 图片绝对路径 | base64
   * @param payload.imageUrl {string} 图片链接 http
   * @param payload.title {string}
   * @param payload.subTitle {string}
   * @param payload.link {string} 跳转链接
   * @param payload.contentType {number}  1 分享图片   2 分享链接
   */
  static goShare(payload: any) {
    console.log(`调用 goshar , 参数是 = `, payload);
    if (iosHelper) {
      iosHelper.goShare.postMessage(payload);
    }
    if (androidHelper) {
      androidHelper.goShare(JSON.stringify(payload));
    }
  }

  static openService() {
    if (iosHelper) {
      iosHelper.openService.postMessage("openService");
    }
    if (androidHelper) {
      androidHelper.openService();
    }
  }
}
