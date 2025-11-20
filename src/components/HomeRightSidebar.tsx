import AdSlot from "@/components/AdSlot";
import VisitorSummary from "@/components/VisitorSummary";

export default function HomeRightSidebar() {
  return (
    <aside className="hidden flex-col gap-6 lg:flex">
      <VisitorSummary />

      <AdSlot
        minHeight={250}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </aside>
  );
}
