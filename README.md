# In Labs

In Labs is a content laboratory that publishes experiments across Tech, Food, Bible, and YouTube verticals. Posts are minted as Kaia NFTs, Authentication uses WebAuthn passkeys, and an admin panel keeps everything in sync.

## Features

- **Multi-lab publishing**: Tech, Food, Bible, YouTube sections share a unified feed on the home page.
- **Kaia blockchain storage**: Post metadata lives on the Kaia PostStorage contract; ABI artifacts are kept in-sync via `yarn sync-abi`.
- **Passkey authentication**: WebAuthn registration and verification flows write to the AuthStorage contract and cache challenges server-side.
- **Admin tools**: `/admin` provides passkey registration and management for internal users.
- **Device-aware UI**: A device info provider captures client device/OS details and surfaces them in the UI when needed.
- **Infra integrations**: AWS S3 for media, Google AdSense slots, and React Query for client-side data hydration.

## Tech Stack

- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Ethers.js 6](https://docs.ethers.io/)
- [@simplewebauthn](https://simplewebauthn.dev/)
- [@tanstack/react-query](https://tanstack.com/query)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)

## Prerequisites

- Node.js 20+
- Yarn (recommended) or npm / pnpm / bun
- Access to Kaia contract addresses & ABI files
- AWS IAM credentials with S3 permissions

## Getting Started

```bash
# install dependencies
yarn install

# run the local dev server
yarn dev

# lint / type-check
yarn lint

# build production assets
yarn build
```

Open `http://localhost:3000` to view the site. The app uses the Next.js App Router; primary pages live under `src/app`.

## Environment Variables

Create a `.env.local` file with the variables below. Safe defaults are shown where applicable.

```env
# runtime environment switch (local | prod). Defaults to local when unset.
ENV=local

# WebAuthn admin controls
NEXT_PUBLIC_ADMIN_CODE=<passkey admin email>
NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH=<bcrypt hash of admin code>
NEXT_PUBLIC_RELAYER_PRIVATE_KEY=<encrypted relayer key used by ethersClient>

# Advertising
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx

# AWS S3
AWS_S3_REGION=ap-northeast-2
AWS_S3_BUCKET=<bucket-name>
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
```

> **Note**: The Kaia contract ABIs live in `src/abis/kaia/test/{local,prod}`. Update them after contract deployments via `yarn sync-abi`.

## Updating ABI Artifacts

1. Adjust `scripts/sync-abi.ts` with the correct source endpoint(s) if needed.
2. Run `yarn sync-abi` to download the latest `AuthStorage` and `PostStorage` artifacts.
3. Commit the updated JSON along with any address changes surfaced in `src/lib/ethersClient.ts` or `src/abis/index.ts`.

## Project Structure (high level)

```
src/
  app/                # Next.js routes (App Router)
  components/         # Shared React components (Home feed, device notice, etc.)
  providers/          # React context providers (DeviceInfo, ReactQuery)
  lib/                # Client-side helpers (auth client, ethers client)
  server/             # Server-side modules (auth, posts, AWS S3, errors)
  abis/               # Kaia contract ABIs and addresses
```

## Deployment Notes

- Set `ENV=prod` and redeploy to target production contracts.
- Vercel environment variables must be updated before triggering a build.
- Ensure AWS credentials and AdSense client IDs are present in each Vercel environment (Preview/Production) as required.

## Contributing

1. Fork the repository and create a feature branch.
2. Keep commits focused; lint before pushing.
3. Open a PR describing the change, relevant contracts, and any migration steps.

## License

This repository is private and distributed for internal use only. Contact the project maintainer for licensing details or distribution approval.
