import { loadSsmAds, loadSsmConfig } from "@/common/config/default.config";

let initialized = false;

const env = process.env.NODE_ENV;
const awsRegion = process.env.AWS_REGION ?? "";
const awsSsmServer = process.env.AWS_SSM_SERVER ?? "";
const awsAccessKey = process.env.AWS_SSM_ACCESS_KEY ?? "";
const awsSecretKey = process.env.AWS_SSM_SECRET_KEY ?? "";
const awsSsmAds = process.env.AWS_SSM_ADS ?? "";

export const initServerConfig = async () => {
  if (initialized) return;
  await loadSsmConfig({
    accessKey: awsAccessKey,
    secretAccessKey: awsSecretKey,
    region: awsRegion,
    param: `${awsSsmServer}/${env}`,
  });
  await loadSsmAds({
    accessKey: awsAccessKey,
    secretAccessKey: awsSecretKey,
    region: awsRegion,
    param: `${awsSsmAds}`,
  });
  initialized = true;
};
