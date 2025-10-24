import { RegistrationResponseJSON } from "@simplewebauthn/server";

export interface WebauthnOptions {
  email: string;
  allowMultipleDevices?: boolean;
}

export type RegistrationCredentialDto = RegistrationResponseJSON;
