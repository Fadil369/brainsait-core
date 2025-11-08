<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1gQfzphWttQr5G8AHO7YIpY2leh-JoFqr

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`, `VITE_API_BASE_URL`, and `VITE_WS_BASE_URL`
3. Run a quick type-check to make sure the Copilot integration compiles:
   `npm run typecheck`
4. In one terminal start the Gemini proxy server (with hot reload):
   `npm run server:dev`
5. In another terminal start the app:
   `npm run dev`

### Production checklist

- `npm run build` to produce the optimized bundle used by BrainSAIT Core + Copilot Arabic.
- `npm run typecheck` must pass (guards the proxy, live integration, and bilingual templates).
- Run the backend proxy with your production env: `NODE_ENV=production npm run server`.
- Confirm your deployment environment injects `GEMINI_API_KEY` securely (never commit real keys).

### Docker Compose deployment

1. Build and start both services (frontend + API proxy):
   `npm run compose:up`
2. The API is exposed on `http://localhost:4000`, and the static web build is served from `http://localhost:4173`.
3. Set `GEMINI_API_KEY` and optional `CORS_ORIGIN` before running compose to use your real credentials.

### Testing

- `npm run typecheck` – static safety net for both UI and shared config.
- `npm run test:e2e` – Playwright suite with mocked Gemini proxy/websocket. Run `npx playwright install --with-deps chromium` once on each machine before executing.
