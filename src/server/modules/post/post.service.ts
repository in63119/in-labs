import { getAdminCode } from "../auth/auth.service";
import { wallet, postStorage, relayer } from "@/lib/ethersClient";
import { NftMetadata } from "@/common/types";

export const getPosts = async () => {
  try {
    const adminCode = getAdminCode(); // 현재는 환경변수로 가져오는데, 추후에는 유저마다의 셋팅값에서 추출
    const address = await wallet(adminCode).getAddress();

    const contract = postStorage.connect(relayer);
    const tokenUrls = await contract.getPosts(address);
    const metadatas = await Promise.all(
      tokenUrls.map(async (url: string) => {
        const res = await fetch(url);
        return (await res.json()) as NftMetadata;
      })
    );

    console.log("getPosts", metadatas);
  } catch (error) {
    console.error(error);
  }
};
