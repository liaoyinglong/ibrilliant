interface CreateUrlHelpersParams {

  ApiEnv: {
    current: string;
    isDev: boolean;
    isPro: boolean;
    isTestNet: boolean;
  };
  // 获取
  getDomain:()=>string


}

export function createUrl() {}
