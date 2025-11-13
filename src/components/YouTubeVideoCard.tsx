"use client";

type YouTubeVideoCardProps = {
  videoId: string;
  title: string;
  keyPoints?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
};

const YOUTUBE_EMBED_BASE = "https://www.youtube.com/embed";

export default function YouTubeVideoCard({
  videoId,
  title,
  keyPoints = [],
  onEdit,
  onDelete,
}: YouTubeVideoCardProps) {
  const src = `${YOUTUBE_EMBED_BASE}/${videoId}`;

  return (
    <div className="space-y-3 border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-5">
      <div className="aspect-video overflow-hidden bg-black">
        <iframe
          className="h-full w-full"
          src={src}
          title={title}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <h2 className="font-semibold text-white">{title}</h2>
      {keyPoints.length > 0 ? (
        <ul className="list-disc pl-5 text-sm text-[color:var(--color-subtle)]">
          {keyPoints.map((text, index) => (
            <li key={`${videoId}-highlight-${index}`} className="text-[color:var(--color-subtle)]">
              {text}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={!onEdit}
          className="rounded border border-[color:var(--color-border-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:border-white/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          수정
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!onDelete}
          className="rounded border border-[color:var(--color-border-strong)] px-3 py-1 text-xs font-semibold text-red-300 transition hover:border-red-300/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
