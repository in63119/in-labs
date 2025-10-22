import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const clientState = atom<{
  url: string;
}>({
  key: "clientState",
  default: {
    url: "",
  },
  effects_UNSTABLE: [persistAtom],
});
