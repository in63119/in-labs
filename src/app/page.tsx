import type { Metadata } from "next";

import HomeLeftColumn from "@/components/HomeLeftColumn";
import HomeRightSidebar from "@/components/HomeRightSidebar";

export const metadata: Metadata = {
  title: "In Labs | Tech · Dev · Food · Bible 실험 아카이브",
  description:
    "최신 웹 기술 실험, 개발 워크플로 실습, 계절 레시피, 말씀 묵상을 함께 정리하는 개인 랩. 주별 실험 기록과 실천 팁을 확인하세요.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "In Labs",
    description:
      "Tech · Dev · Food · Bible 실험을 기록하는 아카이브. Next.js, 패스키, 개발 자동화, 계절 레시피, 묵상 노트를 모았습니다.",
    url: "https://in-labs.example",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "In Labs",
    description: "웹 기술, 개발 루틴, 생활 실험을 함께 기록하는 개인 랩.",
  },
};

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
      <HomeLeftColumn />
      <HomeRightSidebar />
    </div>
  );
}
