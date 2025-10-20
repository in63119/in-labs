export type PostCategory = "tech" | "food" | "bible";

export type PostSummary = {
  category: PostCategory;
  slug: string;
  title: string;
  summary: string;
  date: string;
  href: string;
  readingTime: string;
};

const formatHref = (category: PostCategory, slug: string) => {
  switch (category) {
    case "tech":
      return `/tech-lab/posts/${slug}`;
    case "food":
      return `/food-lab/posts/${slug}`;
    case "bible":
      return `/bible-lab/posts/${slug}`;
  }
};

export const techPosts: PostSummary[] = [
  {
    category: "tech",
    slug: "2025-03-ethers-gas-tips",
    title: "Ethers 기반 가스비 최적화 7가지 팁",
    summary:
      "프로바이더 구성, 배치 트랜잭션, 이벤트 파싱 최소화 등 현업에서 바로 쓰는 가스 절감 체크리스트.",
    date: "2025-03-03",
    href: formatHref("tech", "2025-03-ethers-gas-tips"),
    readingTime: "4 min read",
  },
  {
    category: "tech",
    slug: "2025-02-webauthn-passkey",
    title: "WebAuthn Passkey 온보딩 구조: 이메일 없이 가입",
    summary:
      "Next.js App Router + NestJS 예시로 패스키 가입 플로우와 UX/보안 체크리스트를 정리했습니다.",
    date: "2025-02-07",
    href: formatHref("tech", "2025-02-webauthn-passkey"),
    readingTime: "7 min read",
  },
  {
    category: "tech",
    slug: "2025-01-next13-routing",
    title: "Next.js App Router 빠른 정리: 폴더·레이아웃·서버 액션",
    summary:
      "App Router 핵심 파일 구조와 서버 액션 사용법을 5분 안에 훑는 실전 가이드.",
    date: "2025-01-20",
    href: formatHref("tech", "2025-01-next13-routing"),
    readingTime: "5 min read",
  },
];

export const foodPosts: PostSummary[] = [
  {
    category: "food",
    slug: "2025-02-van-cha",
    title: "뱅쇼 대신 ‘따뜻한 과일차’ : 레몬·사과 버전",
    summary:
      "와인을 쓰지 않고도 향긋한 계절 차를 즐길 수 있는 레시피. 재료 준비부터 우려내기 팁까지.",
    date: "2025-02-18",
    href: formatHref("food", "2025-02-van-cha"),
    readingTime: "3 min read",
  },
  {
    category: "food",
    slug: "2025-01-shinemuscat-pie",
    title: "샤인머스켓 파이: 상큼함 가득한 냉장 디저트",
    summary:
      "오븐 없이 만드는 상큼한 파이. 파이 시트, 요거트 크림, 포도 토핑만으로 완성됩니다.",
    date: "2025-01-12",
    href: formatHref("food", "2025-01-shinemuscat-pie"),
    readingTime: "2 min read",
  },
];

export const biblePosts: PostSummary[] = [
  {
    category: "bible",
    slug: "2025-02-matthew-5-beatitudes",
    title: "마태복음 5장 행복선언: 복의 방향",
    summary:
      "심령이 가난한 자에게 시작된 복이 오늘 우리의 삶을 어떻게 재정렬하는지 묵상합니다.",
    date: "2025-02-10",
    href: formatHref("bible", "2025-02-matthew-5-beatitudes"),
    readingTime: "3 min read",
  },
  {
    category: "bible",
    slug: "2025-01-psalm-1-meditation",
    title: "시편 1편 묵상: 흐르는 물가에 심은 나무",
    summary:
      "말씀 곁에 머무는 습관이 어떻게 하루를 살찌우는지, 짧은 묵상 포인트로 나누었습니다.",
    date: "2025-01-05",
    href: formatHref("bible", "2025-01-psalm-1-meditation"),
    readingTime: "2 min read",
  },
];

export const latestPosts: PostSummary[] = [
  ...techPosts,
  ...foodPosts,
  ...biblePosts,
]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6);
