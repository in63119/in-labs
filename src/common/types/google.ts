export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type: string;
};

export type GmailCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  sender: string;
  redirectUrl: string;
};

export type GoogleTokenStatusResponse = {
  ok: boolean;
  valid: boolean;
};
