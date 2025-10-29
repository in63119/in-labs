import { getAdminCode } from "../auth/auth.service";
import { wallet, postStorage, relayer } from "@/lib/ethersClient";
import { NftMetadata } from "@/common/types";

export const getPosts = async () => {
  try {
    const adminCode = getAdminCode(); // 현재는 환경변수로 가져오는데, 추후에는 유저마다의 셋팅값에서 추출
    const address = await wallet(adminCode).getAddress();

    const contract = postStorage.connect(relayer);
    const rawPosts = await contract.getPosts(address);

    const posts = await Promise.all(
      rawPosts.map(async ([tokenId, metadataUrl]: [bigint, string]) => {
        const res = await fetch(metadataUrl);
        const metadata = (await res.json()) as NftMetadata;

        // return {
        //   tokenId: Number(tokenId), // 필요에 따라 string/number로 변환
        //   metadataUrl,
        //   metadata,
        // };
        return metadata;
      })
    );

    return posts;
  } catch (error) {
    console.error(error);
  }
};
