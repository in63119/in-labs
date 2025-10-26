import {
  toUtf8Bytes,
  Wallet,
  keccak256,
  JsonRpcProvider,
  Contract,
  InterfaceAbi,
} from "ethers";
import { decrypt } from "@/lib/crypto";
import PasskeyStorageJson from "@/abis/kaia/test/local/PasskeyStorage.json";

const { address: passkeyStorageAddress, abi: passkeyStorageAbi } =
  PasskeyStorageJson as {
    address: string;
    abi: InterfaceAbi;
  };

const salt = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;
if (!salt) {
  throw new Error("NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH env is missing");
}
const relayerPrivateKeyEncrypted = process.env.RELAYER_PRIVATE_KEY;
if (!relayerPrivateKeyEncrypted) {
  throw new Error("RELAYER_PRIVATE_KEY env is missing");
}

const provider = new JsonRpcProvider("https://public-en-kairos.node.kaia.io");

export const relayer = new Wallet(
  decrypt(relayerPrivateKeyEncrypted, salt),
  provider
);

export const wallet = (email: string) => {
  const input = toUtf8Bytes(email + salt);
  const privateKeyBytes = keccak256(input);
  const wallet = new Wallet(privateKeyBytes);

  return wallet;
};

export const passkeyStorage = new Contract(
  passkeyStorageAddress,
  passkeyStorageAbi,
  provider
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved
