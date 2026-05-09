# Deploy Guide — Launch Message Pack
## Plain-English Steps for Cheryl Gipson

No coding knowledge needed. This takes about 10 minutes total.

---

## What You Have

Your project folder contains 3 files:

```
pmm-launch-workspace/
├── index.html         ← The landing page and tool
├── api/
│   └── generate.js   ← The tiny function that calls Claude AI
└── vercel.json        ← Tells Vercel how to run the project
```

---

## Step 1 — Upload Files to GitHub (5 minutes)

1. Go to **[github.com](https://github.com)** and sign in
2. Click the **"+"** icon in the top-right corner → **"New repository"**
3. Name it: `pmm-launch-workspace`
4. Leave everything else as default → Click **"Create repository"**
5. On the next screen, click **"uploading an existing file"** (it's a link in the middle of the page)
6. **Drag ALL THREE items** from your project folder into the upload area:
   - `index.html`
   - The `api` folder (drag the whole folder)
   - `vercel.json`
7. Scroll down → Click **"Commit changes"**

✅ Your files are now on GitHub.

---

## Step 2 — Connect GitHub to Vercel (2 minutes)

1. Go to **[vercel.com](https://vercel.com)** and sign in
2. Click **"Add New…"** → **"Project"**
3. You'll see a list of your GitHub repositories — click **"Import"** next to `pmm-launch-workspace`
4. On the configuration screen, **do not change anything** — just scroll down
5. **Before clicking Deploy**, click **"Environment Variables"** to expand that section

---

## Step 3 — Add Your Claude API Key (1 minute)

Still on the Vercel configuration screen:

1. In the Environment Variables section:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Paste your Claude API key here (the one from console.anthropic.com)
2. Click **"Add"**
3. Now click **"Deploy"**

⚠️ This is the only place your API key goes. Never put it in a file or share it.

---

## Step 4 — Get Your Shareable Link (30 seconds)

1. Vercel will build your project — takes about 60 seconds
2. When it's done, you'll see a green **"Congratulations!"** screen
3. Your shareable link is shown — it looks like: `pmm-launch-workspace.vercel.app`
4. Click **"Visit"** to see your live tool
5. Copy the link — you can share it with anyone

---

## ✅ You're Done!

Your tool is live at your Vercel URL. Anyone with the link can:
- Fill in a feature brief, persona, and launch stage
- Hit "Generate Message Pack"
- See a full structured messaging pack appear on screen in real time

---

## If Something Goes Wrong

**"Function returned an error"** → Your API key may be wrong. Go to Vercel → Your Project → Settings → Environment Variables → check the key.

**"Page not found"** → Make sure `index.html` is in the root of your GitHub repo (not inside a subfolder).

**"api/generate not found"** → Make sure the `api` folder uploaded correctly with `generate.js` inside it.

---

## How to Update the Tool Later

1. Edit any file on your computer
2. Go to GitHub → your repository → click the file → click the pencil (edit) icon
3. Paste the new content → click "Commit changes"
4. Vercel automatically re-deploys within 30 seconds

---

*Built for the Bloomerang Sr. PMM Exercise · May 2026*
