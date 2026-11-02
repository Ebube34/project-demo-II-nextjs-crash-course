import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { getPostHogServer } = await import("./lib/posthog-server");
  const posthog = getPostHogServer();

  if (!posthog) {
    return;
  }

  const cookieHeader = request.headers.cookie;
  const cookie = Array.isArray(cookieHeader)
    ? cookieHeader.join("; ")
    : cookieHeader;
  const posthogCookie = cookie?.match(/ph_phc_.*?_posthog=([^;]+)/)?.[1];
  let distinctId: string | undefined;

  if (posthogCookie) {
    try {
      const posthogData: unknown = JSON.parse(
        decodeURIComponent(posthogCookie),
      );

      if (
        typeof posthogData === "object" &&
        posthogData !== null &&
        "distinct_id" in posthogData &&
        typeof posthogData.distinct_id === "string"
      ) {
        distinctId = posthogData.distinct_id;
      }
    } catch (parseError) {
      console.error("Could not parse PostHog cookie for server error tracking", parseError);
    }
  }

  await posthog.captureException(error, distinctId);
  await posthog.flush();
};
