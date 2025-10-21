# 🛍️ RefurbX E-Commerce Platform

Modern, full-stack e-commerce platform for refurbished laptops with multi-language support (Dutch, English, Arabic).

Built with **Next.js 14**, **Supabase**, **Typesense**, and **Resend**.

---

## ✨ Features

### 🛒 E-Commerce Core
- Product catalog with advanced filtering
- Full-text search powered by Typesense
- Shopping cart with session persistence
- Secure checkout with Stripe/Mollie
- Order management and tracking
- Multi-language support (NL/EN/AR)

### 👤 User Features
- User authentication (email/password, magic links)
- User profiles and preferences
- Order history
- Address book
- Newsletter subscription

### 🎨 Design & UX
- Fully responsive design
- Dark mode support
- RTL support for Arabic
- Accessibility (WCAG AA compliant)
- Modern UI with Tailwind CSS

### 🔍 SEO & Performance
- Server-side rendering (SSR)
- Dynamic sitemaps
- Structured data (schema.org)
- Optimized images with Next.js Image
- Fast page loads (<2s LCP)

### 🔐 Security
- Row Level Security (RLS) in Supabase
- CSRF protection
- Rate limiting on API routes
- Input validation with Zod
- Secure payment handling

### 📧 Communications
- Transactional emails via Resend
- Order confirmations
- Password reset emails
- Newsletter management

### 📊 Admin Dashboard
- Product management (CRUD)
- Order management
- Inventory tracking
- Bulk operations
- Analytics and reports

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **i18n:** Custom implementation

### Backend
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **Search:** Typesense
- **Email:** Resend
- **Payments:** Mollie / Stripe
- **Storage:** Supabase Storage

### DevOps
- **Hosting:** Vercel (frontend)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Analytics:** Google Analytics 4

---

## 📁 Project Structure

```
refurbx-ecommerce/
├── app/                      # Next.js App Router
│   ├── [locale]/            # i18n route group
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── laptops/         # Product pages
│   │   ├── winkelwagen/     # Cart
│   │   ├── checkout/        # Checkout flow
│   │   └── account/         # User account
│   ├── api/                 # API routes
│   │   ├── webhooks/        # Payment webhooks
│   │   └── search/          # Typesense search
│   ├── robots.ts            # Dynamic robots.txt
│   └── sitemap.ts           # Dynamic sitemap
├── components/              # React components
│   ├── layout/              # Layout components
│   ├── products/            # Product components
│   ├── cart/                # Cart components
│   └── ui/                  # UI primitives
├── lib/                     # Utilities and libraries
│   ├── supabase/            # Supabase clients
│   ├── i18n/                # i18n utilities
│   ├── typesense/           # Typesense client
│   └── resend/              # Email templates
├── types/                   # TypeScript types
├── public/                  # Static assets
│   └── locales/             # Translation files
├── supabase/                # Database migrations
│   └── migrations/          # SQL files
└── tests/                   # Test files
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Typesense Cloud account
- Resend account
- Mollie or Stripe account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/refurbx-ecommerce.git
cd refurbx-ecommerce
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. **Set up Supabase database**

```bash
# Run migrations
supabase db push

# Or manually in Supabase SQL Editor:
# Run files in supabase/migrations/ in order

# Seed sample data (optional)
supabase db reset
```

5. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000/nl](http://localhost:3000/nl) to view the site.

---

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Format code
npm run format
```

---

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/refurbx-ecommerce)

1. Click the button above
2. Configure environment variables
3. Deploy!

---

## 🌍 Internationalization (i18n)

The platform supports three languages:

- 🇳🇱 **Dutch (nl)** - Default
- 🇬🇧 **English (en)**
- 🇸🇦 **Arabic (ar)** - with RTL support

### Adding a New Language

1. Add locale to `lib/i18n/config.ts`
2. Create translation file: `public/locales/{locale}/common.json`
3. Update middleware locale detection
4. Add routes in `app/[locale]/`

### Translating Content

Product translations are stored in the `product_i18n` table:

```sql
INSERT INTO product_i18n (product_id, locale, title, description)
VALUES ('uuid', 'en', 'English Title', 'English description');
```

---

## 🔌 API Routes

### Public Endpoints

- `GET /api/search` - Product search (Typesense)
- `POST /api/cart` - Cart operations
- `POST /api/checkout` - Create checkout session

### Webhooks

- `POST /api/webhooks/stripe` - Stripe payment webhook
- `POST /api/webhooks/mollie` - Mollie payment webhook
- `POST /api/webhooks/typesense-sync` - Product sync webhook

---

## 📊 Database Schema

The database consists of the following main tables:

- `brands` - Laptop brands (Dell, HP, Lenovo, etc.)
- `categories` - Product categories
- `products` - Main product catalog
- `product_i18n` - Product translations
- `carts` / `cart_items` - Shopping cart
- `orders` / `order_items` - Orders
- `addresses` - User addresses
- `profiles` - Extended user data

See [SUPABASE_SCHEMA.md](./SUPABASE_SCHEMA.md) for complete schema.

---

## 🎨 Customization

### Branding

1. Update colors in `tailwind.config.ts`
2. Replace logo in `components/layout/Header.tsx`
3. Update metadata in `app/[locale]/layout.tsx`

### Payment Provider

To switch from Mollie to Stripe:

1. Update environment variables
2. Modify `lib/payments/` utilities
3. Update webhook handler in `app/api/webhooks/`

---

## 🐛 Troubleshooting

### Build Errors

- Ensure all environment variables are set
- Run `npm run type-check` to find TypeScript errors
- Clear `.next` folder and rebuild

### Database Connection Issues

- Verify Supabase credentials
- Check RLS policies are correct
- Ensure migrations have run successfully

### Search Not Working

- Verify Typesense cluster is running
- Check API keys are correct
- Ensure products are synced to Typesense

---

## 📝 Environment Variables

Required environment variables (see `.env.example` for complete list):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_TYPESENSE_HOST`
- `TYPESENSE_ADMIN_API_KEY`
- `RESEND_API_KEY`
- `MOLLIE_API_KEY` or `STRIPE_SECRET_KEY`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential.

Copyright © 2025 RefurbX B.V. All rights reserved.

---

## 👥 Team

- **Developer:** Khaldoon Esmail
- **AI Assistant:** Claude Code

---

## 📞 Support

For support, email info@refurbx.nl or create an issue in the GitHub repository.

---

**Built with ❤️ using Next.js and Supabase**
