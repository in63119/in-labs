import { loadSsm } from "@/lib/awsClient";
import { AwsConfigs, Config } from "@/common/types";

const config: Config = {};

export const loadSsmConfig = async (awsConfig: AwsConfigs) => {
  if (awsConfig.param) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ssmKeys: any = await loadSsm(awsConfig);

    if (!config.system) config.system = {};
    if (!config.auth) config.auth = {};
    if (!config.aws) config.aws = {};
    if (!config.aws.s3) config.aws.s3 = {};
    if (!config.blockchain) config.blockchain = {};
    if (!config.google) config.google = {};
    if (!config.firebase) config.firebase = {};

    config.system.apiBaseUrl = ssmKeys.NEXT_PUBLIC_API_BASE_URL;

    config.auth.adminCode = ssmKeys.NEXT_PUBLIC_ADMIN_CODE;
    config.auth.adminAuthCodeHash = ssmKeys.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;

    config.aws.s3.bucket = ssmKeys.AWS_S3_BUCKET;
    config.aws.s3.accessKey = ssmKeys.AWS_S3_ACCESS_KEY_ID;
    config.aws.s3.secretKey = ssmKeys.AWS_S3_SECRET_ACCESS_KEY;

    config.blockchain.contractsOwnerPK = ssmKeys.CONTRACTS_OWNER_PRIVATE_KEY;
    config.blockchain.relayerPK = ssmKeys.NEXT_PUBLIC_RELAYER_PRIVATE_KEY;
    config.blockchain.relayer2PK = ssmKeys.NEXT_PUBLIC_RELAYER2_PRIVATE_KEY;
    config.blockchain.relayer3PK = ssmKeys.NEXT_PUBLIC_RELAYER3_PRIVATE_KEY;

    config.google.adsenseClient = ssmKeys.NEXT_PUBLIC_ADSENSE_CLIENT;
    config.google.clientKey = ssmKeys.GOOGLE_CLIENT_KEY;
    config.google.secretKey = ssmKeys.GOOGLE_SECRET_KEY;
    config.google.refreshToken = ssmKeys.GOOGLE_REFRESH_TOKEN;
    config.google.sender = ssmKeys.GOOGLE_GMAIL_SENDER;
    config.google.redirectUriEndpoint = ssmKeys.GOOGLE_REDIRECT_URI_ENDPOINT;

    config.firebase.type = ssmKeys.FIREBASE.type;
    config.firebase.project_id = ssmKeys.FIREBASE.project_id;
    config.firebase.private_key_id = ssmKeys.FIREBASE.private_key_id;
    config.firebase.private_key = ssmKeys.FIREBASE.private_key;
    config.firebase.client_email = ssmKeys.FIREBASE.client_email;
    config.firebase.client_id = ssmKeys.FIREBASE.client_id;
    config.firebase.auth_uri = ssmKeys.FIREBASE.auth_uri;
    config.firebase.token_uri = ssmKeys.FIREBASE.token_uri;
    config.firebase.auth_provider_x509_cert_url =
      ssmKeys.FIREBASE.auth_provider_x509_cert_url;
    config.firebase.client_x509_cert_url =
      ssmKeys.FIREBASE.client_x509_cert_url;
    config.firebase.universe_domain = ssmKeys.FIREBASE.universe_domain;
    config.firebase.databaseURL = ssmKeys.FIREBASE.databaseURL;
  }
};

const getConfig = () => ({ ...config });
export default getConfig;
