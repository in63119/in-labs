import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | In Labs",
  description:
    "In Labs는 Tech · Food · Bible 세 가지 주제를 실험하며 기록하는 개인 아카이브입니다. 작성 원칙과 운영 방침을 소개합니다.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>About In Labs</h1>
      <p>
        In Labs는 <strong>Tech · Food · Bible</strong> 세 가지 축을 따라 매주 작은 실험과 기록을
        남기는 개인 프로젝트입니다. 반복적으로 부딪히는 문제를 정리하고, 일상에서 발견한 인사이트를
        빠르게 검증하는 것이 목표입니다.
      </p>
      <h2>작성 원칙</h2>
      <ul>
        <li>모든 글은 직접 조사·작성한 원본 콘텐츠를 지향합니다.</li>
        <li>실험 과정에서 실패하거나 놓친 부분도 솔직하게 기록합니다.</li>
        <li>재현 가능한 실습 코드, 레시피, 묵상 질문을 함께 제공합니다.</li>
      </ul>
      <h2>연락처</h2>
      <p>
        협업 제안이나 피드백은 <a href="mailto:contact@in-labs.example">contact@in-labs.example</a>로
        보내주세요. 기꺼이 답변드리겠습니다.
      </p>
    </section>
  );
}
