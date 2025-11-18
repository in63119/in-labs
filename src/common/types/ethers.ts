import { CONTRACT_NAME } from "@/common/enums";

export type ContractLikeError = {
  data?: string;
  error?: {
    data?: string;
  };
};

export type SendTxByRelayer = {
  contract: CONTRACT_NAME;
  method: string;
  arg: any[];
};
