import { JsonRpcProvider, Wallet } from "ethers";

const RPC_URL =
  process.env.KAIA_RPC_URL ??
  process.env.NEXT_PUBLIC_KAIA_RPC_URL ??
  process.env.NEXT_PUBLIC_RPC_URL;

if (!RPC_URL) {
  throw new Error("KAIA RPC URL이 설정되어 있지 않습니다.");
}

// 읽기 전용 프로바이더. 서버 컴포넌트/서버 액션에서만 사용해야 합니다.
export const provider = new JsonRpcProvider(RPC_URL);

export const getAdminWallet = () => {
  const privateKey = process.env.ADMIN_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("ADMIN_PRIVATE_KEY가 설정되어 있지 않습니다.");
  }

  return new Wallet(privateKey, provider);
};
