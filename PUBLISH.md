# Publish this portfolio to GitHub Pages

Your portfolio is a Vite + React app, so GitHub can't serve the raw files —
it has to be **built** first. I've added a workflow
(`.github/workflows/deploy.yml`) that builds and publishes it automatically
every time you push. You only set this up once.

---

## One-time setup

### 1. Create the repository on GitHub
- Go to https://github.com/new
- **Repository name:** anything you like, e.g. `portfolio`
- **Visibility:** Public (Pages is free on public repos)
- Do **not** add a README, .gitignore, or license (your folder already has files)
- Click **Create repository**

Leave that page open — you'll need the commands it shows.

### 2. Push your folder to the repo
Open Terminal, then run these from inside the `app` folder.
Replace `YOUR-USERNAME` and `portfolio` with your values.

```bash
cd "/Users/Aditya/Downloads/Kimi_Agent_Shared%20attachments/app"

git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

If git asks you to sign in, use your GitHub username and a **Personal Access
Token** as the password (GitHub no longer accepts your account password here).
Create one at https://github.com/settings/tokens → "Generate new token
(classic)" → tick the **repo** scope.

### 3. Turn on GitHub Pages
- In your repo: **Settings** → **Pages** (left sidebar)
- Under **Build and deployment → Source**, choose **GitHub Actions**
- That's it — no branch to pick.

### 4. Watch it deploy
- Go to the **Actions** tab. You'll see "Deploy to GitHub Pages" running.
- It takes ~1–2 minutes. When the green check appears, your site is live at:

  **https://YOUR-USERNAME.github.io/portfolio/**

---

## Updating the site later
Every time you change the portfolio, just push again:

```bash
git add .
git commit -m "Update portfolio"
git push
```

The site rebuilds and updates on its own.

---

## If the deploy fails
Open the failed run in the **Actions** tab and read the red step.

- **TypeScript errors in the `npm run build` step.** Your build command is
  `tsc -b && vite build`, so a type error stops the build. Either fix the
  reported error, or, to publish regardless of type warnings, change the
  `"build"` script in `package.json` to just `"vite build"`.
- **"Pages site not found" / permissions error.** Make sure step 3 is set to
  **GitHub Actions** (not "Deploy from a branch").

---

## Notes
- Your `vite.config.ts` already uses `base: './'` (relative paths), so the
  site works correctly at the `/portfolio/` sub-path — no changes needed.
- The workflow copies `index.html` to `404.html` so a page refresh doesn't
  break (helpful if you add multiple routes later).
- Prefer a custom domain (e.g. `aditya.dev`)? Add it under **Settings → Pages →
  Custom domain** after the first successful deploy.
