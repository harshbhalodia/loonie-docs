# loonie-docs

Marketing site for [Loonie](https://github.com/harshbhalodia/loonie) — a private, local-first
Life Operating System. Plain static HTML/CSS/JS, no build step, served directly by GitHub Pages.

- Live at: https://loonie.ai (custom domain) / https://harshbhalodia.github.io/loonie-docs/
- `index.html` — the single-page site
- `assets/` — styles, script, favicon, OG image
- `CNAME` — custom domain config for GitHub Pages (`loonie.ai`)

## Enable GitHub Pages

1. Repo → **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`, folder `/ (root)`
4. Save — the site publishes at `https://harshbhalodia.github.io/loonie-docs/` within a minute or two.

## Custom domain (loonie.ai)

The `CNAME` file already points Pages at `loonie.ai`. To finish wiring it up:

1. At your DNS provider for `loonie.ai`, add:
   - An `ALIAS`/`ANAME` (or four `A` records to GitHub's Pages IPs, if `ALIAS` isn't supported)
     pointing the apex domain at GitHub Pages — see
     [GitHub's custom domain docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)
     for the current IP list.
   - Optionally a `CNAME` record for `www` → `harshbhalodia.github.io`.
2. In **Settings → Pages**, enter `loonie.ai` under **Custom domain** and save (GitHub verifies
   the DNS automatically once it propagates).
3. Check **Enforce HTTPS** once the certificate is issued (can take a few minutes to a few hours
   after DNS propagates).

## Local preview

Just open `index.html` in a browser, or serve it locally:

```powershell
npx serve .
```
