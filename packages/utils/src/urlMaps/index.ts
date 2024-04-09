import { BehaviorSubject } from "rxjs";
import { ApiEnvType } from "../ApiEnv";
import _ from "lodash";
import { normalizeLink } from "../normalizeLink";

interface CreateUrlHelpersParams {
  ApiEnv: ApiEnvType;
  // 当前可用的域名
  domainNameSubject: BehaviorSubject<string>;
}

export function createUrl(params: CreateUrlHelpersParams) {
  const { ApiEnv, domainNameSubject } = params;
  // 生成接口请求的 url 前缀
  function getServiceUrl(projectName: string, urlPrefix = ApiEnv.urlEnvPrefix) {
    return `https://${urlPrefix}${projectName}.${domainNameSubject.getValue()}`;
  }
  // 获取活动页 h5 的链接
  function getH5UrlCreator<Q extends Record<string, any>>(p: string) {
    return (query: Q) => {
      if (!_.startsWith(p, "/")) {
        p = "/" + p;
      }
      const url = `https://${
        ApiEnv.urlEnvPrefix
      }h5.${domainNameSubject.getValue()}${p}`;

      return normalizeLink(url, query);
    };
  }

  /**
   * 生成 pc 站点的链接
   */
  function getMainDomainUrlCreator<Q extends Record<string, any>>(p: string) {
    return (query: Q) => {
      if (!_.startsWith(p, "/")) {
        p = "/" + p;
      }
      const url = `https://${
        ApiEnv.urlEnvPrefix || "web"
      }.${domainNameSubject.getValue()}${p}`;

      return normalizeLink(url, query);
    };
  }

  return {
    get oc() {
      return getServiceUrl("oc");
    },
    get api() {
      return getServiceUrl("api");
    },
    get news() {
      // testnet 没有 快讯 api  使用 正式环境的
      return getServiceUrl(
        "news",
        ApiEnv.isTestNet ? ApiEnv.urlEnvPrefixMap.pro : ApiEnv.urlEnvPrefix
      );
    },
    get user() {
      return getServiceUrl("user");
    },
    get cbbcapi() {
      return getServiceUrl("cbbcapi");
    },
    get otc() {
      return getServiceUrl("otc");
    },
    get facade() {
      return getServiceUrl("facadeapi");
    },

    /**
     * 生成 h5 相关链接方法的 creator
     */
    getH5UrlCreator,
    getMainDomainUrlCreator,
    /**
     * reexport from ../normalizeLink
     */
    normalizeLink,

    getAppQuestionUrl: getMainDomainUrlCreator<{
      page?: string;
      lang?: string;
    }>(`/user/app_question`),

    get ws() {
      return `wss://${
        ApiEnv.urlEnvPrefix
      }api.${domainNameSubject.getValue()}/ws`;
    },
    get cbbcWs() {
      return `wss://${
        ApiEnv.urlEnvPrefix
      }cbbcws.${domainNameSubject.getValue()}/ws`;
    },
  };
}
