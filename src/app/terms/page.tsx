import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | In Labs",
  description:
    "In Labs 이용 약관을 확인하세요. 콘텐츠 이용, 면책 조항, 약관 변경 절차를 안내합니다.",
  alternates: {
    canonical: "/terms",
  },
};

export default function Terms() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>Terms of Service</h1>
      <h2>1. 목적</h2>
      <p>본 약관은 In Labs 사이트 이용에 관한 기본 사항을 규정합니다.</p>
      <h2>2. 콘텐츠</h2>
      <p>
        모든 글·이미지는 저작권의 보호를 받습니다. 무단 복제·배포를 금합니다.
      </p>
      <h2>3. 면책</h2>
      <p>
        게시된 정보의 활용은 이용자 책임이며, 손해에 대해 법이 허용하는 범위
        내에서 책임을 제한합니다.
      </p>
      <h2>4. 변경</h2>
      <p>약관은 사전 고지 후 개정될 수 있습니다.</p>
      <p>시행일: 2025-10-18</p>
    </section>
  );
}
