import type { Env } from '../../src/types/env'
import { createSignedHeaders } from '../signature'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() })
    }

    // 僅 GET 方法支援快取
    const isCacheableMethod = request.method === 'GET'

    // 建立快取 key
    const cacheKey = new Request(request.url, request)
    const cache = caches.default

    // 先查快取（僅限 GET）
    if (isCacheableMethod) {
      const cached = await cache.match(cacheKey)
      if (cached) {
        return cached
      }
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

    // 沒快取就向 Cloud Run 轉發請求
    const targetUrl = `${env.API_GATEWAY_PUBLIC_URL.replace(/\/?$/, '/')}${url.pathname.replace(/^\//, '')}${url.search}`

    const forwarded = await fetch(targetUrl, {
      method: request.method,
      headers: forwardedHeaders,
      body: isCacheableMethod ? undefined : request.body,
    })

    const responseHeaders = new Headers(forwarded.headers)
    for (const [key, value] of Object.entries(corsHeaders())) {
      responseHeaders.set(key, value)
    }

    const response = new Response(forwarded.body, {
      status: forwarded.status,
      headers: responseHeaders,
    })

    // 若是 GET 並且成功，就寫入快取
    if (isCacheableMethod && forwarded.ok) {
      // 加上 Cache-Control header
      // response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=60')
      response.headers.set('Cache-Control', 'public, immutable')
      await cache.put(cacheKey, response.clone())
    }

    return response
  },
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}