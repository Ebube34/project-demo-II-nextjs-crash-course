# PostHog error tracking

> ⚠️ **Needs your attention**
> - In your actual deployment provider, expose `POSTHOG_API_KEY` as a protected/masked build secret, and provide `POSTHOG_PROJECT_ID` and `NEXT_PUBLIC_POSTHOG_HOST` wherever `npm run build` runs.
> - Provide `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to the deployed application so browser and server PostHog initialization remains enabled.
> - Ensure production builds run from a Git checkout with `.git` available, or forward the provider's commit/repository/branch variables through any hidden container boundary so source maps can be associated with commits.
> - The repository does not reveal a deploy provider or deploy path, so configure these settings in the real provider rather than in this project.

## What you still need to do

1. In your deployment provider's settings, add `POSTHOG_API_KEY` as a protected/masked build secret. Add `POSTHOG_PROJECT_ID` with value `702816` and `NEXT_PUBLIC_POSTHOG_HOST` with value `https://us.i.posthog.com` to the build environment that runs `npm run build`. Also configure `NEXT_PUBLIC_POSTHOG_KEY` for the deployed application using the public PostHog project token already supplied for this project.
2. Make sure the production build runs from a Git checkout with commit metadata available. If the provider builds inside a container, forward its native repository, branch, and commit variables through the container as both build arguments and environment variables; pass `POSTHOG_API_KEY` only through the provider's secret mechanism.
3. Keep the production commands as `npm run build` followed by `npm run start`. The repository has no traceable CI or deployment configuration, so these settings must be applied in the actual deployment provider.

## What error tracking does now

Uncaught browser errors are captured by the existing PostHog browser setup in `instrumentation-client.ts`, and errors handled by Next.js's root error boundary are captured by `app/global-error.tsx`. On the server, `lib/posthog-server.ts` enables `posthog-node` exception autocapture for uncaught exceptions and unhandled rejections. Next.js request errors are captured through the `onRequestError` hook in `instrumentation.ts`, which flushes the shared client so short-lived invocations can deliver the error.

The project already had PostHog installed and initialized; this run added server exception autocapture and request-error flushing without changing the existing client initialization. The relevant runtime environment variables are loaded from `.env` by Next.js.

## Source maps

The existing `next.config.ts` configuration uses `withPostHogConfig` to upload production source maps when `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, and `NEXT_PUBLIC_POSTHOG_HOST` are available. No additional source-map or CI files were changed; the existing configuration is set up to upload. Every production build uploads once those variables are present where the build runs. The local `.env` now contains the required upload variables, while CI still needs them configured in the provider.

The exact production build command is:

```bash
npm run build
```

The build was verified successfully. Next.js compilation, TypeScript checking, and static generation passed. The PostHog uploader processed 65 source-map pairs, found 46 chunks, and reported 39 uploadable chunks already present in PostHog. It emitted non-fatal warnings for 19 pairs without chunk/debug IDs and one duplicate chunk ID. No release name was retained in the verification handoff.

## How to verify

Trigger an error in the deployed app, then open [PostHog Error Tracking](https://us.posthog.com/project/702816/error_tracking). Uploaded symbol sets are listed at [Error Tracking configuration](https://us.posthog.com/project/702816/error_tracking/configuration). The first verified symbol set is already present in PostHog; after the deployment provider is configured, verify subsequent production builds upload their source maps and show readable stack traces.
