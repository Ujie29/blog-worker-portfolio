import type { Env } from '../../src/types/env'
import handler from './handler'
import { handlePurge } from './purge'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // 🎯 加入 /cdn/purge API 的分流
    if (url.pathname === '/purge') {
      return handlePurge(request, env)
    }

    // 其他請求走原本的快取邏輯
    return handler.fetch(request, env)
  }
}