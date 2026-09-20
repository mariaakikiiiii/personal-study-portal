# Personal e-learning study portal — Render setup

This is a standalone personal portal inspired by the supplied course dashboard. It is visibly labelled as personal, uses its own branding, and does not connect to USEK or collect university credentials. The course cards are sample entries; search, sort, list/card view, starring and the AI dialog work. Home, Dashboard and My courses select the same course overview.

## What you need

- A GitHub account (the easiest route for storing the code and connecting Render).
- A Render account to run this Node.js web service.
- An Ollama account, an API key, and access/quota for a cloud model that supports images.
- A unique portal password, at least 16 characters. Do not reuse your university password.

Your browser talks to your Render service. The Render server calls Ollama Cloud. No Ollama installation, GPU, or always-on personal laptop is required. Local Ollama at localhost:11434 on your laptop is not reachable from a Render server.

Check that your university permits your deployed *.onrender.com URL and AI use. Permission to open render.com itself does not guarantee permission to open hosted applications. This project does not establish or change campus network permissions.

## Step 1 — Extract the ZIP

On Windows, right-click the downloaded ZIP, choose Extract All, then open the study-portal folder. You should see package.json, package-lock.json, server.mjs, README.md, render.yaml, test.mjs and a public folder.

## Step 2 — Create your Ollama key

1. Open https://ollama.com and sign in.
2. Open https://ollama.com/settings/keys and create an API key.
3. Copy it privately. You will paste it into Render, never into public/app.js, an HTML file or GitHub.
4. The default model is gemma4:31b, documented in Ollama's direct cloud API example at the time of preparation. It supports images. Availability and account limits can change.
5. If needed, check https://ollama.com/api/tags for current direct cloud model names and choose an image-capable model from https://ollama.com/search?c=cloud&c=vision . Set its exact direct-API name in OLLAMA_MODEL. Do not blindly add -cloud: local CLI and direct API names may differ.

## Step 3 — Upload the code to GitHub

1. Sign in at https://github.com . Click + → New repository.
2. Name it personal-study-portal. Choose Private. Create the repository.
3. Select uploading an existing file (or Add file → Upload files).
4. Drag the CONTENTS of the extracted study-portal folder into the page, including the public folder. Do not upload the ZIP itself. package.json must be at the repository root, not inside another study-portal folder.
5. Commit the files. Do not upload node_modules, an .env file, passwords or API keys. The supplied project contains no real secrets.
6. Confirm public/index.html, public/style.css and public/app.js are present and package-lock.json is at the root.

You do not need Git commands or VS Code for this upload route. Render also supports other repository workflows, but these instructions use GitHub.

## Step 4 — Create the Render service

1. Sign in at https://dashboard.render.com .
2. Choose New + → Web Service. Do NOT choose Static Site: authentication and AI calls require the server.
3. Connect GitHub and grant Render access to your private personal-study-portal repository. Select it.
4. Enter these settings:

| Setting | Value |
|---|---|
| Name | A unique personal-study-portal name |
| Language/runtime | Node |
| Branch | main (or the branch you uploaded) |
| Root directory | Leave blank if package.json is at repository root |
| Build command | npm ci |
| Start command | npm start |
| Instance type | Free for initial personal testing, if available |
| Health check path | /healthz |

5. Add environment variables before deploying:

| Variable | Value |
|---|---|
| NODE_ENV | production |
| NODE_VERSION | 22.16.0 |
| CHAT_PASSWORD | Your own unique password of at least 16 characters |
| OLLAMA_API_KEY | Your private Ollama API key |
| OLLAMA_MODEL | gemma4:31b, or another verified cloud vision model |

Paste values without wrapping quotation marks. You do not need to set PORT; Render supplies it. OLLAMA_CHAT_URL is an optional development setting: leave it unset for normal deployment.

6. Click Deploy Web Service. Wait for the build and service to become Live.
7. Open the assigned https://your-service-name.onrender.com address.

Optional alternative: render.yaml is supplied for Render's Blueprint workflow. Use either the manual Web Service steps above OR a Blueprint, not both, to avoid duplicate services.

## Step 5 — Use and verify it

1. Open the site and select AI assistant.
2. Enter the CHAT_PASSWORD you set on Render. It is a portal password, not your Ollama key.
3. Send a short text question and wait for the response.
4. Click Attach files, select an image and ask what it shows. Then try a short text-based PDF.
5. Open a private/incognito browser window and verify that chat requires the password again.
6. Click Lock & sign out when finished. New chat clears the current conversation.

