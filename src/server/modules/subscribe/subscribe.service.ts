import { subscriberStorage, decodeContractError } from "@/lib/ethersClient";
import { fromException } from "@/server/errors/exceptions";

export const addSubscribe = async (address: string, email: string) => {
  try {
    const addSubscriberEmail = await subscriberStorage.addSubscriberEmail(
      address,
      email
    );
    const receipt = await addSubscriberEmail.wait();
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
    throw fromException("Subscriber", "FAILED_TO_SUBSCRIBE");
  }
};
