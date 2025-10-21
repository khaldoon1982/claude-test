# 🚀 RefurbX E-Commerce - Deployment Guide

Complete step-by-step guide to deploy the RefurbX e-commerce platform to production.

---

## 📋 Prerequisites

Before deploying, ensure you have accounts for:

- ✅ Vercel (for frontend hosting)
- ✅ Supabase (for database and auth)
- ✅ Typesense Cloud (for search)
- ✅ Resend (for transactional emails)
- ✅ Stripe or Mollie (for payments)
- ✅ GitHub (for version control and CI/CD)

---

## 1️⃣ DATABASE SETUP (SUPABASE)

### Step 1: Create Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Set project name: `refurbx-production`
5. Set database password (save this securely!)
6. Select region (closest to your users, e.g., `West EU (Ireland)`)
7. Click "Create new project"

### Step 2: Run Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or manually run SQL files in Supabase SQL Editor:
# 1. Copy contents of supabase/migrations/001_initial_schema.sql
# 2. Paste in SQL Editor and run
# 3. Repeat for 002_rls_policies.sql and 003_triggers_functions.sql
```

### Step 3: Seed Sample Data (Optional)

```bash
# Run seed file
supabase db reset --db-url "your-database-url"

# Or manually run in SQL Editor:
# Copy contents of supabase/seed.sql and execute
```

### Step 4: Get API Keys

1. Go to Settings > API
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 5: Configure Authentication

1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates:
   - Confirmation email
   - Password reset email
   - Magic link email
4. Set Site URL: `https://yourdomain.com`
5. Add Redirect URLs:
   - `https://yourdomain.com/nl/auth/callback`
   - `https://yourdomain.com/en/auth/callback`
   - `https://yourdomain.com/ar/auth/callback`

---

## 2️⃣ TYPESENSE SETUP

### Step 1: Create Cluster

