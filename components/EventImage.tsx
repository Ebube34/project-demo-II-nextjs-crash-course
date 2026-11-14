"use client";

import Image from "next/image";
import { getEventImageSrc } from "@/lib/event-image";

type Props = {
  image: string;
  alt?: string;
  width: number;
  height: number;
  className: string;
};

const fallbackImage = "/images/event1.png";

export default function EventImage({
  image,
  alt,
  width,
  height,
  className,
}: Props) {
  const altText = typeof alt === "string" && alt.trim() ? alt.trim() : "Event image";

  return (
    <Image
      src={getEventImageSrc(image)}
      alt={altText}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={(event) => {
        if (event.currentTarget.getAttribute("src") !== fallbackImage) {
          event.currentTarget.src = fallbackImage;
        }
      }}
    />
  );
}
