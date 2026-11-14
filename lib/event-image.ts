const fallbackImage = "/images/event1.png";

export function getEventImageSrc(image: unknown): string {
  const source = typeof image === "string" ? image.trim() : "";
  if (!source || /^https?:\/\/(?:www\.)?example\.com(?:\/|$)/i.test(source)) {
    return fallbackImage;
  }

  return source;
}
