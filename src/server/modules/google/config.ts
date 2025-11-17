import "server-only";

import { google } from "googleapis";
import getConfig from "@/common/config/default.config";
import { configReady } from "@/server/bootstrap/init";
import type { GmailCredentials, GoogleTokenResponse } from "@/common/types";
import { fromException } from "@/server/errors/exceptions";

export const getGmailCredentials = async (): Promise<GmailCredentials> => {
  await configReady;
  const rootConfig = getConfig();

  const googleConfig = rootConfig.google;
  if (!googleConfig) {
    throw fromException("System", "INTERNAL_SERVER_ERROR");
  }

  const clientId = googleConfig.clientKey;
  const clientSecret = googleConfig.secretKey;
  const refreshToken = googleConfig.refreshToken;
  const sender = googleConfig.sender;

  const apiBaseUrl = rootConfig.system?.apiBaseUrl;
  const redirectUrlEndpoint = googleConfig.redirectUriEndpoint;

  if (
    !clientId ||
    !clientSecret ||
    !refreshToken ||
    !sender ||
    !apiBaseUrl ||
    !redirectUrlEndpoint
  ) {
    throw fromException("System", "INTERNAL_SERVER_ERROR");
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    sender,
    redirectUrl: apiBaseUrl + redirectUrlEndpoint,
  };
};

const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";

export const buildGmailOAuthConsentUrl = async () => {
  const { clientId, redirectUrl } = await getGmailCredentials();

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUrl);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", GMAIL_SEND_SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent"); // force refresh_token issuance
  authUrl.searchParams.set("include_granted_scopes", "true");

  return authUrl.toString();
};

export async function exchangeGoogleAuthCodeToRefreshToken(code: string) {
  const { clientId, clientSecret, redirectUrl } = await getGmailCredentials();

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token exchange failed: ${res.status} ${text}`);
  }

  const tokens = (await res.json()) as GoogleTokenResponse;

  if (!tokens.refresh_token) {
    // 동의 화면에서 offline/consent 옵션이 빠졌거나 이미 발급된 계정일 때 발생
    throw new Error(
      "refresh_token을 받지 못했습니다. offline access를 확인하세요."
    );
  }

  return tokens.refresh_token;
}

export const createGmailClient = async () => {
  const { clientId, clientSecret, refreshToken, sender } =
    await getGmailCredentials();

  if (!refreshToken) {
    throw fromException("Email", "MISSING_REFRESH_TOKEN");
  }

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
