import AdSlot from "@/components/AdSlot";
import VisitorSummary from "@/components/VisitorSummary";
import getConfig from "@/common/config/default.config";
import { configReady } from "@/server/bootstrap/init";

export default async function HomeRightSidebar() {
  await configReady;
  const kakaoAd = getConfig();
  const kakaoSideAdUnit = kakaoAd.kakaoAd?.side?.unit || "DAN-Dp8OfBpE3YizOWRo";

  return (
    <aside className="hidden flex-col gap-6 lg:flex">
      <VisitorSummary />

      <AdSlot
        unitId={kakaoSideAdUnit}
        width={160}
        height={600}
        minHeight={600}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </aside>
  );
}
