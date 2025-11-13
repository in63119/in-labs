"use client";

import { FormEvent, useEffect, useState } from "react";
import YouTubeVideoCard from "@/components/YouTubeVideoCard";
import { useAdminAuth } from "@/providers/AdminAuthProvider";
import type { YouTubeVideo, VideoForm } from "@/common/types";
import {
  saveVideo,
  loadVideo,
  editVideo,
  deleteVideo,
} from "@/lib/youtubeClient";

export default function YouTubeVideoManager() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{
    type: "edit" | "delete";
    video: YouTubeVideo;
  } | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    keyPoints: string[];
  } | null>(null);
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

    const handleLoadVideo = async () => {
      const videos = await loadVideo();
      if (!videos || "message" in videos) {
        return;
      }

      setVideos(videos);
    };

    handleLoadVideo();
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
      const response = await saveVideo({
        videoId: form.videoId.trim(),
        title: form.title.trim(),
        keyPoints: form.keyPoints,
      });
      if (!response || "message" in response) {
        return;
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

  const handleOpenActionModal = (
    video: YouTubeVideo,
    type: "edit" | "delete"
  ) => {
    setActionModal({ video, type });
    if (type === "edit") {
      setEditForm({
        title: video.title,
        keyPoints: video.keyPoints.length ? [...video.keyPoints] : [""],
      });
    } else {
      setEditForm(null);
    }
  };

  const handleCloseActionModal = () => {
    setActionModal(null);
    setEditForm(null);
  };

  const handleEditKeyPointChange = (index: number, value: string) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const next = [...prev.keyPoints];
      next[index] = value;
      return { ...prev, keyPoints: next };
    });
  };

  const handleEditKeyPointRemove = (indexToRemove: number) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const next = prev.keyPoints.filter((_, index) => index !== indexToRemove);
      return { ...prev, keyPoints: next.length ? next : [""] };
    });
  };

  const handleEditKeyPointAdd = () => {
    setEditForm((prev) => {
      if (!prev) return prev;
      return { ...prev, keyPoints: [...prev.keyPoints, ""] };
    });
  };

  const handleEditSubmit = async () => {
    if (!editForm) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await editVideo({
        videoId: actionModal!.video.id,
        title: editForm.title,
        keyPoints: editForm.keyPoints,
      });
      if (!response || "message" in response) {
        return;
      }

      setVideos((prev) =>
        prev.map((video) =>
          video.id === actionModal!.video.id
            ? { ...video, title: editForm.title, keyPoints: editForm.keyPoints }
            : video
        )
      );
      handleCloseActionModal();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "영상 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await deleteVideo(actionModal!.video.id);
      if (!response || "message" in response) {
        return;
      }

      setVideos((prev) =>
        prev.filter((video) => video.id !== actionModal!.video.id)
      );

      handleCloseActionModal();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "영상 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditingInProgress = isSubmitting && actionModal?.type === "edit";
  const isDeletingInProgress = isSubmitting && actionModal?.type === "delete";

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
            onEdit={() => handleOpenActionModal(video, "edit")}
            onDelete={() => handleOpenActionModal(video, "delete")}
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
      {actionModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm space-y-4 rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-6 text-white">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {actionModal.type === "edit" ? "영상 수정" : "영상 삭제"}
              </h3>
              <p className="text-sm text-[color:var(--color-subtle)]">
                {actionModal.video.title}
              </p>
            </div>
            {actionModal.type === "edit" ? (
              <div className="space-y-3">
                <label className="space-y-1 text-sm">
                  <span className="text-[color:var(--color-subtle)]">
                    영상 ID
                  </span>
                  <input
                    value={actionModal.video.id}
                    disabled
                    className="w-full rounded-lg border border-dashed border-[color:var(--color-border-strong)]/70 bg-[color:var(--color-charcoal)]/40 px-3 py-2 text-white/60 outline-none"
                  />
                </label>
                <label className="space-y-1 text-sm mt-3">
                  <span className="text-[color:var(--color-subtle)]">제목</span>
                  <input
                    value={actionModal.video.title}
                    readOnly
                    className="w-full rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-white outline-none"
                  />
                </label>
                {editForm ? (
                  <div className="space-y-2 text-sm mt-3">
                    <span className="text-[color:var(--color-subtle)]">
                      핵심 포인트
                    </span>
                    <div className="space-y-2">
                      {editForm.keyPoints.map((point, index) => (
                        <div
                          key={`${actionModal.video.id}-modal-point-${index}`}
                          className="flex items-center gap-2"
                        >
                          <input
                            value={point}
                            onChange={(event) =>
                              handleEditKeyPointChange(
                                index,
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-2 text-white outline-none"
                            placeholder="핵심 포인트를 입력하세요."
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditKeyPointRemove(index)}
                              className="rounded-lg border border-[color:var(--color-border-strong)] px-3 py-2 text-lg font-semibold text-white"
                            >
                              -
                            </button>
                            {index === editForm.keyPoints.length - 1 ? (
                              <button
                                type="button"
                                onClick={handleEditKeyPointAdd}
                                className="rounded-lg border border-[color:var(--color-border-strong)] px-3 py-2 text-lg font-semibold text-white"
                              >
                                +
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-[color:var(--color-subtle)]">
                영상을 삭제합니다.
              </p>
            )}
            <div className="flex flex-wrap items-center justify-end gap-2">
              {actionModal.type === "edit" && isEditingInProgress ? (
                <span className="text-xs text-[color:var(--color-subtle)]">
                  수정 진행 중…
                </span>
              ) : null}
              {actionModal.type === "delete" && isDeletingInProgress ? (
                <span className="text-xs text-[color:var(--color-subtle)]">
                  삭제 진행 중…
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleCloseActionModal}
                disabled={isEditingInProgress || isDeletingInProgress}
                className="rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-sm text-[color:var(--color-subtle)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                닫기
              </button>
              {actionModal.type === "edit" ? (
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={isEditingInProgress}
                  className="rounded-lg border border-[color:var(--color-border-strong)] bg-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditingInProgress ? "수정 중…" : "수정"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={isDeletingInProgress}
                  className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 hover:border-red-400 hover:text-red-100 disabled:cursor-not-allowed disabled:border-red-500/30 disabled:bg-red-500/5 disabled:text-red-200/60"
                >
                  {isDeletingInProgress ? "삭제 중…" : "삭제"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
