import AdSlot from "@/components/AdSlot";
import VisitorSummary from "@/components/VisitorSummary";

export default function HomeRightSidebar() {
  return (
    <aside className="hidden lg:block space-y-6">
      <VisitorSummary />

      <AdSlot
        slotId="YOUR_SLOT_ID_SIDEBAR"
        minHeight={250}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </aside>
  );
}
