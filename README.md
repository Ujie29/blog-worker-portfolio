# 🛠️ Blog Worker

這是一個基於 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 的邊緣後端專案，作為一層 **安全代理 API 閘道**，用於將前端請求轉發到 Cloud Run 等後端服務，並支援：

- ✅ Firebase JWT 驗證（Admin API）
- ✅ HMAC 簽章與時間戳（防止竄改與重播）
- ✅ 靜態內容快取（CDN API）
- ✅ 支援 CORS 預檢與整合測試

---

## 📁 專案結構

```
blog-worker/
├── workers/                 # Worker 主要模組
│   ├── admin/              # Admin API 驗證與代理
│   ├── cdn/                # CDN 快取與簽章轉發
│   └── signature.ts        # 建立 X-Signature 與 X-Timestamp header
├── src/types/env.ts        # 定義環境變數型別
├── package.json            # 專案依賴與腳本
├── wrangler.jsonc          # Cloudflare Worker 設定檔
└── tsconfig.json           # TypeScript 設定
```

---

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 部署至 Cloudflare

# 部署 cdn-worker
npx wrangler deploy workers/cdn/index.ts --name cdn

# 部署 admin-worker
npx wrangler deploy workers/admin/index.ts --name admin

---

# 環境變數說明
FIREBASE_PROJECT_ID         # Firebase 專案 ID，用於識別 Firebase 專案
FIREBASE_CLIENT_EMAIL       # Firebase 用戶端服務帳號的電子郵件
FIREBASE_PRIVATE_KEY        # Firebase 用戶端私鑰（需注意保密）
ADMIN_EMAIL                 # 系統管理員的電子郵件，用於接收通知或管理用途
API_GATEWAY_BASE_URL        # API Gateway 的內部基礎網址（供後端服務呼叫）
API_GATEWAY_PUBLIC_URL      # API Gateway 的對外公開網址（供前端或外部服務使用）
SIGNING_SECRET              # 用於簽章或驗證的密鑰（如 JWT、Webhook 等）

# 監聽
npx wrangler tail cdn