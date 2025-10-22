"use client";

import { ReactNode } from "react";
import { RecoilRoot } from "recoil";

type Props = {
  children: ReactNode;
};

export default function RecoilRootProvider({ children }: Props) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
