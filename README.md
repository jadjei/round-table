# Round Table

[![Node.js CI](https://github.com/ADAOcommunity/round-table/actions/workflows/node.js.yml/badge.svg)](https://github.com/ADAOcommunity/round-table/actions/workflows/node.js.yml)
[![Cypress Tests](https://github.com/ADAOcommunity/round-table/actions/workflows/cypress.yml/badge.svg)](https://github.com/ADAOcommunity/round-table/actions/workflows/cypress.yml)

Round Table is ADAO Community’s open-source wallet on Cardano blockchain. It aims at making multisig easy and intuitive for everyone. The project is designed and developed with decentralization in mind. All the libraries and tools were chosen in favor of decentralization. There is no server to keep your data. Your data is your own. It runs on your browser just like any other light wallets. You could also run it on your own PC easily.

Round Table supports multisig wallets as well as personal wallets. Besides its personal wallets, these wallets are supported to make multisig wallets.

We have an active and welcoming community. If you have any issues or questions, feel free to reach out to us via [Twitter](https://twitter.com/adaocommunity) of [Discord](https://discord.gg/BGuhdBXQFU)

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Environment Variable

* To use it on Cardano Preview Testnet, set `NEXT_PUBLIC_NETWORK=preview`. Leave it unset to use the Mainnet.
* To connect it to a GraphQL node, set `NEXT_PUBLIC_GRAPHQL` to the URI of the node.
* To sumbit transactions to relays, set `NEXT_PUBLIC_SUBMIT` to the URI of the node, split the URIs with `;`. **Beware that the server needs a reverse proxy to process CORS request.**
* To sync signatures automatically, set `NEXT_PUBLIC_GUN` to the URIs of the peers, split the URIs with `;`. We use [GUN](https://gun.eco) to sync.

## Testing

* To run Unit Tests, use `yarn test` command.
* To run UI/UX Tests, use `yarn cypress` command. Make sure your dev server `http://localhost:3000/` is on. Or use `yarn cypress:headless` to run it in headless mode.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Docker locally

In the project folder, run:

```sh
docker build -t round-table .
docker run -d -p 3000:3000 --name round-table round-table
```

Then visit http://localhost:3000/

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Deploying Round Table to Vercel: CORS Solutions

When deploying Round Table to Vercel, you might encounter CORS issues with the Cardano GraphQL APIs. This guide provides several solutions tailored for Vercel deployment.

## Solution 1: Use Blockfrost with API Routes (Recommended)

The simplest and most reliable solution is to use Blockfrost through Next.js API routes, which handle CORS automatically:

1. Create a Blockfrost account and get a project ID
2. Add your project ID to Vercel environment variables
3. Use the built-in `/api/blockfrost` route for all API calls

### Setting up Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   - **NEXT_PUBLIC_USE_BLOCKFROST**: `true`
   - **NEXT_PUBLIC_BLOCKFROST_PROJECT_ID**: `your-project-id`
   - **NEXT_PUBLIC_NETWORK**: `mainnet` (or `testnet`/`preview`)

### Using the Blockfrost API Route

The application includes a special API route that handles Blockfrost requests:

```javascript
// Example of using the API route in your code
const response = await fetch(`/api/blockfrost/graphql?network=mainnet`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: YOUR_GRAPHQL_QUERY,
    variables: YOUR_VARIABLES
  }),
});
```

## Solution 2: Use the Apollo Client with Custom Fetch

The application's Apollo Client is configured to work with Blockfrost by:

1. Detecting when Blockfrost is being used
2. Adding your project ID to all requests automatically
3. Handling CORS issues internally

No additional configuration is needed if you've set the environment variables correctly.

## Solution 3: Use the CORS Proxy API Route

For APIs other than Blockfrost, use the built-in CORS proxy:

```javascript
const encodedTarget = encodeURIComponent('https://graphql-api.mainnet.dandelion.link');
const response = await fetch(`/api/proxy?target=${encodedTarget}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: YOUR_GRAPHQL_QUERY,
    variables: YOUR_VARIABLES
  }),
});
```

## Solution 4: Configure Middleware (Advanced)

The application includes Next.js middleware that:
- Adds CORS headers to all API responses
- Handles preflight requests automatically
- Works with all Vercel regions

No additional configuration required - this works out of the box!

## Troubleshooting Vercel Deployments

If you encounter CORS issues despite using these solutions:

1. **Check Vercel Logs**: Go to your deployment → View Logs
2. **Verify Environment Variables**: Make sure they're correctly set in Vercel
3. **Try Different Regions**: Sometimes CORS issues can be region-specific
4. **Contact Blockfrost Support**: If issues persist with Blockfrost APIs

## For Local Development

When developing locally:

1. Create a `.env.local` file with the same environment variables
2. Run the development server with `npm run dev` or `yarn dev`
3. All CORS solutions will work the same way locally

## Further Resources

- [Vercel Serverless Functions Documentation](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Blockfrost API Documentation](https://docs.blockfrost.io/)

