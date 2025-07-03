# 🛠️ Blog Worker

This is an edge backend project based on [Cloudflare Workers](https://developers.cloudflare.com/workers/), serving as a **secure proxy API gateway** that forwards frontend requests to backend services like Cloud Run. It supports:

- ✅ Firebase JWT authentication (Admin API)
- ✅ HMAC signature and timestamp (to prevent tampering and replay attacks)
- ✅ Static content caching (CDN API)
- ✅ CORS preflight and integration testing

---

## 📁 Project Structure

```
blog-worker/
├── workers/                 # Main Worker modules
│   ├── admin/              # Admin API authentication and proxy
│   ├── cdn/                # CDN caching and signature forwarding
│   └── signature.ts        # Generate X-Signature and X-Timestamp headers
├── src/types/env.ts        # Environment variable type definitions
├── package.json            # Project dependencies and scripts
├── wrangler.jsonc          # Cloudflare Worker configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Quick Start

### Install dependencies

```bash
npm install
```

### Deploy to Cloudflare

# Deploy cdn-worker
npx wrangler deploy workers/cdn/index.ts --name cdn

# Deploy admin-worker
npx wrangler deploy workers/admin/index.ts --name admin

---

# Environment Variables Description
FIREBASE_PROJECT_ID         # Firebase project ID, used to identify the Firebase project
FIREBASE_CLIENT_EMAIL       # Firebase service account client email
FIREBASE_PRIVATE_KEY        # Firebase service account private key (keep confidential)
ADMIN_EMAIL                 # System administrator's email, used for notifications or admin access
API_GATEWAY_BASE_URL        # Internal base URL for API Gateway (for backend service calls)
API_GATEWAY_PUBLIC_URL      # Public base URL for API Gateway (for frontend or external services)
SIGNING_SECRET              # Secret key for signing or verification (e.g., JWT, Webhook)

# Tail Worker Logs
npx wrangler tail cdn