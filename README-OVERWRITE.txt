savemylifes — overwrite patch
=============================
Generated: 2025-08-15T11:01:54.424736Z

What this zip changes (drop into the repo root and commit):
- package.json: adds dependency "jose": "^5.8.0" (needed by Netlify Functions)
- netlify.toml: ensures [build.environment] NPM_FLAGS="--legacy-peer-deps" so npm peer conflicts don't fail the install on Netlify
- .npmrc: sets legacy-peer-deps=true locally as well

After pushing to GitHub:
- In Netlify, click: Deploys → Clear cache and deploy site
