"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

const ExploreBtn = () => {
  const handleExploreEvents = () => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.capture("explore_events_clicked");
    }
  };

  return (
    <Link
      href="#events"
      id="explore-btn"
      className="mt-7 mx-auto no-underline"
      onClick={handleExploreEvents}
    >
      Explore Events
      <Image src="/icons/arrow-down.svg" alt="" width={24} height={24} />
    </Link>
  )
}

export default ExploreBtn;
