import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | In Labs",
  description:
    "In Labs는 Dev · Tech · Guides 세 가지 주제를 실험하며 기록하는 개인 아카이브입니다. 작성 원칙과 운영 방침을 소개합니다.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>About In Labs</h1>
      <p>
        In Labs는{" "}
        <strong>
          Dev · Tech · Guides
        </strong>{" "}
        세 가지 축을 따라 매주 작은 실험과 기록을 남기는 개인 프로젝트입니다. 반복적으로 부딪히는
        문제를 정리하고, 일상에서 발견한 인사이트를 빠르게 검증하는 것이 목표입니다.
      </p>
      <h2>작성 원칙</h2>
      <ul>
        <li>모든 글은 직접 조사·작성한 원본 콘텐츠를 지향합니다.</li>
        <li>실험 과정에서 실패하거나 놓친 부분도 솔직하게 기록합니다.</li>
        <li>
          재현 가능한 실습 코드와 개발 워크플로 템플릿을 우선 제공합니다. 필요한 설정과 체크리스트를
          함께 제공합니다.
        </li>
      </ul>
      <h2>랩 소개</h2>
      <p>
        <strong>Dev Lab</strong>에서는 배포 자동화, 개발 생산성 실험, 기록 습관을 다룹니다. 한
        번 해본 워크플로를 반복 가능한 루틴으로 바꾸는 과정을 공유합니다. 이 블로그를 만들며
        남기는 설계, 배포, 운영 기록도 이곳에 정리합니다.
      </p>
      <p>
        <strong>Tech Lab</strong>에서는 문제를 정의하고 해결한 과정을 코드와 함께 남깁니다.
        실무에서 바로 검증해 본 구현 방식을 정리합니다.
      </p>
      <p>
        <strong>Guides</strong>에서는 프로덕트, 운영, 도구, 생활 팁 등 다양한 주제의 가이드를
        단계별로 정리합니다. 바로 적용할 수 있는 체크리스트와 요약 노트를 제공합니다.
      </p>
      <h2>연락처</h2>
      <p>
        협업 제안이나 피드백은{" "}
        <a href="mailto:in63119@gmail.com">in63119@gmail.com</a>로 보내주세요.
        기꺼이 답변드리겠습니다.
      </p>
    </section>
  );
}
