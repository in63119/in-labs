"use client";

import { FormEvent, useEffect, useState } from "react";
import YouTubeVideoCard from "@/components/YouTubeVideoCard";
import { useAdminAuth } from "@/providers/AdminAuthProvider";

export type YouTubeVideo = {
  id: string;
  title: string;
  keyPoints: string[];
};

type VideoForm = {
  videoId: string;
  title: string;
  keyPoints: string[];
};

const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: "I_MHJfm8l3Y",
    title: "진천조하 [보탑사,김유신탄생지,청산가든]",
    keyPoints: ["보탑사 3층 목탑!", "백반기행에 나왔던 진천 맛집!"],
  },
];

export default function YouTubeVideoManager() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(INITIAL_VIDEOS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<VideoForm>({
    videoId: "",
    title: "",
    keyPoints: [],
  });
  const [keyPointInput, setKeyPointInput] = useState("");
  const { isVerified } = useAdminAuth();

  useEffect(() => {
    if (!isVerified) {
      setIsModalOpen(false);
    }
  }, [isVerified]);

  const handleAddKeyPoint = () => {
    const trimmed = keyPointInput.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, trimmed],
    }));
    setKeyPointInput("");
  };

  const handleRemoveKeyPoint = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isVerified) {
      setErrorMessage("관리자 인증 후 게시할 수 있습니다.");
      return;
    }
    if (!form.videoId.trim() || !form.title.trim()) {
      setErrorMessage("영상 ID와 제목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: form.videoId.trim(),
          title: form.title.trim(),
          keyPoints: form.keyPoints,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message ?? "영상 등록에 실패했습니다.");
      }

      setVideos((prev) => [
        ...prev,
        {
          id: form.videoId.trim(),
          title: form.title.trim(),
          keyPoints: form.keyPoints,
        },
      ]);
      setForm({ videoId: "", title: "", keyPoints: [] });
      setKeyPointInput("");
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "영상 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 text-white">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">YouTube 채널</h1>
            <p className="text-[color:var(--color-subtle)]">
              요리 좋아하는 커플의 놀이터
            </p>
            <p className="text-[color:var(--color-subtle)]">
              음식이 약이 되게하고, 약이 음식이 되게하라
            </p>
          </div>
          {isVerified ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
            >
              게시
            </button>
          ) : null}
        </div>
      </header>

      <article className="grid gap-6 md:grid-cols-2">
        {videos.map((video) => (
          <YouTubeVideoCard
            key={`${video.id}-${video.title}`}
            videoId={video.id}
            title={video.title}
            keyPoints={video.keyPoints}
          />
        ))}
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">새 영상 게시</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-[color:var(--color-subtle)] hover:text-white"
              >
                닫기
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="space-y-1 text-sm">
                <span className="text-[color:var(--color-subtle)]">
                  영상 ID
                </span>
                <input
                  value={form.videoId}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      videoId: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-white outline-none"
                  placeholder="예: I_MHJfm8l3Y"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-[color:var(--color-subtle)]">제목</span>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-white outline-none"
                  placeholder="영상 제목"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-[color:var(--color-subtle)]">
                  핵심 포인트
                </span>
                <div className="flex gap-2">
                  <input
                    value={keyPointInput}
                    onChange={(event) => setKeyPointInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddKeyPoint();
                      }
                    }}
                    className="w-full rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-white outline-none"
                    placeholder="핵심 포인트를 입력하고 추가 버튼을 눌러주세요."
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyPoint}
                    className="whitespace-nowrap rounded-lg border border-[color:var(--color-border-strong)] bg-white/10 px-3 py-2 text-lg font-semibold text-white disabled:opacity-60"
                    disabled={!keyPointInput.trim()}
                  >
                    +
                  </button>
                </div>
                {form.keyPoints.length ? (
                  <div className="space-y-2 text-xs text-white">
                    {form.keyPoints.map((point, index) => (
                      <div className="flex gap-2" key={`${point}-${index}`}>
                        <input
                          value={point}
                          readOnly
                          disabled
                          className="w-full rounded-lg border border-dashed border-[color:var(--color-border-strong)]/70 bg-[color:var(--color-charcoal)]/70 px-3 py-2 text-white/70 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyPoint(index)}
                          className="whitespace-nowrap rounded-lg border border-[color:var(--color-border-strong)] bg-transparent px-3 py-2 text-lg font-semibold text-white transition hover:bg-white/10"
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </label>
              {errorMessage ? (
                <p className="text-xs text-red-400">{errorMessage}</p>
              ) : null}
              <div className="flex justify-end gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-sm text-[color:var(--color-subtle)]"
                  disabled={isSubmitting}
                >
                  취소
                </button>
                {isVerified ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg border border-[color:var(--color-border-strong)] bg-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "게시 중…" : "게시"}
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
