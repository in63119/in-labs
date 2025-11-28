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
      momBucket?: string;
      accessKey?: string;
      secretKey?: string;
    };
  };
  blockchain?: {
    contractsOwnerPK?: string;
    relayerPK?: string;
    relayer2PK?: string;
    relayer3PK?: string;
  };
  google?: {
    adsenseClient?: string;
    clientKey?: string;
    secretKey?: string;
    refreshToken?: string;
    sender?: string;
    redirectUriEndpoint?: string;
    geminiApiKey?: string;
  };
  firebase?: {
    project_id?: string;
    private_key?: string;
    client_email?: string;
    databaseURL?: string;
  };
  kakaoAd?: {
    top?: {
      unit?: string;
    };
    bottom?: {
      unit?: string;
    };
    side?: {
      unit?: string;
    };
  };
};
