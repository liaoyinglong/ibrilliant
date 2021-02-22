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
  // 生成接口请求的url前缀
  function getServiceUrl(projectName: string, urlPrefix = ApiEnv.urlEnvPrefix) {
    return `https://${urlPrefix}${projectName}.${domainNameSubject.getValue()}`;
  }
  // 获取活动页h5的链接
  function getH5UrlCreator(p: string) {
    return (query: Record<string, any>) => {
      if (!_.startsWith(p, "/")) {
        p = "/" + p;
      }
      const url = `https://${
        ApiEnv.urlEnvPrefix
      }h5.${domainNameSubject.getValue()}${p}`;

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
      // testnet 没有 快讯api  使用 正式环境的
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
  };
}
