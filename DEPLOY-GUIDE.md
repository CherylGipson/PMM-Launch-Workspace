# PMM Launch Workspace - Deploy Guide

## Files in this project
- `index.html` - the full app UI
- `api/generate.js` - the Vercel serverless function that calls the Claude API
- `vercel.json` - Vercel configuration

## GitHub upload
1. Unzip the folder.
2. Open your GitHub repo.
3. Upload these items exactly:
   - `index.html`
   - `vercel.json`
   - `DEPLOY-GUIDE.md`
   - the full `api` folder containing `generate.js`
4. Commit the changes.

## Vercel setup
1. In Vercel, import the GitHub repo.
2. Add an environment variable named `ANTHROPIC_API_KEY`.
3. Paste your Claude API key into that field.
4. Deploy.

## If the app loads but generation fails
- Confirm the environment variable is exactly `ANTHROPIC_API_KEY`
- Confirm `api/generate.js` exists in the deployed repo
- Redeploy after saving environment variables

## What changed in this rebuilt version
- Updated 5x copy
- New launch stage options
- One persona field instead of primary/secondary
- Goal removed
- Five fixed outputs are always included
- Clear Screen to Regenerate button at the top and in results
- Generate button changes state after a successful run
