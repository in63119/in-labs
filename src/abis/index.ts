import type { InterfaceAbi } from "ethers";
import AuthStorageLocal from "@/abis/kaia/test/local/AuthStorage.json";
import AuthStorageProd from "@/abis/kaia/test/prod/AuthStorage.json";
import PostStorageLocal from "@/abis/kaia/test/local/PostStorage.json";
import PostStorageProd from "@/abis/kaia/test/prod/PostStorage.json";

const SUPPORTED_ENVS = ["local", "prod"] as const;
type SupportedEnv = (typeof SUPPORTED_ENVS)[number];

const envInput = process.env.ENV;
const resolvedEnv =
  SUPPORTED_ENVS.find((value) => value === envInput) ?? "local";

type ContractArtifact = {
  address: string;
  abi: InterfaceAbi;
};

type EnvArtifacts = {
  AuthStorage: ContractArtifact;
  PostStorage: ContractArtifact;
};

const abis: Record<SupportedEnv, EnvArtifacts> = {
  local: {
    AuthStorage: AuthStorageLocal as ContractArtifact,
    PostStorage: PostStorageLocal as ContractArtifact,
  },
  prod: {
    AuthStorage: AuthStorageProd as ContractArtifact,
    PostStorage: PostStorageProd as ContractArtifact,
  },
};

export const getAbis = (): EnvArtifacts => {
  return abis[resolvedEnv];
};
