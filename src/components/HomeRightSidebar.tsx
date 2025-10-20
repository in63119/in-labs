import AdSlot from "@/components/AdSlot";

export default function HomeRightSidebar() {
  return (
    <aside className="hidden lg:block space-y-6">
      <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
        <h3 className="font-semibold text-white">구독</h3>
        <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
          이메일 구독 폼 또는 소개
        </p>
      </section>

      <AdSlot
        slotId="YOUR_SLOT_ID_SIDEBAR"
        minHeight={250}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </aside>
  );
}
