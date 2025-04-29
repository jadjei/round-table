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


# Resolving CORS Issues in Round Table

When working with the Round Table application, you might encounter CORS (Cross-Origin Resource Sharing) issues when connecting to external APIs like Blockfrost or Dandelion. This guide explains how to resolve these issues.

## Understanding the Problem

CORS errors like the following indicate that the browser is preventing your application from accessing a resource on another domain due to security restrictions:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://graphql-api.mainnet.dandelion.link/. (Reason: CORS request did not succeed). Status code: (null).
```

Or SSL-related errors:

```
POST https://graphql-api.mainnet.dandelion.link/ net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH
```

## Solutions

### Option 1: Use Blockfrost with Project ID (Recommended)

Blockfrost provides proper CORS headers, so it's the easiest solution:

1. Create an account at [Blockfrost.io](https://blockfrost.io)
2. Create a new project and get your Project ID
3. Copy `.env.local.example` to `.env.local`
4. Set these environment variables:
   ```
   NEXT_PUBLIC_USE_BLOCKFROST=true
   NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=your-project-id-here
   ```

### Option 2: Use the Built-in Proxy

The application includes a proxy API route to bypass CORS issues:

1. Make sure your server is running with the development environment
2. The application will automatically use the proxy for Blockfrost requests
3. For other APIs, modify the API calls to use `/api/proxy?target=YOUR_API_ENDPOINT`

### Option 3: Run a Local Reverse Proxy (Development)

If you prefer using non-Blockfrost APIs directly:

1. Install and run a CORS proxy like `local-cors-proxy`:
   ```bash
   npm install -g local-cors-proxy
   lcp --proxyUrl https://graphql-api.mainnet.dandelion.link
   ```
2. This will start a proxy at `http://localhost:8010/proxy`
3. Update your `.env.local`:
   ```
   NEXT_PUBLIC_USE_BLOCKFROST=false
   NEXT_PUBLIC_GRAPHQL=http://localhost:8010/proxy
   ```

### Option 4: Production Deployment with Proper CORS Configuration

For production, configure your web server (Nginx, Apache, etc.) to proxy requests:

#### Nginx Example:
```nginx
location /cardano-api/ {
    proxy_pass https://graphql-api.mainnet.dandelion.link/;
    proxy_set_header Host graphql-api.mainnet.dandelion.link;
    proxy_set_header Origin '';
    add_header Access-Control-Allow-Origin '*';
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin '*';
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        add_header Access-Control-Max-Age 1728000;
        add_header Content-Type 'text/plain charset=UTF-8';
        add_header Content-Length 0;
        return 204;
    }
}
```

## Troubleshooting SSL Issues

If you encounter `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`, it might be because:

1. Your Node.js version is outdated - update to the latest LTS version
2. There's a protocol mismatch - try using the built-in proxy
3. Network restrictions - try connecting through a different network

## Environment Variables Reference

See the `.env.local.example` file for all available environment variables to configure your API connections.

