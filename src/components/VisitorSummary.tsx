type VisitorSummaryProps = {
  count?: number;
};

export default function VisitorSummary({ count = 0 }: VisitorSummaryProps) {
  return (
    <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
      <h3 className="font-semibold text-white">방문자</h3>
      <p className="mt-2 text-3xl font-bold text-white">{count}</p>
      <p className="text-xs text-[color:var(--color-subtle)]">
        아직 방문자 집계 기능이 준비 중입니다.
      </p>
    </section>
  );
}
