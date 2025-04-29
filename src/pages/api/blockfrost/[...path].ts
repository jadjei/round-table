// src/pages/api/blockfrost/[...path].ts
import type { NextApiRequest, NextApiResponse } from 'next'

const BLOCKFROST_URLS = {
  mainnet: 'https://cardano-mainnet.blockfrost.io',
  testnet: 'https://cardano-testnet.blockfrost.io',
  preview: 'https://cardano-preview.blockfrost.io'
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get network parameter (default to mainnet)
    const network = (req.query.network as string) || 'mainnet';
    
    // Make sure it's a valid network
    if (!Object.keys(BLOCKFROST_URLS).includes(network)) {
      return res.status(400).json({ error: 'Invalid network specified' });
    }
    
    // Get the Blockfrost base URL
    const baseUrl = BLOCKFROST_URLS[network as keyof typeof BLOCKFROST_URLS];
    
    // Get the project ID from env vars
    const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
    if (!projectId) {
      return res.status(500).json({ error: 'Blockfrost Project ID not configured' });
    }

    // Get the path (the part after /api/blockfrost/...)
    const path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || '';
    
    // Build the full URL to fetch
    const url = `${baseUrl}/api/v0/${path}`;

    // Make the request to Blockfrost
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'project_id': projectId,
        'Content-Type': 'application/json',
      },
      ...(req.body && { body: JSON.stringify(req.body) }),
    });

    // Get the response data
    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Return the Blockfrost response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Blockfrost API error:', error);
    return res.status(500).json({ error: String(error) });
  }
}
