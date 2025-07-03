import type { Env } from '../../src/types/env'

type CloudflarePurgeResponse = {
  success: boolean
  errors: any[]
  messages: string[]
  result: any
}

export async function handlePurge(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const auth = request.headers.get('Authorization')
  if (auth !== `Bearer ${env.SIGNING_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ purge_everything: true }),
  })

  const json = await res.json() as CloudflarePurgeResponse

  if (json.success) {
    return new Response('✅ Cloudflare 快取已清除成功', { status: 200 })
  } else {
    return new Response(`❌ 快取清除失敗\n${JSON.stringify(json, null, 2)}`, { status: 500 })
  }
}