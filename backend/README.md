# Module Generator Backend

This is a minimal Express + TypeScript backend that accepts a module form, calls OpenAI to generate a standalone HTML page, and serves the resulting generated HTML file.

Quick start (PowerShell):

```powershell
cd "C:\Users\MY PC\Downloads\module-generation\backend"
copy .env.example .env
# set OPENAI_API_KEY in .env
npm install
npm run dev
```

Endpoint: POST /api/generate
- Expects multipart/form-data with fields:
  - moduleName (string)
  - attachment (file) — PDF/DOC/DOCX
  - urls (string) — JSON array (stringified) or repeated fields
  - difficulty (string)
  - numQuestions (number)

Response: { ok: true, url: "/generated/<file>.html" }

Note: This is a prototype. Do not run with unprotected API keys in production. Add authentication, rate-limiting and better sanitization for production use.
