import { subscriberStorage, sendTxByRelayer } from "@/lib/ethersClient";
import { fromException } from "@/server/errors/exceptions";
import {
  encodeSubject,
  sendEmail,
} from "@/server/modules/google/gmail.service";
import { CONTRACT_NAME } from "@/common/enums";

export const generateFourDigitCode = (): string => {
  const code = Math.floor(Math.random() * 10000);
  return code.toString().padStart(4, "0");
};

export const claimPinCode = async (
  account: string,
  pinCode: string,
  recipientEmail: string
) => {
  try {
    const receipt = await sendTxByRelayer({
      contract: CONTRACT_NAME.SUBSCRIBERSTORAGE,
      method: "claimPinCode",
      arg: [account, pinCode],
    });

    const event = receipt.logs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((log: any) => subscriberStorage.interface.parseLog(log))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((parsed: any) => parsed?.name === "PinCodeStored");
    if (!event) {
      throw fromException("Email", "FAILED_TO_CLAIM_PIN_CODE");
    }

    await sendPinCodeEmail(recipientEmail, pinCode);
  } catch {
    throw fromException("Email", "FAILED_TO_CLAIM_PIN_CODE");
  }
};

const sendPinCodeEmail = async (recipient: string, pinCode: string) => {
  const subject = "[IN Labs] 인증 코드";
  const encodedSubject = encodeSubject(subject);
  const body = [
    "<html><body>",
    '<div style="text-align:center; margin-bottom:16px;">',
    '<img src="https://in-labs.s3.ap-northeast-2.amazonaws.com/images/in.png" alt="IN Labs" style="max-width:160px;height:auto;" />',
    "</div>",
    "<p>IN Labs 구독자 메일 주소 인증 코드 안내입니다.</p>",
    "<p>----------------------</p>",
    `<p>인증 코드: <strong>${pinCode}</strong></p>`,
    "<p>----------------------</p>",
    "<p>본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.</p>",
    "</body></html>",
  ].join("");

  await sendEmail({ recipient, subject: encodedSubject, body });
};

export const verifyPinCode = async (
  address: string,
  pinCode: string
): Promise<boolean> => {
  let isProcessing = false;

  try {
    const verified = await subscriberStorage.isPinCodeActive(address, pinCode);
    isProcessing = true;
    return verified;
  } catch {
    throw fromException("Email", "FAILED_TO_VERIFY_PIN_CODE");
  } finally {
    if (isProcessing) {
      await clearExpiredPinCodes(address, pinCode);
    }
  }
};

const clearExpiredPinCodes = async (address: string, pinCode: string) => {
  try {
    await sendTxByRelayer({
      contract: CONTRACT_NAME.SUBSCRIBERSTORAGE,
      method: "clearPinCode",
      arg: [address, pinCode],
    });
  } catch {
    console.error("Failed to clear expired pin codes");
  }
};