1. Go to [https://cloud.typesense.org/](https://cloud.typesense.org/)
2. Sign up or log in
3. Click "Create new cluster"
4. Choose plan (start with Hobby for testing)
5. Select region (same as Supabase if possible)
6. Launch cluster

### Step 2: Get API Keys

1. Once cluster is ready, go to "Generate API Keys"
2. Create two keys:
   - Search-only key (for client-side)
   - Admin key (for server-side)
3. Save these values:
   - `NEXT_PUBLIC_TYPESENSE_HOST`
   - `NEXT_PUBLIC_TYPESENSE_PORT` (usually 443)
   - `NEXT_PUBLIC_TYPESENSE_PROTOCOL` (https)
   - `NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY`
   - `TYPESENSE_ADMIN_API_KEY` (keep secret!)

### Step 3: Create Collection

```bash
# Will be created automatically on first product sync
# Or manually via Typesense Dashboard
```

---

## 3️⃣ RESEND SETUP

### Step 1: Verify Domain

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain: `refurbx.nl`
4. Add DNS records to your domain provider:
   - TXT record for domain verification
   - CNAME records for DKIM
   - TXT record for SPF
   - TXT record for DMARC
5. Wait for verification (usually 5-10 minutes)

### Step 2: Get API Key

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it: "RefurbX Production"
4. Copy the key → `RESEND_API_KEY`

### Step 3: Configure Sender

Set these values:
- `RESEND_FROM_EMAIL`: `orders@refurbx.nl`
- `RESEND_FROM_NAME`: `RefurbX`
- `ADMIN_EMAIL`: `admin@refurbx.nl`

---

## 4️⃣ PAYMENT SETUP (MOLLIE)

### Step 1: Create Account

1. Go to [https://www.mollie.com/](https://www.mollie.com/)
2. Sign up for business account
3. Complete KYC verification (required for live mode)

### Step 2: Get API Keys

1. Go to Developers > API Keys
2. Copy:
   - Test API key (for testing)
   - Live API key (for production)
3. Set `MOLLIE_API_KEY`

### Step 3: Configure Webhooks

1. Go to Developers > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/mollie`
3. Enable events: Payment status updates

---

## 5️⃣ VERCEL DEPLOYMENT

### Step 1: Connect Repository

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Step 2: Configure Environment Variables

Add all variables from `.env.example`:

```bash
# Next.js
NEXT_PUBLIC_SITE_URL=https://refurbx.nl

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Typesense
NEXT_PUBLIC_TYPESENSE_HOST=xxx.a1.typesense.net
NEXT_PUBLIC_TYPESENSE_PORT=443
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY=xxx
TYPESENSE_ADMIN_API_KEY=xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=orders@refurbx.nl
RESEND_FROM_NAME=RefurbX
ADMIN_EMAIL=admin@refurbx.nl

# Mollie
MOLLIE_API_KEY=live_xxx
MOLLIE_WEBHOOK_URL=https://refurbx.nl/api/webhooks/mollie

# i18n
NEXT_PUBLIC_DEFAULT_LOCALE=nl
NEXT_PUBLIC_LOCALES=nl,en,ar

# Business
COMPANY_NAME=RefurbX B.V.
COMPANY_VAT_NUMBER=NL123456789B01
COMPANY_KVK_NUMBER=12345678
DEFAULT_VAT_RATE=21.00
FREE_SHIPPING_THRESHOLD_CENTS=7500
STANDARD_SHIPPING_CENTS=595
EXPRESS_SHIPPING_CENTS=995

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Vercel will provide a URL: `https://refurbx.vercel.app`

### Step 4: Configure Custom Domain

1. Go to Project Settings > Domains
2. Add your domain: `refurbx.nl`
3. Add DNS records at your domain provider:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`
4. Wait for SSL certificate (automatic)

---

## 6️⃣ POST-DEPLOYMENT CHECKLIST

### Security

- [ ] Rotate all API keys from development
- [ ] Enable rate limiting on API routes
- [ ] Configure CORS properly
- [ ] Set up Vercel firewall rules
- [ ] Enable Supabase RLS policies
- [ ] Configure Content Security Policy headers

### SEO

- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain ownership
- [ ] Set up Google Analytics
- [ ] Add structured data testing
- [ ] Check robots.txt is accessible
- [ ] Verify canonical URLs

### Testing

- [ ] Test complete checkout flow
- [ ] Verify payment webhooks work
- [ ] Test email delivery (order confirmation, password reset)
- [ ] Test all 3 locales (nl/en/ar)
- [ ] Verify mobile responsiveness
- [ ] Test cart persistence
- [ ] Verify product search works
- [ ] Test authentication (signup, login, logout)

### Performance

- [ ] Run Lighthouse audit (aim for >90 score)
- [ ] Configure Vercel Edge Caching
- [ ] Optimize images (use Next.js Image component)
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring (Sentry for errors)

### Legal & Compliance

- [ ] Add cookie consent banner
- [ ] Create Privacy Policy page
- [ ] Create Terms & Conditions page
- [ ] Set up GDPR data export functionality
- [ ] Configure email unsubscribe links
- [ ] Add VAT display on all prices

---

## 7️⃣ MONITORING & MAINTENANCE

### Error Tracking

```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
```

### Analytics

1. Set up Google Analytics 4
2. Configure conversion tracking
3. Set up e-commerce events:
   - View item
   - Add to cart
   - Begin checkout
   - Purchase

### Database Backups

1. Supabase automatically backs up database
2. Configure backup retention in Supabase dashboard
3. Test restore process periodically

### Monitoring Checklist

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure alert emails for errors
- [ ] Monitor payment webhook failures
- [ ] Track email delivery rates
- [ ] Monitor database performance
- [ ] Set up cost alerts (Vercel, Supabase, Typesense)

---

## 8️⃣ CI/CD WITH GITHUB ACTIONS

The repository includes GitHub Actions workflows:

### Continuous Integration (.github/workflows/ci.yml)

- Runs on every push
- Lints code (ESLint)
- Type checks (TypeScript)
- Runs unit tests (Vitest)

### Continuous Deployment

- Vercel automatically deploys:
  - `main` branch → Production
  - Feature branches → Preview deployments

---

## 🆘 TROUBLESHOOTING

### Build Fails on Vercel

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure TypeScript has no errors locally
- Check Next.js version compatibility

### Emails Not Sending

- Verify domain is verified in Resend
- Check DNS records (SPF, DKIM, DMARC)
- Check Resend API key is correct
- Look for errors in Resend dashboard

### Payment Webhooks Not Working

- Verify webhook URL is accessible publicly
- Check Mollie dashboard for webhook delivery failures
- Test webhook locally with ngrok
- Verify signature validation logic

### Typesense Search Not Working

- Verify collection exists
- Check API keys are correct
- Ensure products are synced
- Check Typesense cluster is running

---

## 📞 SUPPORT

- Vercel: [https://vercel.com/support](https://vercel.com/support)
- Supabase: [https://supabase.com/support](https://supabase.com/support)
- Typesense: [https://typesense.org/support](https://typesense.org/support)
- Resend: [https://resend.com/support](https://resend.com/support)
- Mollie: [https://help.mollie.com/](https://help.mollie.com/)

---

**Deployment Date:** 2025-10-21
**Version:** 1.0
**Status:** Production Ready
