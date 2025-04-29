// src/pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const target = req.query.target as string
  if (!target) {
    res.status(400).json({ message: 'Missing target parameter' })
    return
  }

  try {
    const targetUrl = decodeURIComponent(target)
    const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || ''
    
    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'project_id': projectId,
        // Add more headers if needed
      },
      body: JSON.stringify(req.body)
    })

    // Get the response data
    const data = await response.json()

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Return the response from the target API
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ message: 'Error forwarding request' })
  }
}
