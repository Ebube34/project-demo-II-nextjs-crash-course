This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## PostHog error tracking

The client SDK captures browser exceptions, and the Next.js instrumentation hook captures server request errors. Production builds upload source maps and associate them with a release when `POSTHOG_API_KEY` and `POSTHOG_PROJECT_ID` are configured. Source maps are removed after upload.

Set the following variables in `.env` for local development and in your deployment provider for production:

- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog project API key.
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host for your project.
- `POSTHOG_API_KEY`: Personal API key with Error Tracking write access; keep this secret.
- `POSTHOG_PROJECT_ID`: PostHog project ID used for source-map uploads.

Source-map uploading is skipped when either server-only upload variable is missing. Build from a Git checkout so PostHog can associate the uploaded maps with the deployment's commit.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
