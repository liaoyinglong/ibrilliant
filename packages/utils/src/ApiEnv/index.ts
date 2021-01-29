export function createApiEnv(config: CreateApiEnvParams) {
  const {
    ApiEnvMap,
    defaultDomain,
    domains,
    current,
    isDevLocal,
    urlEnvPrefixMap = { dev: "dev", testnet: "testnet", pro: "" },
  } = config;

  const isDev = current === ApiEnvMap.dev;
  const isPro = current === ApiEnvMap.pro;
  const isTestNet = current === ApiEnvMap.testnet;

  function getUrlPrefix() {
    if (isDev || isDevLocal) {
      return urlEnvPrefixMap.dev;
    }
    if (isTestNet) {
      return urlEnvPrefixMap.testnet;
    }
    return urlEnvPrefixMap.pro;
  }

  return {
    ...ApiEnvMap,
    current,
    isDev,
    isPro,
    isTestNet,
    defaultDomain,
    domains,
    urlEnvPrefixMap,
    urlEnvPrefix: getUrlPrefix(),
    ApiEnvMap,
    isDevLocal,
  };
}

export type ApiEnvType = ReturnType<typeof createApiEnv>;

interface CreateApiEnvParams {
  // 当前的 ApiEnv 值  为ApiEnvMap中的某一项
  current: string;
  ApiEnvMap: {
    dev: string;
    pro: string;
    testnet: string;
  };
  // 是否是开发本地  一般为 process.env.NODE_ENV === 'development'
  isDevLocal: boolean;
  /**
   * url 最前面的前缀
   * 测试环境 dev
   * 沙盘 testnet
   * 生产  空字符串
   */
  urlEnvPrefixMap?: {
    dev: string;
    pro: string;
    testnet: string;
  };

  // 默认优先使用的域名
  defaultDomain: string;
  // 可用域名列表
  domains: string[];
}