Anyone with the URL can see the sample dashboard, but the backend requires a valid password session for chatting and attachments. Anyone who knows your password can sign in, so keep it private. Render/GitHub/Ollama account access must also remain private.

## File and chat limits

- Images: PNG, JPG/JPEG and WebP; image bytes are sent to the vision model.
- Documents: PDF with selectable text, TXT, MD and CSV. Extracted text is sent to the model.
- Up to 3 attachments per message; 5 MB per file.
- PDFs: up to 60 pages and 50,000 extracted characters per file. Split longer documents.
- PDF diagrams and embedded pictures are NOT extracted. Scanned PDFs are not OCR'd. For these, upload page screenshots as images. Mixed scanned/text PDFs send only their extractable text.
- Word, PowerPoint, Excel, audio, video and ZIP uploads are not supported. Export relevant text to PDF/TXT or upload screenshots.
- Questions: 12,000 characters. Responses are displayed as safe plain text, including code and mathematical notation; no rich Markdown/LaTeX rendering.
- Sessions expire after four hours. Chats/files are held temporarily in server memory, never intentionally written to disk, and forwarded to Ollama for processing. Ollama's own policies apply; this is cloud AI, not fully local/private inference.
- Browser refresh, sign-out, New chat and server restarts clear the available conversation. Closing/reopening the chat panel keeps the current conversation. Earlier turns can be dropped to bound context. There is no saved chat history.
- The session store and rate limits are in memory. This project is designed for one Render instance and personal use. Restarts reset them and sign you out; a multi-instance/public product needs a shared store and stronger account management.

## Updating the site or password

- Edit files in GitHub and commit. Render normally redeploys the linked branch automatically.
- Course entries are at the top of public/app.js. Change IDs/numbers there.
- Colors/layout are in public/style.css; text and layout markup are in public/index.html.
- Change CHAT_PASSWORD under Render → service → Environment, then save/redeploy. Restarting invalidates old sessions.
- If your Ollama key leaks, revoke it in Ollama and replace OLLAMA_API_KEY on Render.

## Troubleshooting

- Slow first load: Render Free services sleep after 15 minutes without inbound activity. Waking can take about a minute. A paid always-on plan avoids this particular sleep behavior.
- Deploy fails with password/key error: check the required environment variables. No default password is built in.
- Build cannot find package.json: upload the extracted files at the repository root or configure Root directory correctly.
- Login says incorrect password: use CHAT_PASSWORD, exactly as entered, without quotes.
- Too many login attempts: wait 15 minutes. The limit is per source IP, so people on a shared campus IP can share that limit.
- Ollama rejected key/access: check the key, account permissions and chosen model.
- Model unavailable/status 404: select an exact currently available direct cloud API model name.
- Usage limit: check your Ollama plan/quota. A Render free service does not make AI usage unlimited or necessarily free.
- Timeout: shorten the prompt/document or try another available model. The server waits at most 120 seconds.
- Upload rejected: check extension, real file type, file count and size. Export scanned pages to images.
- Works at home but not university: ask university IT whether the deployed hostname and intended use are permitted.

## Optional local development

Install Node.js 22.16 or newer (22 or 24), open a terminal in this folder, run npm ci, then set environment variables. Windows PowerShell:

```powershell
$env:CHAT_PASSWORD="YOUR-UNIQUE-LONG-PASSWORD"
$env:OLLAMA_API_KEY="YOUR-PRIVATE-OLLAMA-KEY"
$env:OLLAMA_MODEL="gemma4:31b"
npm start
```

Open http://localhost:3000 . Keep NODE_ENV unset for local HTTP so the local session cookie works. Set NODE_ENV=production on Render for secure HTTPS cookies. Never commit these private values. For a local Ollama server, set OLLAMA_CHAT_URL=http://localhost:11434/api/chat and an installed vision model in OLLAMA_MODEL; the app currently still requires a nonempty OLLAMA_API_KEY variable (a local placeholder is sufficient for an unauthenticated local Ollama instance). This local setup is distinct from the recommended Cloud deployment.

Run npm test to execute integration tests against a local mocked AI endpoint. Tests do not send information to Ollama and do not validate your real key or provider quota.

## Official references

- https://render.com/docs/deploy-node-express-app
- https://render.com/docs/web-services
- https://render.com/docs/free
- https://docs.ollama.com/cloud
- https://docs.ollama.com/api/authentication
- https://docs.ollama.com/api/chat
- https://ollama.com/library/gemma4
