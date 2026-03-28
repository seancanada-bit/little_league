# Baseball Coach

A fun, interactive baseball plays learning app for 10-year-old beginners. Features an interactive diamond, animated play library, quiz mode, and an AI coach powered by Claude.

**Live URL:** https://pacificlogo.ca/sandbox/baseball-coach/

---

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS v3 + PWA
- **Backend:** PHP 8+ with PDO/MySQL
- **Build output:** `/dist` folder

---

## Local Development

```bash
git clone <your-repo-url> baseball-coach
cd baseball-coach
npm install
npm run dev
```

The dev server runs at `http://localhost:5173/sandbox/baseball-coach/`

---

## cPanel Deployment

### 1. Upload files via Git or FTP

Clone or upload to your cPanel public_html directory:
```
/home/youraccount/public_html/sandbox/baseball-coach/
```

### 2. Install Node and build

Via cPanel Terminal or SSH:
```bash
cd ~/public_html/sandbox/baseball-coach
npm ci
npm run build
```

The built files land in `dist/` — serve that folder.

### 3. Set up the .env file

```bash
cp .env.example .env
nano .env
```

Fill in:
- `ANTHROPIC_API_KEY` — get from https://console.anthropic.com
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` — your MySQL credentials

### 4. Set up MySQL

In cPanel > MySQL Databases:
1. Create database: `baseball_coach`
2. Create user and assign ALL PRIVILEGES
3. Run the migration in phpMyAdmin:

```sql
-- Paste contents of db/setup.sql
```

Or via CLI:
```bash
mysql -u your_user -p baseball_coach < db/setup.sql
```

### 5. Configure PHP API

The PHP files in `api/` run server-side. They read the `.env` file automatically.

Test the API:
```
https://pacificlogo.ca/sandbox/baseball-coach/api/scores.php
```

---

## GitHub Webhook Auto-Deploy

### 1. Set the deploy secret

In your `.env`:
```
DEPLOY_SECRET=some-random-secret-string
```

### 2. Add webhook in GitHub

- Go to your repo > Settings > Webhooks > Add webhook
- Payload URL: `https://pacificlogo.ca/sandbox/baseball-coach/deploy.php`
- Content type: `application/json`
- Secret: same value as `DEPLOY_SECRET`
- Events: Just the push event

### 3. Make sure shell_exec is enabled in cPanel PHP settings

The deploy script runs `git pull`, `npm ci`, and `npm run build` on push to main.

---

## Features

| Tab | Description |
|-----|-------------|
| Field | Interactive SVG baseball diamond — tap any position to learn about it |
| Plays | 8 animated play scenarios with step-by-step explanations |
| Quiz | 8-question randomized quiz with score tracking and leaderboard |
| Coach | Claude AI chat — ask anything about baseball! |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key for the Ask Coach feature |
| `DB_HOST` | MySQL host (usually `localhost`) |
| `DB_NAME` | Database name (`baseball_coach`) |
| `DB_USER` | MySQL username |
| `DB_PASS` | MySQL password |
| `DEPLOY_SECRET` | Random string for GitHub webhook verification |
