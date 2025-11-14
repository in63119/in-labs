import getConfig from "@/common/config/default.config";
import { fromException } from "@/server/errors/exceptions";
import { configReady } from "@/server/bootstrap/init";
import { google } from "googleapis";

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
    // const claimPinCode = await subscriberStorage.claimPinCode(account, pinCode);
    // const receipt = await claimPinCode.wait();

    // const event = receipt.logs
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   .map((log: any) => subscriberStorage.interface.parseLog(log))
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   .find((parsed: any) => parsed?.name === "PinCodeStored");
    // if (!event) {
    //   throw fromException("Email", "FAILED_TO_CLAIM_PIN_CODE");
    // }

    void account;
    await sendPinCodeEmail(recipientEmail, pinCode);
  } catch {
    throw fromException("Email", "FAILED_TO_CLAIM_PIN_CODE");
  }
};

type GmailCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  sender: string;
};

const getGmailCredentials = async (): Promise<GmailCredentials> => {
  await configReady;
  const config = getConfig().google ?? {};
  const clientId = config.clientKey ?? process.env.GOOGLE_CLIENT_KEY;
  const clientSecret = config.secretKey ?? process.env.GOOGLE_SECRET_KEY;
  const refreshToken =
    config.refreshToken ?? process.env.GOOGLE_GMAIL_REFRESH_TOKEN;
  const sender = config.sender ?? process.env.GOOGLE_GMAIL_SENDER;

  if (!clientId || !clientSecret || !refreshToken || !sender) {
    throw fromException("Email", "FAILED_TO_CLAIM_PIN_CODE");
  }

  return { clientId, clientSecret, refreshToken, sender };
};

const createGmailClient = async () => {
  const { clientId, clientSecret, refreshToken, sender } =
    await getGmailCredentials();

  const oauth2 = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });
  oauth2.setCredentials({ refresh_token: refreshToken });

  return {
    gmail: google.gmail({ version: "v1", auth: oauth2 }),
    sender,
  };
};

const encodeToBase64Url = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const sendPinCodeEmail = async (recipient: string, pinCode: string) => {
  const { gmail, sender } = await createGmailClient();
  const subject = "IN Labs 인증 코드";
  const body = [
    "IN Labs 인증 코드 안내입니다.",
    "",
    `인증 코드: ${pinCode}`,
    "",
    "본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.",
  ].join("\n");

  const rawMessage = [
    `From: ${sender}`,
    `To: ${recipient}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=\"UTF-8\"",
    "",
    body,
  ].join("\r\n");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodeToBase64Url(rawMessage),
    },
  });
};
