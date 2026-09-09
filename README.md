<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# BloomWord - Fun Vocabulary & Faith Garden

An encouraging, magical vocabulary, spelling, reading comprehension, and learning adventure with a bloom garden, Duolingo-style milestones, and cozy learning spaces.

View your app in AI Studio: https://ai.studio/apps/978e8ce7-e8a7-4f24-94f9-cd6acc5fb5a2

---

## 🚀 GitHub Pages Deployment

This repository is pre-configured for seamless GitHub Pages deployment using either of two methods:

### Option A: GitHub Actions (Recommended)
1. Go to your GitHub repository **Settings** → **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Any push to `main` will automatically trigger the included workflow (`.github/workflows/deploy.yml`) and deploy your site.

### Option B: Deploy from `/docs` folder
1. Go to your GitHub repository **Settings** → **Pages**.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Set the branch to `main` (or `master`) and select the folder as `/docs`.
4. Click **Save**.

---

## 💻 Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (optional for core features).
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

