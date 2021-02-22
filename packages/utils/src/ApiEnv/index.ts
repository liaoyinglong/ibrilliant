/**
 * 一般是接口用
 */
const ApiEnvMap = {
  dev: "dev",
  pro: "web",
  testnet: "testnet",
};
/**
 * url 最前面的前缀
 * 测试环境 dev
 * 沙盘 testnet
 * 生产  空字符串
 */
const urlEnvPrefixMap = { dev: "dev", testnet: "testnet", pro: "" };

export function createApiEnv(config: CreateApiEnvParams) {
  const { defaultDomain, domains, current, isDevLocal } = config;

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
  // 是否是开发本地  一般为 process.env.NODE_ENV === 'development'
  isDevLocal: boolean;
  // 默认优先使用的域名
  defaultDomain: string;
  // 可用域名列表
  domains: string[];
}
