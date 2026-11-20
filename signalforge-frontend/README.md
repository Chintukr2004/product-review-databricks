# SignalForge frontend

React + Vite + TypeScript frontend for the existing SignalForge Express API.

## Run locally

1. Install Node.js 18+ (Node 20 LTS recommended).
2. Run `npm install`.
3. Create `.env` in this folder and set:

   `VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com`

   Use the base Render service URL only; do not add `/api` and do not add a trailing slash.
4. Run `npm run dev`.
5. For a production build, run `npm run build`.

## Deploy to Vercel

1. Push this frontend folder to a GitHub repository.
2. In Vercel, import that repository.
3. If this frontend is in the repository root, leave Root Directory as `.`. If it is inside a subfolder, select that folder as Root Directory.
4. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
5. In Project Settings → Environment Variables, add `VITE_API_BASE_URL` with your Render backend base URL, for example `https://your-api-name.onrender.com`.
6. Add it for Production (and Preview/Development if needed), save, then redeploy.

`vercel.json` includes an SPA rewrite so `/products/:productId` detail links work after refresh.

## Backend expectations

The UI calls these existing routes:

- `GET /api/products`
- `GET /api/products/:productId`
- `PUT /api/products/:productId/flag` with `{ "flagged": true|false }`
- `GET /api/health`

The Express backend must allow browser CORS requests from your Vercel domain. The provided backend currently uses `cors()` with its default permissive configuration.

## Important

`VITE_API_BASE_URL` is public frontend configuration, not a secret. Never put Databricks tokens, database passwords, or other backend secrets in a `VITE_` variable.
