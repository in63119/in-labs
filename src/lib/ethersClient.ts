import { toUtf8Bytes, Wallet, keccak256 } from "ethers";

const salt = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;

export const wallet = (email: string) => {
  const input = toUtf8Bytes(email + salt);
  const privateKeyBytes = keccak256(input);
  const wallet = new Wallet(privateKeyBytes);

  return wallet;
};
