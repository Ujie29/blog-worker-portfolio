# 🛠️ blog-worker

This project is a personal blog system's edge backend service built on Cloudflare Workers, serving as a secure proxy API gateway responsible for forwarding frontend requests to backend services like Cloud Run.

---

## 📌 Project Features

- Uses **Cloudflare Workers** edge computing
- Secure proxy API gateway architecture:
  - `admin/`: Admin dashboard API authentication and proxy
  - `cdn/`: CDN caching and static content service
- Supports Firebase JWT authentication mechanism
- Adopts HMAC signature and timestamp protection (prevents tampering and replay attacks)
- Built-in CORS preflight and integration testing
- Deployment method: **Direct deployment to Cloudflare Workers platform using Wrangler**

---

## 🧱 Tech Stack

- TypeScript
- Cloudflare Workers
- Firebase JWT Authentication
- HMAC Signature Mechanism
- CORS Cross-Origin Processing
- Edge Computing Architecture
- Modular Design, Well-Structured File Layering

---

## 📁 Project Architecture Overview

```bash
blog-worker/
├── workers/                 # Worker main modules
│   ├── admin/              # Admin API authentication and proxy
│   ├── cdn/                # CDN caching and signature forwarding
│   └── signature.ts        # HMAC signature and timestamp tools
├── src/types/env.ts        # Environment variable type definitions
├── package.json            # Project dependencies and scripts
├── wrangler.jsonc          # Cloudflare Worker configuration file
├── tsconfig.json           # TypeScript configuration
└── README.md
```

---

## 🚀 Deployment Commands (Cloudflare Workers)

Use Wrangler CLI tool for deployment, each Worker service deploys independently.

### 📦 Install Dependencies
```bash
npm install
```

### 🌐 Deploy CDN Worker
```bash
npx wrangler deploy workers/cdn/index.ts --name cdn
```

### 🛠 Deploy Admin Worker
```bash
npx wrangler deploy workers/admin/index.ts --name admin
```

### 📊 Monitor Logs
```bash
npx wrangler tail cdn
```

---

## 🔧 Environment Variables Configuration

```bash
FIREBASE_PROJECT_ID         # Firebase project ID, used to identify Firebase project
FIREBASE_CLIENT_EMAIL       # Firebase client service account email
FIREBASE_PRIVATE_KEY        # Firebase client private key (keep confidential)
ADMIN_EMAIL                 # System administrator email, used for notifications or management purposes
API_GATEWAY_BASE_URL        # API Gateway internal base URL (for backend service calls)
API_GATEWAY_PUBLIC_URL      # API Gateway public URL (for frontend or external service use)
SIGNING_SECRET              # Secret key for signing or verification (such as JWT, Webhook, etc.)
```