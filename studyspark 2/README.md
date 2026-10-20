# StudySpark – university revision website

Next.js website to organise multiple subjects/topics, upload lecture slides and tutorial sheets, produce study notes, flashcards, MCQs and AI-graded short answers.

## What is ready?

All app code is included. The site runs locally and can be hosted on Vercel. **AI features require your own Gemini API key** (no OpenAI key needed). Google AI Studio may offer a free tier subject to quotas and availability. API keys are credentials; never paste them in chat or commit them to GitHub. The site currently stores subjects and materials in each browser's localStorage: it does not sync between devices and does not have student login. This is not a hardened multi-user public service.

## 1. Run on your Mac

1. Install Node.js 20+ (https://nodejs.org/).
2. Extract this ZIP and open Terminal in `studyspark`.
3. Run `npm install`.
4. Visit https://aistudio.google.com/api-keys, sign in and create a Gemini key (if available).
5. Copy `.env.example` to `.env.local`, then replace `your_key_from_google_ai_studio` with your key.
6. Run `npm run dev` and open http://localhost:3000.

## 2. Publish it on Vercel

1. Upload the `studyspark` folder to a **private** GitHub repository (keep `.env.local` out of Git).
2. Import the repository at https://vercel.com/new.
3. In Vercel Environment Variables add `GEMINI_API_KEY` with your key. Optionally set `GEMINI_MODEL=gemini-2.5-flash`.
4. Deploy, then visit the URL provided by Vercel.

**Security warning**: Anyone who can access a public deployment can trigger requests billed to your key, including automated abuse. Add authentication and rate limiting before sharing a hosted version broadly; provider quotas alone are not a complete protection. Your key stays on the server and is never sent to the browser.

## Notes

- PDFs must have extractable text; scans need OCR first.
- Accepts PDF, DOCX, TXT, MD (10 MB upload limit); large sources are truncated before AI generation.
- Generated AI material may contain errors; check it against your lectures.
- No guarantee of free-tier access or usage; check current model pricing and quotas with Google.
- No live URL is included. Deploying requires access to your own Vercel/GitHub accounts.
