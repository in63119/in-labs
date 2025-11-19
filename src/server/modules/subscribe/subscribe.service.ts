import { CONTRACT_NAME } from "@/common/enums";
import {
  subscriberStorage,
  decodeContractError,
  sendTxByRelayer,
  accounts,
  wallet,
} from "@/lib/ethersClient";
import { fromException } from "@/server/errors/exceptions";
import { getAdminCode } from "@/server/modules/auth/auth.service";

export const addSubscribe = async (address: string, email: string) => {
  try {
    const receipt = await sendTxByRelayer({
      contract: CONTRACT_NAME.SUBSCRIBERSTORAGE,
      method: "addSubscriberEmail",
      arg: [address, email],
    });

    const event = receipt.logs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((log: any) => subscriberStorage.interface.parseLog(log))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((parsed: any) => parsed?.name === "SubscriberEmailAdded");
    if (!event) {
      throw fromException("Subscriber", "FAILED_TO_SUBSCRIBE");
    }

    return true;
  } catch (error) {
    const decoded = decodeContractError(error, [
      "function addSubscriberEmail(address,string)",
      "error SubscriberStorage__SubscriberEmailAlreadyExists()",
    ]);
    if (
      decoded &&
      decoded.name === "SubscriberStorage__SubscriberEmailAlreadyExists"
    ) {
      throw fromException("Subscriber", "ALREADY_EXISTS_SUBSCRIBER");
    }

    console.error("addSubscribe error", error);
    throw fromException("Subscriber", "FAILED_TO_SUBSCRIBE");
  }
};

export const getSubscriberCount = async () => {
  try {
    const { relayer } = await accounts();
    const account = await wallet(getAdminCode()).getAddress();
    const contract = subscriberStorage.connect(relayer);
    const emails = (await contract.getSubscriberEmails(account)) as string[];

    return emails.length;
  } catch (error) {
    console.error("getSubscriberCount error", error);
    throw fromException("Subscriber", "FAILED_TO_GET_SUBSCRIBERS");
  }
};
