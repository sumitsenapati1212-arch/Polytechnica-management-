# Polytechnica Management: MVP

Monitor. Diagnose. Correct. Grow Better.

FastAPI backend + mobile-first HTML/CSS/JS frontend (Chart.js). Served by one process.

## What is real vs. demo
| Feature | Status |
|---|---|
| Sensor ingest API (ESP32, per-device token) | Real. Needs your hardware. |
| Demo sensor data | Clearly flagged **SIMULATED** everywhere. Deletable. |
| Photo diagnosis | Real vision model call (Anthropic API, `ANTHROPIC_API_KEY`). Preliminary only. |
| Source retrieval | Live web search restricted to trusted domains (`backend/ai.py` → `TRUSTED_DOMAINS`). Citations not found in the retrieved results are removed automatically. |
| Fertilizer rates | Only requested when stage + medium + soil test (or pH+EC) are supplied, and only sourced. |
| Target ranges | Editable **starter values, not source-verified**. |
| PDF | Use "Print / Save PDF" (browser). CSV export is built in. |

## Run locally (PC)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # edit JWT_SECRET and ANTHROPIC_API_KEY
uvicorn main:app --host 0.0.0.0 --port 8000
```
Open http://localhost:8000, register, then Dashboard → "Load SIMULATED demo data".

## Android phone
- Same Wi-Fi: open `http://<PC-IP>:8000` in Chrome. Camera upload works on HTTPS or localhost; for phone camera use a deployed HTTPS URL (below) or the file picker's gallery option.
- Chrome menu → "Add to Home screen" for an app-like shortcut.
- Or run the server on the phone with Termux (`pkg install python`, then the steps above).

## Connect an ESP32
1. Settings → Devices → create a token (shown once).
2. Flash `esp32/polytechnica_sensor.ino` (set Wi-Fi, server URL, token; pin your sensors).
3. The ESP32 POSTs JSON to `POST /api/sensors/ingest` with header `X-Device-Token`:
```bash
curl -X POST https://YOUR_HOST/api/sensors/ingest -H "X-Device-Token: TOKEN" \
  -H "Content-Type: application/json" -d '{"temperature":27.4,"humidity":78,"soil_moisture":61}'
```
Fields are optional; missing ones show "Not reporting". Use HTTPS in production. Data older than 15 min shows "offline/stale"; out-of-physical-range values show "faulty".

## Test
- Sensors: use the curl above, then check Climate Monitoring.
- Diagnosis: upload a clear leaf photo (e.g. from a university extension plant-disease gallery you have rights to use). Try a blurry photo and a non-plant photo to confirm low-confidence / expert-referral behaviour.
- Fertilizer: submit with only crop+symptoms → expect NO rate. Add stage, medium, pH, EC, test values → rates only if a retrieved source supports them.

## Deploy
Any host that runs Python (Render, Railway, Fly.io, a VPS): start command `uvicorn main:app --host 0.0.0.0 --port $PORT`, set env vars, mount a persistent disk for `polytechnica.db` and `uploads/` (free tiers often have ephemeral disks, so data is lost on redeploy; use a paid disk or switch to Postgres). Set `ALLOW_REGISTRATION=false` once your account exists.

## Accounts / costs
- **Anthropic API key**: paid, per use. Each diagnosis includes an image and several web searches (search is billed separately). Not free or unlimited. A per-user limit of 15 AI calls/hour is built in.
- Hosting: free tiers exist but sleep and have ephemeral disk.
- Hardware: ESP32 + sensors (DHT22/SHT3x, capacitive soil probe, optional EC probe).
- Chart.js loads from a CDN (needs internet on the client).

## Known MVP limits
- SQLite + in-memory rate limiting suit one server instance.
- No bundled photographs (add your own licensed images in `frontend/`); the hero uses a CSS pattern.
- Search is limited to domains in `TRUSTED_DOMAINS`; some ICAR/KVK PDFs may not be indexed.
- Not a substitute for lab tests or an agronomist.
