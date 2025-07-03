import { jwtVerify, createRemoteJWKSet } from 'jose'
import type { Env } from '../../src/types/env'

const jwks = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
)

export async function verifyToken(request: Request, env: Env): Promise<string | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('❌ 未帶入 Authorization 標頭')
    return null
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`,
      audience: env.FIREBASE_PROJECT_ID,
    })

    const email = payload.email as string
    console.log('✅ Token 驗證成功 Email:', email)
    return email
  } catch (err) {
    console.error('❌ Token 驗證失敗:', err)
    return null
  }
}