import type { InterfaceAbi } from "ethers";

import AuthStorageDev from "@/abis/kaia/test/development/AuthStorage.json";
import AuthStorageProd from "@/abis/kaia/test/production/AuthStorage.json";
import PostStorageDev from "@/abis/kaia/test/development/PostStorage.json";
import PostStorageProd from "@/abis/kaia/test/production/PostStorage.json";
import PostForwarderDev from "@/abis/kaia/test/development/PostForwarder.json";
import PostForwarderProd from "@/abis/kaia/test/production/PostForwarder.json";
import VisitorStorageDev from "@/abis/kaia/test/development/VisitorStorage.json";
import VisitorStorageProd from "@/abis/kaia/test/production/VisitorStorage.json";

const SUPPORTED_ENVS = ["development", "production"] as const;
type SupportedEnv = (typeof SUPPORTED_ENVS)[number];

const envInput = process.env.ENV;
const resolvedEnv =
  SUPPORTED_ENVS.find((value) => value === envInput) ?? "development";

type ContractArtifact = {
  address: string;
  abi: InterfaceAbi;
};

type EnvArtifacts = {
  AuthStorage: ContractArtifact;
  PostStorage: ContractArtifact;
  PostForwarder: ContractArtifact;
  VisitorStorage: ContractArtifact;
};

const abis: Record<SupportedEnv, EnvArtifacts> = {
  development: {
    AuthStorage: AuthStorageDev as ContractArtifact,
    PostStorage: PostStorageDev as ContractArtifact,
    PostForwarder: PostForwarderDev as ContractArtifact,
    VisitorStorage: VisitorStorageDev as ContractArtifact,
  },
  production: {
    AuthStorage: AuthStorageProd as ContractArtifact,
    PostStorage: PostStorageProd as ContractArtifact,
    PostForwarder: PostForwarderProd as ContractArtifact,
    VisitorStorage: VisitorStorageProd as ContractArtifact,
  },
};

export const getAbis = (): EnvArtifacts => {
  return abis[resolvedEnv];
};
