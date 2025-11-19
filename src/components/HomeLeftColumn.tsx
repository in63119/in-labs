import { Suspense } from "react";
import HomeIntro from "@/components/HomeIntro";
import HomePostFeed from "@/components/HomePostFeed";
import HomePostFeedSkeleton from "@/components/HomePostFeedSkeleton";

export default function HomeLeftColumn() {
  return (
    <div className="space-y-6">
      <HomeIntro />
      <Suspense fallback={<HomePostFeedSkeleton />}>
        <HomePostFeed />
      </Suspense>
    </div>
  );
}
