"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

type AdminDashboardMomProps = {
  onSignOut: () => void;
};

type MomObject = {
  key: string;
  size?: number;
  lastModified?: string;
  url?: string | null;
};

export default function AdminDashboardMom({
  onSignOut,
}: AdminDashboardMomProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [objects, setObjects] = useState<MomObject[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const refreshList = useCallback(async () => {
    setIsWorking(true);
    setStatus("파일 목록을 불러오는 중...");
    setError(null);
    try {
      const res = await fetch("/api/mom-s3");
      const data = (await res.json()) as {
        ok?: boolean;
        contents?: MomObject[];
        message?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? "목록 조회에 실패했습니다.");
      }
      setObjects(data.contents ?? []);
      setStatus("목록을 최신화했습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "목록 조회에 실패했습니다."
      );
      setStatus(null);
    } finally {
      setIsWorking(false);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setError("업로드할 파일을 선택하세요.");
      return;
    }
    setIsWorking(true);
    setStatus("업로드 중...");
    setError(null);
    try {
      const uploads = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/mom-s3", {
            method: "POST",
            body: formData,
          });
          const data = (await res.json()) as {
            ok?: boolean;
            key?: string;
            url?: string;
            message?: string;
          };
          if (!res.ok || !data.ok) {
            throw new Error(
              data.message ?? `업로드에 실패했습니다. (${file.name})`
            );
          }
          return data.key ?? file.name;
        })
      );
      setStatus(`업로드 완료: ${uploads.length}개 (${uploads.join(", ")})`);
      setSelectedFiles([]);
      await refreshList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
      setStatus(null);
    } finally {
      setIsWorking(false);
    }
  }, [refreshList, selectedFiles]);

  const handleDelete = useCallback(
    async (key: string) => {
      setIsWorking(true);
      setStatus("삭제 중...");
      setError(null);
      try {
        const res = await fetch("/api/mom-s3", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
        const data = (await res.json()) as { ok?: boolean; message?: string };
        if (!res.ok || !data.ok) {
          throw new Error(data.message ?? "삭제에 실패했습니다.");
        }
        setStatus(`삭제 완료: ${key}`);
        await refreshList();
      } catch (err) {
        setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
        setStatus(null);
      } finally {
        setIsWorking(false);
      }
    },
    [refreshList]
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">
            MOM 관리자 대시보드
          </h1>
          <p className="text-sm text-[var(--color-subtle)]">
            어무니 오셨어요? 필요한 작업을 선택하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm text-[var(--color-ink)] transition-colors hover:border-white/40"
        >
          다시 인증하기
        </button>
      </header>

      <div className="grid gap-4">
        <div className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">
              어무니 전용 파일 저장소
            </h2>
            <p className="text-sm text-[var(--color-ink)]">
              1. [파일 선택하기] 버튼을 클릭
            </p>
            <p className="text-sm text-[var(--color-ink)]">
              2. 원하시는 파일을 최대 10개까지 업로드(선택이 안된다면 압축해서
              .zip 형태로 만들어보세요)
            </p>
            <p className="text-sm text-[var(--color-ink)]">
              3. [파일 업로드] 버튼을 클릭해서 어무니 전용 저장소에 저장
            </p>
            <p className="text-sm text-[var(--color-ink)]">
              - 그 외에 &apos;삭제&apos;나 목록 확인은 충분히 버튼을 통해 하실 수 있고,
            </p>
            <p className="text-sm text-[var(--color-ink)]">
              - 핸드폰이나 컴퓨터에 있는 파일을 편하게 여기다가 백업하시면 돼요
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-xs text-[var(--color-subtle)]">
                파일 선택
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  id="mom-file-input"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length > 10) {
                      setError("최대 10개의 파일까지 선택할 수 있습니다.");
                      setSelectedFiles(files.slice(0, 10));
                      return;
                    }
                    setError(null);
                    setSelectedFiles(files);
                  }}
                  disabled={isWorking}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("mom-file-input")?.click()
                  }
                  disabled={isWorking}
                  className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)] transition hover:border-white/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  파일 선택하기
                </button>
                {selectedFiles.length > 0 && (
                  <span className="text-xs text-[var(--color-subtle)]">
                    {selectedFiles.length}개 선택됨
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isWorking || selectedFiles.length === 0}
              className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-4 py-2 text-[var(--color-ink)] transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              파일 업로드
            </button>
            <button
              type="button"
              onClick={refreshList}
              disabled={isWorking}
              className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-4 py-2 text-[var(--color-ink)] transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              목록 새로고침
            </button>
          </div>

          {status && (
            <p className="text-xs text-[var(--color-subtle)]">{status}</p>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}

          {objects.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[var(--color-ink)]">
                <thead>
                  <tr className="border-b border-[var(--color-border-strong)] text-xs uppercase tracking-wide text-[var(--color-subtle)]">
                    <th className="py-2 pr-4">Key</th>
                    <th className="py-2 pr-4">Size</th>
                    <th className="py-2 pr-4">Last Modified</th>
                    <th className="py-2 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {objects.map((obj) => (
                    <tr
                      key={obj.key}
                      className="border-b border-[var(--color-border)]"
                    >
                      <td className="py-2 pr-4">{obj.key}</td>
                      <td className="py-2 pr-4">
                        {obj.size ? `${obj.size} bytes` : "-"}
                      </td>
                      <td className="py-2 pr-4">{obj.lastModified ?? "-"}</td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {obj.url && (
                            <Link
                              href={obj.url}
                              target="_blank"
                              className="rounded border border-[var(--color-border-strong)] px-2 py-1 text-xs text-[var(--color-ink)] hover:border-white/40"
                            >
                              보기
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(obj.key)}
                            disabled={isWorking}
                            className="rounded border border-[var(--color-border-strong)] px-2 py-1 text-xs text-[var(--color-ink)] transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
