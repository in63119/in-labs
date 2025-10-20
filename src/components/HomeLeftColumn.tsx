import HomeIntro from "@/components/HomeIntro";
import HomePostFeed from "@/components/HomePostFeed";

export default function HomeLeftColumn() {
  return (
    <div className="space-y-6">
      <HomeIntro />
      <HomePostFeed />
    </div>
  );
}
