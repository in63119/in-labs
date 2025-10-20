import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import { techPosts } from "@/lib/postData";

type PageProps = {
  params: { slug: string };
};

const POST_OUTLINES: Record<
  string,
  {
    lead: string;
    sections: Array<{ heading: string; body: string }>;
    takeaway: string;
  }
> = {
  "2025-03-ethers-gas-tips": {
    lead:
      "Ethers.js로 온체인 작업을 하다 보면 사소한 설정 차이만으로도 불필요한 가스비가 빠르게 누적됩니다. 최근 프로젝트에서 정리한 최적화 팁을 공유합니다.",
    sections: [
      {
        heading: "1. JSON-RPC 배치 요청으로 왕복 시간 줄이기",
        body: "대량의 상태를 조회할 때 `provider.sendBatch()`를 사용하면 개별 호출마다 생기는 네트워크 왕복 비용을 절약할 수 있습니다. 특히 다수의 `callStatic`을 수행할 때 효과가 큽니다.",
      },
      {
        heading: "2. 이벤트 파싱은 필요한 토픽만",
        body: "필터에 `topics`를 지정해 반드시 필요한 이벤트만 구독하세요. 광범위한 필터는 파싱 비용을 늘릴 뿐 아니라, 로그 저장 비용까지 높입니다.",
      },
      {
        heading: "3. Constant 함수는 callStatic으로 확인",
        body: "`populateTransaction` 대신 `callStatic`을 사용하면 실제 가스를 쓰지 않고도 예상 결과와 revert 이유를 미리 확인할 수 있어 디버깅 시간을 줄입니다.",
      },
    ],
    takeaway:
      "네트워크 비용은 작은 습관에서 절감됩니다. 배치 요청, 필터링, 시뮬레이션을 기본 전략으로 삼아보세요.",
  },
  "2025-02-webauthn-passkey": {
    lead:
      "이메일 없이 가입하는 패스키 온보딩을 구현하며 얻은 경험을 정리했습니다. 전체 플로우와 각 단계에서 확인해야 할 UX/보안 포인트를 함께 기록했습니다.",
    sections: [
      {
        heading: "1. 등록 요청: RP 정보와 Challenge 설계",
        body: "RP ID는 도메인을 기준으로 고정해야 하며, `challenge`는 매 요청마다 새롭게 생성해 서버에 저장합니다. 만료 시간도 함께 관리하면 재사용 공격을 막을 수 있습니다.",
      },
      {
        heading: "2. navigator.credentials.create() UX 체크",
        body: "등록 시점에 기기 보안 수단(생체/핀)을 안내하고, 브라우저 UI가 뜨는 동안 진행 상태를 보여주세요. 실패 시 재시도 버튼과 문제 해결 링크를 함께 제공하는 것이 좋습니다.",
      },
      {
        heading: "3. 서버 검증과 Credential 저장 구조",
        body: "`@simplewebauthn/server`로 서명을 검증한 뒤에는 `credentialID`, `publicKey`, `counter`를 안전하게 저장합니다. 사용자 계정마다 여러 크리덴셜을 허용하려면 배열 형태로 관리하세요.",
      },
    ],
    takeaway:
      "패스키는 보안을 강화하면서도 전환율을 높일 수 있는 옵션입니다. 다만 UX 세부 요소를 꼼꼼히 설계해야 이용자가 당황하지 않습니다.",
  },
  "2025-01-next13-routing": {
    lead:
      "App Router를 처음 접할 때 헷갈렸던 폴더 구조와 서버 컴포넌트 개념을 5분 안에 정리해봤습니다. 프로젝트 구조를 잡거나 기존 앱을 마이그레이션할 때 참고해 보세요.",
    sections: [
      {
        heading: "1. 폴더 단위로 레이아웃과 페이지 구성",
        body: "`layout.tsx`는 하위 모든 경로에 공통 UI를 제공하고, `page.tsx`가 실제 라우트 엔드포인트가 됩니다. 필요한 경우 `loading.tsx`, `error.tsx`로 UX를 세분화할 수 있습니다.",
      },
      {
        heading: "2. 서버 컴포넌트 기본기",
        body: "기본적으로 App Router의 컴포넌트는 서버에서 렌더링됩니다. 클라이언트 상태가 필요할 때만 `\"use client\"` 지시어를 붙여 번들에 포함시키세요. 서버에서 데이터를 fetch한 뒤 바로 JSX에 사용할 수 있어 편합니다.",
      },
      {
        heading: "3. 서버 액션으로 폼 처리 단순화",
        body: "`\"use server\"` 함수로 폼과 API 라우트를 통합할 수 있습니다. 실행 시점에 자동으로 CSRF가 보호되고, revalidate 로직도 함께 다룰 수 있어 폼 처리 코드가 크게 줄어듭니다.",
      },
    ],
    takeaway:
      "App Router는 폴더 구조만 익숙해지면 유지보수성이 크게 올라갑니다. 작은 프로젝트라도 레이아웃을 적극적으로 나눠보세요.",
  },
};

export function generateStaticParams() {
  return techPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = techPosts.find((item) => item.slug === params.slug);
  if (!post) {
    return {};
  }
  return {
    title: `${post.title} | Tech Lab`,
    description: post.summary,
    alternates: {
      canonical: post.href,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: post.href,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export default function TechPostPage({ params }: PageProps) {
  const post = techPosts.find((item) => item.slug === params.slug);
  if (!post) {
    notFound();
  }
  const outline = POST_OUTLINES[post.slug];

  const relatedPosts = techPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-[720px] space-y-8 text-white">
      <header className="space-y-3">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
          <span>Tech Lab</span>
          <span aria-hidden="true">•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true">•</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-3xl font-bold text-white">{post.title}</h1>
        <p className="text-sm leading-6 text-[color:var(--color-subtle)]">
          {outline?.lead ?? post.summary}
        </p>
      </header>

      {(outline?.sections ?? []).map((section) => (
        <section key={section.heading} className="space-y-3 text-[color:var(--color-subtle)]">
          <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
          <p className="leading-7">{section.body}</p>
        </section>
      ))}

      <AdSlot
        slotId="YOUR_SLOT_ID_INARTICLE_1"
        minHeight={320}
        className="my-6 border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      <section className="space-y-3 text-[color:var(--color-subtle)]">
        <h2 className="text-xl font-semibold text-white">요약</h2>
        <p className="leading-7">
          {outline?.takeaway ??
            "핵심 실천 항목을 확인하며 프로젝트에 적용해 보세요. 실제 환경에서의 경험을 댓글로 공유해 주셔도 좋습니다."}
        </p>
      </section>

      <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
        <h2 className="text-lg font-semibold text-white">다음으로 읽어볼 글</h2>
        <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-subtle)]">
          {relatedPosts.map((related) => (
            <li key={related.slug}>
              <Link href={related.href} className="transition-colors hover:text-[color:var(--color-accent)]">
                {related.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot
        slotId="YOUR_SLOT_ID_BOTTOM"
        minHeight={250}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </article>
  );
}
