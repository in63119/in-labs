import { RELAYER_STATUS } from "@/common/enums";

export type FirebaseRelayer = {
  address?: string;
  status?: RELAYER_STATUS;
};
