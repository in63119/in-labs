import HomeLeftColumn from "@/components/HomeLeftColumn";
import HomeRightSidebar from "@/components/HomeRightSidebar";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
      <HomeLeftColumn />
      <HomeRightSidebar />
    </div>
  );
}
