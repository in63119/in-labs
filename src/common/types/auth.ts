import type {
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { Device } from "../enums";

export interface RequestWebauthnOptions {
  email: string;
  device?: Device;
  allowMultipleDevices?: boolean;
}

export type NormalizedPasskey = {
  credential: {
    id: string;
    idBuffer: Buffer;
    idBase64: string;
    idBase64Url: string;
    publicKey: Uint8Array<ArrayBuffer>;
    publicKeyBuffer: Buffer;
    counter: number;
    transports: AuthenticatorTransportFuture[];
    [key: string]: unknown;
  };
  attestationObject?: Buffer;
  [key: string]: unknown;
};

export type RegistrationRequest = {
  credential: RegistrationResponseJSON;
  device: Device;
  allowMultipleDevices: boolean;
};

export type DeviceInfoLike = {
  deviceType?: string | null;
  os?: string | null;
  userAgent?: string | null;
};

export type StoredPasskey = {
  credential: {
    id: string;
    publicKey: string;
    counter: number;
    transports?: AuthenticatorTransportFuture[] | string[];
  };
  attestationObject?: string;
  [key: string]: unknown;
};
