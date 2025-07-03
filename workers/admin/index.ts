import { verifyToken } from './verifyToken'
import type { Env } from '../../src/types/env'
import { createSignedHeaders } from '../signature'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() })
    }

    const email = await verifyToken(request, env)
    if (!email) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders() })
    }

    if (email !== env.ADMIN_EMAIL) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders() })
    }

    // ✅ 建立加上時間戳與簽章的 header
    const signedHeaders = await createSignedHeaders({
      primarySecret: env.SIGNING_SECRET,
    })

    // ✅ 合併原始 request headers（保留 Authorization 等）與簽章 header
    const forwardedHeaders = new Headers(request.headers)
    signedHeaders.forEach((value, key) => {
      forwardedHeaders.set(key, value)
    })

    // 🌐 預設 API Gateway 轉發
    const targetUrl = `${env.API_GATEWAY_BASE_URL.replace(/\/?$/, '/')}${url.pathname.replace(/^\//, '')}${url.search}`

    const forwarded = await fetch(targetUrl, {
      method: request.method,
      headers: forwardedHeaders,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    })

    const responseHeaders = new Headers(forwarded.headers)
    for (const [key, value] of Object.entries(corsHeaders())) {
      responseHeaders.set(key, value)
    }

    return new Response(forwarded.body, {
      status: forwarded.status,
      headers: responseHeaders,
    })
  },
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}