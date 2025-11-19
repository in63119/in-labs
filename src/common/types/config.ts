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
    type?: string;
    project_id?: string;
    private_key_id?: string;
    private_key?: string;
    client_email?: string;
    client_id?: string;
    auth_uri?: string;
    token_uri?: string;
    auth_provider_x509_cert_url?: string;
    client_x509_cert_url?: string;
    universe_domain?: string;
    databaseURL?: string;
  };
};
