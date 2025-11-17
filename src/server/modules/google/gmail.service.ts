import { fromException } from "@/server/errors/exceptions";
import { createGmailClient } from "../google/config";
import type { EmailContent } from "@/common/types";

const encodeToBase64Url = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export const encodeSubject = (subject: string) =>
  `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

export const sendEmail = async ({ recipient, subject, body }: EmailContent) => {
  try {
    const { gmail, sender } = await createGmailClient();

    const rawMessage = [
      `From: ${sender}`,
      `To: ${recipient}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset="UTF-8"',
      "",
      body,
    ].join("\r\n");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodeToBase64Url(rawMessage),
      },
    });
  } catch {
    throw fromException("Email", "FAILED_SENDING_EMAIL");
  }
};
