# Deploying HobbyMart to Vercel (free tier) with a custom domain

Stack: **Vercel** (Next.js host) + **Neon** (free Postgres) + **Vercel Blob** (image storage).
Target domain: `hobbymart-bd.com`.

---

## 1. Database — Neon (free Postgres)

1. Sign up at https://neon.tech and create a project (pick a region near your users).
2. Copy the **pooled** connection string. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/DB?sslmode=require
   ```
   Use the **-pooler** host — it's required for serverless.
3. Push the schema and seed the initial data from your machine:
   ```bash
   DATABASE_URL="<neon-pooled-url>" npx prisma db push
   DATABASE_URL="<neon-pooled-url>" npm run seed
   ```
   This creates the tables and the admin/staff/sample data
   (admin: `admin@droneplacebd.com` / `admin123` — change this after first login).

---

## 2. Push code to GitHub

Already connected to `github.com/ilhaansiddique-coder/hobbymartbd-ecom-drone`. Make sure `main` is pushed:
```bash
git add -A && git commit -m "Prepare for deployment" && git push origin main
```

---

## 3. Deploy on Vercel

1. Go to https://vercel.com → **Add New → Project** → import the repo.
2. Framework preset is auto-detected as **Next.js**. Leave build settings default
   (`npm install` runs `postinstall: prisma generate`, then `next build`).
3. Under **Storage**, create a **Blob** store and connect it to the project — Vercel
   adds the `BLOB_READ_WRITE_TOKEN` env var automatically. This is where uploaded
   product/blog images go in production.
4. Add **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | your Neon **pooled** connection string |
   | `NEXTAUTH_URL` | `https://hobbymart-bd.com` |
   | `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` |
   | `BLOB_READ_WRITE_TOKEN` | (added automatically when you connect Blob) |

5. Click **Deploy**. First build takes a few minutes.

---

## 4. Connect the domain `hobbymart-bd.com`

1. In the Vercel project → **Settings → Domains** → add `hobbymart-bd.com` and `www.hobbymart-bd.com`.
2. Vercel shows the DNS records to set at your domain registrar. Either:
   - **A record:** `@ → 76.76.21.21`, and **CNAME:** `www → cname.vercel-dns.com`, **or**
   - point your domain's **nameservers** to Vercel's (Vercel will list them).
3. SSL/HTTPS is provisioned automatically once DNS propagates (minutes to a few hours).
4. Make sure `NEXTAUTH_URL` matches the final URL exactly (`https://hobbymart-bd.com`),
   then redeploy if you changed it.

---

## 5. After it's live

- Log in at `https://hobbymart-bd.com/login` with the admin account and **change the password**.
- Promote/disable users from the **Users** admin page.
- Future schema changes: run `DATABASE_URL="<neon-url>" npx prisma db push` then redeploy.

---

## Notes / gotchas

- **Image uploads** use Vercel Blob in production and the local `public/uploads/`
  folder in development (auto-selected by the presence of `BLOB_READ_WRITE_TOKEN`).
  See `src/app/api/upload/route.ts`.
- **Redis** (`REDIS_URL`/`REDIS_TOKEN`) is optional — the app runs fine without it.
- **Email & payments** are intentionally not wired (console/COD stubs).
- Vercel's free **Hobby** tier is for non-commercial use. For a live store, upgrade to
  **Pro** ($20/mo), or host on **Render**/**Netlify** if you need free commercial hosting.
- The local dev database is a self-owned Postgres cluster on port 5433
  (`npm run db:start` / `db:stop` / `db:status`) — unrelated to the Neon production DB.
