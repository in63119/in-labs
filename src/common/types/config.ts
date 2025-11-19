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
  };
  firebase?: {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  };
};
