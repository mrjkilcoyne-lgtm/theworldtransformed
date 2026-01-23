# Deployment Guide - The Brunel Engine

**Get The Brunel Engine live in under 10 minutes.**

---

## Prerequisites

You'll need:
1. **Anthropic API Key** (required) - [Get one here](https://console.anthropic.com/)
2. **Vercel Account** (free) - [Sign up here](https://vercel.com/signup)
3. **Stripe Account** (optional, for payments) - [Sign up here](https://dashboard.stripe.com/register)

---

## Option 1: One-Click Vercel Deployment (Recommended)

### Step 1: Deploy to Vercel

Click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmrjkilcoyne-lgtm%2Ftheworldtransformed&env=ANTHROPIC_API_KEY&envDescription=API%20keys%20needed%20for%20The%20Brunel%20Engine&envLink=https%3A%2F%2Fgithub.com%2Fmrjkilcoyne-lgtm%2Ftheworldtransformed%2Fblob%2Fmain%2FBRUNEL_SETUP.md&project-name=theworldtransformed&repository-name=theworldtransformed)

**OR** manually:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `mrjkilcoyne-lgtm/theworldtransformed`
3. Vercel will auto-detect Astro configuration

### Step 2: Configure Environment Variables

In the Vercel deployment screen, add these environment variables:

**Required:**
```
ANTHROPIC_API_KEY=sk-ant-... (your key from console.anthropic.com)
PUBLIC_SITE_URL=https://your-app.vercel.app (or your custom domain)
```

**Optional (for payments):**
```
STRIPE_SECRET_KEY=sk_live_... (from dashboard.stripe.com)
STRIPE_PUBLISHABLE_KEY=pk_live_... (from dashboard.stripe.com)
```

### Step 3: Deploy

Click **Deploy** and wait ~2 minutes.

### Step 4: Test

Visit `https://your-app.vercel.app/brunel` and test the interview flow.

---

## Option 2: Manual Vercel Deployment via CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy from project directory

```bash
cd /path/to/theworldtransformed
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your personal account
- **Link to existing project?** No
- **Project name?** theworldtransformed
- **Directory?** ./
- **Override settings?** No

### Step 4: Set Environment Variables

```bash
vercel env add ANTHROPIC_API_KEY
# Paste your API key when prompted
# Select Production, Preview, and Development

vercel env add PUBLIC_SITE_URL
# Enter your Vercel URL or custom domain
```

Optional (for Stripe):
```bash
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Option 3: Netlify Deployment

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login and Initialize

```bash
netlify login
cd /path/to/theworldtransformed
netlify init
```

### Step 3: Configure Build Settings

When prompted:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `dist/server`

### Step 4: Set Environment Variables

```bash
netlify env:set ANTHROPIC_API_KEY "your-key-here"
netlify env:set PUBLIC_SITE_URL "https://your-site.netlify.app"
```

Optional:
```bash
netlify env:set STRIPE_SECRET_KEY "your-stripe-key"
netlify env:set STRIPE_PUBLISHABLE_KEY "your-stripe-publishable-key"
```

### Step 5: Deploy

```bash
netlify deploy --prod
```

---

## Option 4: Self-Hosted (VPS/Cloud Server)

### Requirements
- Node.js 18+ installed
- Process manager (PM2 recommended)
- Reverse proxy (nginx/Caddy)
- SSL certificate

### Step 1: Clone and Build

```bash
git clone https://github.com/mrjkilcoyne-lgtm/theworldtransformed.git
cd theworldtransformed
npm install
npm run build
```

### Step 2: Set Environment Variables

Create `.env` file:
```bash
ANTHROPIC_API_KEY=your-key-here
PUBLIC_SITE_URL=https://theworldtransformed.org
STRIPE_SECRET_KEY=your-stripe-key (optional)
STRIPE_PUBLISHABLE_KEY=your-stripe-pk (optional)
```

### Step 3: Run with PM2

```bash
npm install -g pm2
pm2 start dist/server/entry.mjs --name "brunel-engine"
pm2 save
pm2 startup
```

### Step 4: Configure Reverse Proxy

**Nginx example:**
```nginx
server {
    listen 80;
    server_name theworldtransformed.org;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then set up SSL with Let's Encrypt:
```bash
certbot --nginx -d theworldtransformed.org
```

---

## Custom Domain Setup

### For Vercel:

1. Go to your project dashboard
2. **Settings** → **Domains**
3. Add `theworldtransformed.org`
4. Add DNS records as instructed by Vercel
5. Wait for SSL certificate (~1 minute)

### For Netlify:

1. Go to **Domain settings**
2. Add custom domain: `theworldtransformed.org`
3. Update DNS:
   ```
   A record: @ → 75.2.60.5
   ```
4. Wait for SSL provisioning

---

## Post-Deployment Checklist

After deploying, test these:

- [ ] Site loads at your URL
- [ ] Homepage shows correctly
- [ ] `/brunel` loads The Brunel Engine
- [ ] Interview flow works (6 questions)
- [ ] Report generation works (requires API key)
- [ ] Tier selection displays
- [ ] Follow-up email registration works
- [ ] Payment flow works (if Stripe configured)

### Test Report Generation

1. Go to `/brunel`
2. Complete all 6 questions
3. Select **Basic** tier (free)
4. Click "Generate Report"
5. Verify you get a structured report back

If report generation fails:
- Check Vercel/Netlify logs
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check you have API credits in Anthropic console

---

## Monitoring & Logs

### Vercel

View logs in real-time:
```bash
vercel logs --follow
```

Or in dashboard: **Project** → **Deployments** → **Functions** → **Logs**

### Netlify

View logs:
```bash
netlify logs
```

Or in dashboard: **Deploys** → **Deploy log**

### Self-Hosted

View PM2 logs:
```bash
pm2 logs brunel-engine
pm2 monit
```

---

## Cost Estimates

### Hosting
- **Vercel Pro:** $20/month (free tier available for testing)
- **Netlify Pro:** $19/month (free tier available)
- **Self-hosted VPS:** $5-10/month (DigitalOcean/Linode)

### API Costs per Report
- **Basic tier (Sonnet):** ~$0.01
- **Standard tier (Sonnet):** ~$0.02
- **Council tier (Opus):** ~$0.15

**10p/50p pricing covers these costs with minimal margin.**

### Stripe Fees
- 2.9% + 30p per transaction
- On a 10p transaction: ~3p fee (30% overhead)
- On a 50p transaction: ~4p fee (8% overhead)

**Note:** Micro-transactions have high percentage fees. Consider minimum amounts or alternative payment methods for production.

---

## Troubleshooting

### "Failed to generate report"
- **Check:** Anthropic API key is set correctly
- **Check:** API key has credits available
- **Fix:** View function logs for detailed error

### "Payment not working"
- **Check:** Stripe keys are set
- **Check:** Using test keys in development, live keys in production
- **Fix:** Check Stripe dashboard for failed payments

### Build fails
- **Check:** Node.js version is 18+
- **Fix:** Clear cache and rebuild: `rm -rf .astro dist node_modules && npm install && npm run build`

### API routes return 404
- **Check:** Deployment is using Node adapter (not static)
- **Fix:** Verify `output: 'hybrid'` in `astro.config.mjs`

---

## Updating the Deployment

### Auto-deploy on git push (Vercel/Netlify)

Both platforms auto-deploy when you push to main branch:

```bash
git add .
git commit -m "Update message"
git push origin main
```

Deployment happens automatically in ~2 minutes.

### Manual redeploy

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**Self-hosted:**
```bash
git pull
npm install
npm run build
pm2 restart brunel-engine
```

---

## Going Live Checklist

Before announcing to users:

- [ ] Custom domain configured with SSL
- [ ] Production API keys set (not test keys)
- [ ] Stripe live mode enabled (if using payments)
- [ ] Email service configured (if using follow-ups)
- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] Contact information updated
- [ ] Analytics set up (optional)
- [ ] Error monitoring set up (Sentry/LogRocket)
- [ ] Backups configured (if storing data)

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs/frameworks/astro
- **Netlify Docs:** https://docs.netlify.com/frameworks/astro/
- **Astro Docs:** https://docs.astro.build/en/guides/deploy/

**Issues with The Brunel Engine?** Check `BRUNEL_SETUP.md` for technical details.

---

**Ready to make it live? Start with Option 1 (Vercel one-click) and you'll be operational in under 10 minutes.**
