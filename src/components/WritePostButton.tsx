"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

type WritePostButtonProps = {
  labName: string;
};

const templates: Record<string, { title: string; body: string }> = {
  회의록: {
    title: "회의록 제목",
    body: `## 참석자
- 이름을 입력하세요

## 주요 논의
- 항목을 정리하세요

## TODO
- [ ] 할 일을 기록하세요`,
  },
  이메일: {
    title: "이메일 제목",
    body: `안녕하세요,

내용을 여기에 작성하세요.

감사합니다.`,
  },
  체크리스트: {
    title: "체크리스트",
    body: `- [ ] 해야 할 일
- [ ] 진행 중인 일
- [ ] 완료된 일`,
  },
};

const structuredDataOptions = [
  { value: "None", label: "지정 안 함" },
  { value: "Article", label: "Article" },
  { value: "BlogPosting", label: "BlogPosting" },
  { value: "HowTo", label: "HowTo" },
  { value: "FAQPage", label: "FAQ" },
];

export default function WritePostButton({ labName }: WritePostButtonProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [structuredData, setStructuredData] = useState("Article");
  const [relatedLinks, setRelatedLinks] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [searchPreviewFocus, setSearchPreviewFocus] = useState<
    "desktop" | "mobile" | "social"
  >("desktop");

  const activeTemplateKeys = useMemo(() => Object.keys(templates), []);

  useEffect(() => {
    if (!slugManuallyEdited && title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [title, slugManuallyEdited]);

  const closeModal = () => {
    setOpen(false);
    setActiveTab("edit");
  };

  const applyTemplate = (key: string) => {
    const template = templates[key];
    if (!template) return;
    setTitle(template.title);
    setContent(template.body);
  };

  const tagList = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags]
  );

  const desktopTitle = (title || `${labName} 글 제목`).slice(0, 62);
  const mobileTitle = (title || `${labName} 글 제목`).slice(0, 78);
  const desktopDescription = (
    metaDescription ||
    summary ||
    "요약을 입력하면 검색 결과에 노출되는 문구를 확인할 수 있습니다."
  ).slice(0, 160);
  const mobileDescription = (
    metaDescription ||
    summary ||
    "요약을 입력하면 검색 결과에 노출되는 문구를 확인할 수 있습니다."
  ).slice(0, 120);
  const socialDescription = (
    summary ||
    metaDescription ||
    "SNS 공유용 카드 문구를 작성하세요."
  ).slice(0, 90);

  const structuredDataHint = useMemo(() => {
    switch (structuredData) {
      case "HowTo":
        return "HowTo는 단계(step)와 예상 시간, 준비물을 포함하면 리치 결과로 노출될 확률이 높아요.";
      case "FAQPage":
        return "FAQ는 질문과 답변 쌍을 마크다운에서 ## Q / A 형태로 정리하면 변환하기 좋습니다.";
      case "BlogPosting":
        return "BlogPosting은 일반 기사보다 저자/발행일 같은 정보가 강조됩니다.";
      default:
        return "콘텐츠 성격에 맞는 schema.org 타입을 선택하면 검색 엔진 이해도가 향상됩니다.";
    }
  }, [structuredData]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] transition hover:border-white/40"
      >
        글쓰기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="write-post-heading"
        >
          <div className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[color:var(--color-border-strong)] px-6 py-4">
              <div>
                <h2
                  id="write-post-heading"
                  className="text-lg font-semibold text-white"
                >
                  {labName} 글쓰기
                </h2>
                <p className="text-xs text-[color:var(--color-subtle)]">
                  제목·슬러그·메타 정보를 입력하고 마크다운으로 본문을
                  작성하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-[color:var(--color-border-strong)] px-3 py-1 text-sm text-[color:var(--color-subtle)] transition hover:border-white/40 hover:text-white"
                aria-label="모달 닫기"
              >
                닫기
              </button>
            </header>

            <div className="flex flex-wrap gap-2 border-b border-[color:var(--color-border-strong)] px-6 py-3">
              {activeTemplateKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyTemplate(key)}
                  className="rounded-full border border-[color:var(--color-border-muted)] bg-[color:var(--color-charcoal)] px-3 py-1 text-xs text-[color:var(--color-ink)] transition hover:border-white/30"
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`rounded-lg px-3 py-1 ${
                        activeTab === "edit"
                          ? "bg-[color:var(--color-charcoal)] text-white"
                          : "text-[color:var(--color-subtle)]"
                      }`}
                    >
                      편집
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`rounded-lg px-3 py-1 ${
                        activeTab === "preview"
                          ? "bg-[color:var(--color-charcoal)] text-white"
                          : "text-[color:var(--color-subtle)]"
                      }`}
                    >
                      미리보기
                    </button>
                  </div>

                  {activeTab === "edit" ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                          제목
                        </label>
                        <input
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                          placeholder="제목을 입력하세요"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-between text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                          <span>슬러그</span>
                          <span>{slug.length}자</span>
                        </label>
                        <input
                          value={slug}
                          onChange={(event) => {
                            setSlug(event.target.value);
                            setSlugManuallyEdited(true);
                          }}
                          className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                          placeholder="예: my-new-post"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-between text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                          <span>메타 설명</span>
                          <span>{metaDescription.length}/160자</span>
                        </label>
                        <textarea
                          value={metaDescription}
                          onChange={(event) =>
                            setMetaDescription(event.target.value)
                          }
                          rows={3}
                          className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                          placeholder="검색 결과에 노출될 설명을 120~160자로 작성하세요."
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-between text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                          <span>요약</span>
                          <span>{summary.length}/200자</span>
                        </label>
                        <textarea
                          value={summary}
                          onChange={(event) => setSummary(event.target.value)}
                          rows={2}
                          className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                          placeholder="리스트·SNS 카드에서 사용할 짧은 요약을 입력하세요."
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                            태그 (쉼표로 구분)
                          </label>
                          <input
                            value={tags}
                            onChange={(event) => setTags(event.target.value)}
                            className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                            placeholder="예: nextjs, webauthn, tutorial"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                            OG 이미지 URL
                          </label>
                          <input
                            value={ogImageUrl}
                            onChange={(event) =>
                              setOgImageUrl(event.target.value)
                            }
                            className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                            구조화 데이터 타입
                          </label>
                          <select
                            value={structuredData}
                            onChange={(event) =>
                              setStructuredData(event.target.value)
                            }
                            className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                          >
                            {structuredDataOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <p className="text-[10px] text-[color:var(--color-subtle)]">
                            {structuredDataHint}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                            관련 링크 (내부/외부)
                          </label>
                          <textarea
                            value={relatedLinks}
                            onChange={(event) =>
                              setRelatedLinks(event.target.value)
                            }
                            rows={3}
                            className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm text-white outline-none focus:border-white/60"
                            placeholder="- https://inlabs.kr/tech-lab/...\n- 관련 문서 URL을 줄바꿈으로 구분하세요."
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                          내용 (Markdown 지원)
                        </label>
                        <textarea
                          value={content}
                          onChange={(event) => setContent(event.target.value)}
                          rows={12}
                          className="w-full rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-sm leading-6 text-white outline-none focus:border-white/60"
                          placeholder={`예: ## ${labName} 노트\n- 마크다운 목록을 작성해보세요.`}
                        />
                        <div className="text-right text-[10px] text-[color:var(--color-subtle)]">
                          {content.trim().split(/\s+/).filter(Boolean).length}{" "}
                          단어
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <h1>{title || "제목이 여기에 표시됩니다"}</h1>
                      <ReactMarkdown>
                        {content || "내용을 입력하면 미리보기가 표시됩니다."}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                <aside className="space-y-4 rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-4 py-4 text-xs text-[color:var(--color-subtle)]">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white">
                      검색 결과 / 공유 미리보기
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSearchPreviewFocus("desktop")}
                        className={`rounded-full px-3 py-1 ${
                          searchPreviewFocus === "desktop"
                            ? "bg-[color:var(--color-accent)] text-black"
                            : "border border-[color:var(--color-border-strong)] text-[color:var(--color-subtle)]"
                        }`}
                      >
                        데스크톱
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchPreviewFocus("mobile")}
                        className={`rounded-full px-3 py-1 ${
                          searchPreviewFocus === "mobile"
                            ? "bg-[color:var(--color-accent)] text-black"
                            : "border border-[color:var(--color-border-strong)] text-[color:var(--color-subtle)]"
                        }`}
                      >
                        모바일
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchPreviewFocus("social")}
                        className={`rounded-full px-3 py-1 ${
                          searchPreviewFocus === "social"
                            ? "bg-[color:var(--color-accent)] text-black"
                            : "border border-[color:var(--color-border-strong)] text-[color:var(--color-subtle)]"
                        }`}
                      >
                        SNS 카드
                      </button>
                    </div>
                    {searchPreviewFocus !== "social" ? (
                      <div
                        className={`rounded-lg border border-[color:var(--color-border-muted)] bg-black/40 p-3 ${
                          searchPreviewFocus === "mobile"
                            ? "text-[11px]"
                            : "text-xs"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-[color:var(--color-subtle)]">
                          <span className="flex h-3 w-3 items-center justify-center rounded-sm bg-[color:var(--color-accent)] text-[8px] font-bold text-black">
                            in
                          </span>
                          <span>
                            https://in-labs.kr/{labName.replace(/\s+/g, "-")}/
                            {slug || "slug"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-[color:var(--color-accent)]">
                          {searchPreviewFocus === "desktop"
                            ? desktopTitle
                            : mobileTitle}
                        </p>
                        <p className="mt-1 leading-5 text-[color:var(--color-subtle)]">
                          {searchPreviewFocus === "desktop"
                            ? desktopDescription
                            : mobileDescription}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="rounded-lg border border-[color:var(--color-border-muted)] bg-black/40 p-3">
                          <div className="aspect-video w-full rounded-lg bg-[color:var(--color-charcoal-plus)]">
                            {ogImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={ogImageUrl}
                                alt="OG 미리보기"
                                className="h-full w-full rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[color:var(--color-subtle)]">
                                OG 이미지가 지정되면 미리보기로 표시됩니다.
                              </div>
                            )}
                          </div>
                          <div className="mt-3 space-y-1">
                            <p className="text-[10px] uppercase tracking-wide text-[color:var(--color-subtle)]">
                              in-labs.kr
                            </p>
                            <p className="text-sm font-semibold text-white">
                              {title || `${labName} 글 제목`}
                            </p>
                            <p className="text-xs text-[color:var(--color-subtle)]">
                              {socialDescription}
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] text-[color:var(--color-subtle)]">
                          공유 플랫폼마다 카드 크기와 자르기 규칙이 다릅니다.
                          1200×630px 이미지를 권장합니다.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white">
                      SEO 점검
                    </h3>
                    <ul className="space-y-1">
                      <li
                        className={
                          title.length >= 30 && title.length <= 65
                            ? "text-green-300"
                            : ""
                        }
                      >
                        · 제목 길이 {title.length}자 (30~65자 권장)
                      </li>
                      <li
                        className={
                          metaDescription.length >= 120 &&
                          metaDescription.length <= 160
                            ? "text-green-300"
                            : ""
                        }
                      >
                        · 메타 설명 {metaDescription.length}자 (120~160자 권장)
                      </li>
                      <li className={slug ? "text-green-300" : ""}>
                        · 의미 있는 슬러그
                      </li>
                      <li
                        className={tagList.length > 0 ? "text-green-300" : ""}
                      >
                        · 태그 {tagList.length}개
                      </li>
                      <li className={ogImageUrl ? "text-green-300" : ""}>
                        · OG 이미지 지정
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white">태그</h3>
                    {tagList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tagList.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[color:var(--color-border-muted)] px-2 py-1 text-[10px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px]">
                        키워드를 쉼표로 구분해서 입력하면 콘텐츠 분류와 내부
                        링크에 활용할 수 있습니다.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white">
                      관련 링크
                    </h3>
                    {relatedLinks ? (
                      <ul className="space-y-1">
                        {relatedLinks
                          .split("\n")
                          .map((link) => link.trim())
                          .filter(Boolean)
                          .map((link) => (
                            <li
                              key={link}
                              className="truncate text-[color:var(--color-subtle)]"
                            >
                              {link}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-[10px]">
                        다른 글과 연결하면 체류 시간이 늘어나고 검색 봇이 사이트
                        구조를 이해하기 쉬워요.
                      </p>
                    )}
                  </div>
                </aside>
              </div>
            </div>

            <footer className="flex items-center justify-between border-t border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-6 py-3">
              <span className="text-xs text-[color:var(--color-subtle)]">
                작성한 내용은 아직 저장되지 않습니다. 완료 후 관리자 페이지에서
                게시하세요.
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setSlug("");
                    setSlugManuallyEdited(false);
                    setMetaDescription("");
                    setSummary("");
                    setTags("");
                    setOgImageUrl("");
                    setStructuredData("Article");
                    setRelatedLinks("");
                    setContent("");
                  }}
                  className="rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-xs text-[color:var(--color-subtle)] transition hover:border-white/40 hover:text-white"
                >
                  초기화
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const payload = {
                      labName,
                      title,
                      slug,
                      metaDescription,
                      summary,
                      tags: tagList,
                      ogImageUrl,
                      structuredData,
                      relatedLinks: relatedLinks
                        .split("\n")
                        .map((link) => link.trim())
                        .filter(Boolean),
                      content,
                    };
                    console.log("Draft payload:", payload);
                    closeModal();
                  }}
                  className="rounded-lg bg-[color:var(--color-accent)] px-4 py-2 text-xs font-semibold text-black transition hover:opacity-90"
                >
                  임시 저장
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
