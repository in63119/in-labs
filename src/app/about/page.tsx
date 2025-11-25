import type { Metadata } from "next";
import { isAdSenseApproved } from "@/common/utils/labVisibility";

const SHOW_ALL_LABS = isAdSenseApproved();

export const metadata: Metadata = {
  title: "About | In Labs",
  description: SHOW_ALL_LABS
    ? "In Labs는 Dev · Tech · Food · Bible 네 가지 주제를 실험하며 기록하는 개인 아카이브입니다. 작성 원칙과 운영 방침을 소개합니다."
    : "In Labs는 Dev와 Tech 주제를 중심으로 실험과 기록을 남기는 개인 아카이브입니다. 작성 원칙과 운영 방침을 소개합니다.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const showAllLabs = SHOW_ALL_LABS;

  return (
    <section className="prose prose-invert max-w-3xl">
      <h1>About In Labs</h1>
      <p>
        In Labs는{" "}
        <strong>
          Dev · Tech{showAllLabs ? " · Food · Bible" : ""}
        </strong>{" "}
        {showAllLabs
          ? "네 가지 축을 따라 매주 작은 실험과 기록을 남기는 개인 프로젝트입니다."
          : "두 축을 중심으로 매주 작은 실험과 기록을 남기는 개인 프로젝트입니다."}{" "}
        반복적으로 부딪히는 문제를 정리하고, 일상에서 발견한 인사이트를 빠르게 검증하는
        것이 목표입니다.
      </p>
      <h2>작성 원칙</h2>
      <ul>
        <li>모든 글은 직접 조사·작성한 원본 콘텐츠를 지향합니다.</li>
        <li>실험 과정에서 실패하거나 놓친 부분도 솔직하게 기록합니다.</li>
        <li>
          재현 가능한 실습 코드와 개발 워크플로 템플릿을 우선 제공합니다.
          {showAllLabs ? " 레시피와 묵상 질문도 함께 정리합니다." : null}
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
      {showAllLabs ? (
        <>
          <p>
            <strong>Food Lab</strong>은 제철 재료와 간단한 레시피를 기록하며, 손질과 보관 팁을
            메모합니다.
          </p>
          <p>
            <strong>Bible Lab</strong>에서는 본문 속에서 발견한 한 문장을 붙잡고 일상 속 실천
            아이디어를 적어둡니다.
          </p>
        </>
      ) : null}
      <h2>연락처</h2>
      <p>
        협업 제안이나 피드백은{" "}
        <a href="mailto:in63119@gmail.com">in63119@gmail.com</a>로 보내주세요.
        기꺼이 답변드리겠습니다.
      </p>
    </section>
  );
}
