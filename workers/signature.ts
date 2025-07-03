export interface SignatureOptions {
  primarySecret: string
  secondarySecret?: string // 可選，用於輪替時
}

/**
 * 建立簽章 Header，用於 Worker 傳送到 Cloud Run 時驗證身份
 */
export async function createSignedHeaders(options: SignatureOptions): Promise<Headers> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const headers = new Headers()

  // 選擇目前使用的 secret
  const secret = options.primarySecret
  const signature = await hmacSha256(secret, timestamp)

  headers.set('X-Timestamp', timestamp)
  headers.set('X-Signature', signature)

  // 如果你想記錄是哪組 secret 用的（例如 "v1" / "v2"），也可以加上 X-Signature-Version
  // headers.set('X-Signature-Version', 'v1')

  return headers
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  const signatureArray = Array.from(new Uint8Array(signatureBuffer))
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('')
}