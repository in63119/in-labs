export type AwsConfigs = {
  accessKey?: string;
  secretAccessKey?: string;
  region?: string;
  param?: string;
};

export type Config = {
  system?: {
    apiBaseUrl?: string;
  };
  auth?: {
    adminCode?: string;
    adminAuthCodeHash?: string;
  };
  aws?: {
    s3?: {
      bucket?: string;
      accessKey?: string;
      secretKey?: string;
    };
  };
  blockchain?: {
    relayerPK?: string;
  };
  google?: {
    adsenseClient?: string;
    clientKey?: string;
    secretKey?: string;
    refreshToken?: string;
    sender?: string;
  };
};
