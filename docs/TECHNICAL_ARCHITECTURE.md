# 🏗️ ACASH.AI - TECHNICAL ARCHITECTURE

## System Design & Technical Specifications

**Version:** 1.0
**Date:** 2025-10-03
**Status:** Foundation Document
**Audience:** Technical Team

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagrams](#architecture-diagrams)
4. [Database Schema](#database-schema)
5. [Security Architecture](#security-architecture)
6. [API Design](#api-design)
7. [State Management](#state-management)
8. [Performance Strategy](#performance-strategy)
9. [Scalability Plan](#scalability-plan)
10. [Deployment Strategy](#deployment-strategy)

---

## 🌐 SYSTEM OVERVIEW

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Mobile  │  │  Tablet  │  │ Desktop  │  │   PWA    │   │
│  │ Browser  │  │ Browser  │  │ Browser  │  │  (Future)│   │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘   │
└────────┼────────────┼─────────────┼──────────────┼─────────┘
         │            │             │              │
         └────────────┴─────────────┴──────────────┘
                            │
         ┌──────────────────▼──────────────────────┐
         │         CDN (Vercel Edge)               │
         │    (Static Assets, Edge Functions)      │
         └──────────────────┬──────────────────────┘
                            │
         ┌──────────────────▼──────────────────────┐
         │       NEXT.JS 15 APP ROUTER             │
         │                                          │
         │  ┌─────────┐  ┌──────────┐  ┌────────┐ │
         │  │  Pages  │  │   API    │  │ Server │ │
         │  │  (RSC)  │  │  Routes  │  │Actions │ │
         │  └────┬────┘  └────┬─────┘  └────┬───┘ │
         └───────┼────────────┼─────────────┼──────┘
                 │            │             │
         ┌───────▼────────────▼─────────────▼──────┐
         │        APPLICATION LAYER                 │
         │                                          │
         │  ┌──────────┐  ┌──────────┐  ┌───────┐ │
         │  │  React   │  │ Zustand  │  │ React │ │
         │  │Components│  │  Store   │  │ Query │ │
         │  └──────────┘  └──────────┘  └───────┘ │
         └──────────────────┬───────────────────────┘
                            │
         ┌──────────────────▼──────────────────────┐
         │       SERVICES LAYER                     │
         │                                          │
         │  ┌──────────┐  ┌──────────┐  ┌───────┐ │
         │  │ Firebase │  │   PDF    │  │ Email │ │
         │  │   SDK    │  │Generator │  │Service│ │
         │  └─────┬────┘  └──────────┘  └───────┘ │
         └────────┼─────────────────────────────────┘
                  │
         ┌────────▼──────────────────────────────┐
         │      FIREBASE BACKEND                 │
         │                                        │
         │  ┌──────────┐  ┌──────────┐  ┌─────┐ │
         │  │   Auth   │  │Firestore │  │Cloud│ │
         │  │          │  │    DB    │  │Func.│ │
         │  └──────────┘  └──────────┘  └─────┘ │
         └────────────────────────────────────────┘
                            │
         ┌──────────────────▼──────────────────────┐
         │      EXTERNAL SERVICES                   │
         │                                          │
         │  ┌──────┐  ┌────────┐  ┌──────────────┐│
         │  │Stripe│  │ Resend │  │   Analytics  ││
         │  │      │  │ Email  │  │  (GA4, etc.) ││
         │  └──────┘  └────────┘  └──────────────┘│
         └──────────────────────────────────────────┘
```

---

## 🛠️ TECHNOLOGY STACK

### Frontend Layer

#### **Framework: Next.js 15.5.4**

**Why?**

- ✅ React 19 support (latest)
- ✅ App Router (modern, performant)
- ✅ Server Components (reduce bundle size)
- ✅ Built-in SEO optimization
- ✅ Edge runtime support
- ✅ Image optimization
- ✅ API routes
- ✅ Middleware support
- ✅ TypeScript first-class

**Alternatives Considered:**

- Remix: Great, but smaller ecosystem
- Vite + React: No SSR/SEO optimization
- Astro: Better for static, not interactive apps

**Decision:** Next.js wins for SEO + performance + ecosystem

---

#### **UI Library: React 19**

**Why?**

- ✅ Industry standard
- ✅ Huge ecosystem
- ✅ Server Components
- ✅ Concurrent features
- ✅ Best developer experience

---

#### **Styling: Tailwind CSS 3.4.1**

**Why?**

- ✅ Utility-first (rapid development)
- ✅ Tiny bundle size (purged CSS)
- ✅ Design system friendly
- ✅ RTL support (important for Arabic)
- ✅ Dark mode support
- ✅ Responsive by default

**Component Library: shadcn/ui**

- ✅ Not a dependency (copy components)
- ✅ Fully customizable
- ✅ Accessible by default (Radix UI)
- ✅ Beautiful defaults

---

#### **Type System: TypeScript 5.9.3**

**Configuration:**

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

**Why Strict?**

- ✅ Catch bugs at compile time
- ✅ Better IDE support
- ✅ Self-documenting code
- ✅ Easier refactoring

---

### Backend Layer

#### **BaaS: Firebase (Google Cloud)**

**Why Firebase?**

- ✅ Managed infrastructure (no DevOps overhead)
- ✅ Real-time capabilities (for future features)
- ✅ Built-in auth (social logins, email, etc.)
- ✅ Generous free tier
- ✅ Scales automatically
- ✅ Global CDN
- ✅ Security rules (declarative)
- ✅ Offline support (mobile apps)

**Firebase Services Used:**

1. **Authentication** - User management
2. **Firestore** - NoSQL database
3. **Storage** - File uploads (future: receipts, documents)
4. **Cloud Functions** - Serverless compute (future: complex calculations)
5. **Hosting** - Not used (Vercel instead)

**Alternatives Considered:**

- Supabase: Good, but less mature
- Custom backend (Node.js + Postgres): Too much overhead
- AWS Amplify: Complex, vendor lock-in

**Decision:** Firebase for speed, Next.js API routes for custom logic

---

### State Management

#### **Client State: Zustand 5.0.2**

**Why?**

- ✅ Simple API (easier than Redux)
- ✅ No boilerplate
- ✅ Small bundle size (1KB)
- ✅ TypeScript support
- ✅ Middleware support (persist, devtools)
- ✅ Works with React Query

**Store Structure:**

```typescript
stores/
├── auth.ts         // User authentication state
├── user.ts         // User profile, preferences
├── tools.ts        // Tool calculations, history
└── ui.ts           // UI state (modals, toasts, etc.)
```

---

#### **Server State: React Query 5.62.11**

**Why?**

- ✅ Cache management (automatic)
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states
- ✅ Works perfectly with Next.js

**Use Cases:**

- Fetch user data from Firestore
- Fetch calculation history
- Mutation (create, update, delete)

---

### Data Validation

#### **Zod 4.1.11**

**Why?**

- ✅ TypeScript-first
- ✅ Infer types from schema
- ✅ Rich error messages
- ✅ Works client + server
- ✅ Transform data

**Example:**

```typescript
const DebtInputSchema = z.object({
  totalDebt: z.number().positive().max(10_000_000),
  interestRate: z.number().min(0).max(100),
  monthlyPayment: z.number().positive(),
});

type DebtInput = z.infer<typeof DebtInputSchema>;
```

---

### Additional Libraries

| Library                  | Version | Purpose              |
| ------------------------ | ------- | -------------------- |
| jsPDF                    | 3.0.3   | PDF generation       |
| lucide-react             | 0.468.0 | Icons                |
| clsx + tailwind-merge    | Latest  | Class name utilities |
| class-variance-authority | 0.7.1   | Component variants   |

---

## 📊 DATABASE SCHEMA (Firestore)

### Collection Structure

```
firestore/
├── users/                          # User accounts
│   ├── {userId}/
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── photoURL: string?
│   │   ├── subscriptionTier: "free" | "premium" | "enterprise"
│   │   ├── subscriptionStatus: "active" | "canceled" | "past_due"
│   │   ├── subscriptionId: string?  (Stripe subscription ID)
│   │   ├── stripeCustomerId: string?
│   │   ├── trialEndsAt: timestamp?
│   │   ├── preferences: {
│   │   │   ├── language: "ar" | "en"
│   │   │   ├── currency: "SAR" | "USD" | etc.
│   │   │   ├── notifications: boolean
│   │   │   └── theme: "light" | "dark"
│   │   ├── createdAt: timestamp
│   │   ├── updatedAt: timestamp
│   │   └── lastLoginAt: timestamp
│   │
│   └── calculations/               # Subcollection: User's calculations
│       ├── {calculationId}/
│       │   ├── type: "debt" | "budget" | "emergency" | "zakat"
│       │   ├── inputs: object      # Input data (tool-specific)
│       │   ├── results: object     # Calculation results
│       │   ├── createdAt: timestamp
│       │   └── updatedAt: timestamp
│
├── debts/                          # Premium: Multi-debt tracking
│   ├── {userId}/
│   │   └── items/                  # Subcollection
│   │       ├── {debtId}/
│   │       │   ├── name: string    # "Credit Card", "Car Loan"
│   │       │   ├── type: string
│   │       │   ├── balance: number
│   │       │   ├── interestRate: number
│   │       │   ├── minimumPayment: number
│   │       │   ├── currentPayment: number
│   │       │   ├── strategy: "snowball" | "avalanche" | "custom"
│   │       │   ├── createdAt: timestamp
│   │       │   └── updatedAt: timestamp
│
├── budgets/                        # Premium: Budget tracking
│   ├── {userId}/
│   │   ├── income: number
│   │   ├── categories: array
│   │   │   ├── { name, planned, spent, color }
│   │   ├── month: string           # "2025-01"
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
├── goals/                          # Premium: Savings goals
│   ├── {userId}/
│   │   └── items/
│   │       ├── {goalId}/
│   │       │   ├── name: string    # "Emergency Fund", "Hajj", "Car"
│   │       │   ├── targetAmount: number
│   │       │   ├── currentAmount: number
│   │       │   ├── targetDate: timestamp
│   │       │   ├── monthlyContribution: number
│   │       │   ├── priority: number
│   │       │   └── createdAt: timestamp
│
├── subscriptions/                  # Subscription events (for analytics)
│   ├── {subscriptionId}/
│   │   ├── userId: string
│   │   ├── plan: string
│   │   ├── status: string
│   │   ├── startedAt: timestamp
│   │   ├── canceledAt: timestamp?
│   │   └── events: array           # Subcollection or array
│
└── analytics/                      # Usage analytics
    ├── daily/
    │   ├── {date}/                 # "2025-01-15"
    │   │   ├── totalUsers: number
    │   │   ├── activeUsers: number
    │   │   ├── newUsers: number
    │   │   ├── calculationsRun: number
    │   │   └── toolUsage: { debt: 123, budget: 45, ... }
    │
    └── user-events/                # User activity (for analytics)
        ├── {userId}/
        │   └── events/
        │       ├── {eventId}/
        │       │   ├── type: string        # "tool_used", "signed_up", etc.
        │       │   ├── data: object
        │       │   └── timestamp: timestamp
```

---

### Firestore Security Rules (Draft)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isPremium() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.subscriptionTier == "premium";
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if false; // Soft delete only

      // Calculations subcollection
      match /calculations/{calcId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
        allow update: if isOwner(userId);
        allow delete: if isOwner(userId);
      }
    }

    // Debts collection (Premium only)
    match /debts/{userId} {
      allow read: if isOwner(userId) && isPremium();
      allow write: if isOwner(userId) && isPremium();

      match /items/{debtId} {
        allow read, write: if isOwner(userId) && isPremium();
      }
    }

    // Budgets collection (Premium only)
    match /budgets/{userId} {
      allow read, write: if isOwner(userId) && isPremium();
    }

    // Goals collection (Premium only)
    match /goals/{userId} {
      allow read, write: if isOwner(userId) && isPremium();

      match /items/{goalId} {
        allow read, write: if isOwner(userId) && isPremium();
      }
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### Indexing Strategy

**Composite Indexes:**

```
users:
  - (email, createdAt)
  - (subscriptionTier, subscriptionStatus)

calculations:
  - (userId, type, createdAt DESC)
  - (userId, createdAt DESC)

debts/items:
  - (userId, strategy, balance DESC)
  - (userId, interestRate DESC)
```

---

## 🔒 SECURITY ARCHITECTURE

### Security Layers

```
┌──────────────────────────────────────────┐
│   1. Network Security (CDN + DDoS)       │
│      - Vercel Edge Network               │
│      - Rate limiting (middleware)        │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│   2. Application Security                │
│      - CSP Headers                       │
│      - CORS configuration                │
│      - Input validation (Zod)            │
│      - XSS protection (React + DOMPurify)│
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│   3. Authentication Security             │
│      - Firebase Auth (JWT)               │
│      - Session management                │
│      - MFA (future)                      │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│   4. Data Security                       │
│      - Firestore Security Rules          │
│      - Encryption at rest (Firebase)     │
│      - Encryption in transit (HTTPS)     │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│   5. API Security                        │
│      - API key rotation                  │
│      - Secret management (.env)          │
│      - Webhook signature verification    │
└──────────────────────────────────────────┘
```

---

### Content Security Policy (CSP)

```typescript
// next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;
```

---

### Environment Variables Security

**Public Variables** (NEXT*PUBLIC*\*):

- Firebase config (safe to expose)
- App URL
- Analytics IDs

**Private Variables** (Server-side only):

- Stripe secret key
- Email API key
- Admin Firebase service account
- Webhook secrets

**Never Commit:**

- .env.local (local dev)
- .env.production (production secrets → Vercel dashboard)

---

### Rate Limiting Strategy

**Middleware:**

```typescript
// middleware.ts
const rateLimits = {
  '/api/auth/*': { requests: 5, window: '15m' }, // Prevent brute force
  '/api/calculate/*': { requests: 50, window: '1h' }, // Free tier limit
  '/api/premium/*': { requests: 1000, window: '1h' }, // Premium tier
};
```

**Implementation:** Use Vercel KV (Redis) for distributed rate limiting

---

## 🔌 API DESIGN

### API Routes Structure

```
app/api/
├── auth/
│   ├── register/route.ts          # POST - Create account
│   ├── login/route.ts             # POST - Login (handled by Firebase mostly)
│   └── logout/route.ts            # POST - Logout
│
├── user/
│   ├── profile/route.ts           # GET, PATCH - User profile
│   ├── preferences/route.ts       # GET, PATCH - User preferences
│   └── delete/route.ts            # DELETE - Account deletion
│
├── calculations/
│   ├── debt/route.ts              # POST - Run debt calculation
│   ├── budget/route.ts            # POST - Run budget calculation
│   ├── emergency/route.ts         # POST - Run emergency fund calc
│   ├── zakat/route.ts             # POST - Run zakat calculation
│   └── history/route.ts           # GET - Calculation history (premium)
│
├── premium/
│   ├── debts/route.ts             # GET, POST - List/create debts
│   ├── debts/[id]/route.ts        # GET, PATCH, DELETE - Manage debt
│   ├── budget/route.ts            # GET, POST - Budget management
│   └── goals/route.ts             # GET, POST - Savings goals
│
├── stripe/
│   ├── create-checkout/route.ts   # POST - Create Stripe checkout
│   ├── create-portal/route.ts     # POST - Customer portal
│   └── webhook/route.ts           # POST - Stripe webhooks
│
├── reports/
│   ├── pdf/route.ts               # POST - Generate PDF
│   └── email/route.ts             # POST - Email report
│
└── admin/
    ├── analytics/route.ts         # GET - Analytics data
    └── users/route.ts             # GET - User management
```

---

### API Response Format (Standard)

```typescript
// Success Response
{
  success: true,
  data: { /* payload */ },
  meta: {
    timestamp: "2025-01-15T12:00:00Z",
    requestId: "abc123"
  }
}

// Error Response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input",
    details: { /* field errors */ }
  },
  meta: {
    timestamp: "2025-01-15T12:00:00Z",
    requestId: "abc123"
  }
}
```

---

## ⚡ PERFORMANCE STRATEGY

### Bundle Size Optimization

**Targets:**

- Initial load: <200KB (gzipped)
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3.5s
- Lighthouse Score: >90

**Techniques:**

1. **Code Splitting**
   - Route-based (automatic with Next.js)
   - Component-based (React.lazy)
   - Tool-specific bundles

2. **Tree Shaking**
   - Import only what's needed
   - Use barrel exports carefully

3. **Dynamic Imports**

   ```typescript
   const PDFGenerator = dynamic(() => import('@/lib/pdf-generator'), {
     loading: () => <LoadingSpinner />,
     ssr: false // PDF only client-side
   });
   ```

4. **Image Optimization**
   - Use `next/image` exclusively
   - WebP format with fallbacks
   - Lazy loading below fold
   - Blur placeholder (LQIP)

---

### Caching Strategy

**Static Assets:** (CDN - Vercel Edge)

- Cache forever (immutable)
- Hash-based filenames

**API Responses:**

```typescript
// Calculation results (cacheable)
export const revalidate = 3600; // 1 hour

// User data (private, no cache)
export const revalidate = 0;
```

**Client-side Cache:**

- React Query (5 minutes default)
- localStorage (user preferences)

---

### Server Components vs Client Components

**Use Server Components for:**

- Static content
- Data fetching
- SEO-critical content
- Reduce JavaScript bundle

**Use Client Components for:**

- Interactive forms
- State management
- Browser APIs
- Event handlers

```typescript
// ✅ Good - Server Component
export default async function ToolPage() {
  const metadata = await getToolMetadata(); // Server-side
  return <ClientCalculator metadata={metadata} />;
}

// ✅ Good - Client Component (marked with 'use client')
'use client';
export function ClientCalculator({ metadata }) {
  const [result, setResult] = useState(null);
  // Interactive logic here
}
```

---

## 📈 SCALABILITY PLAN

### From 10 Users → 10,000 Users

**Current Setup:** ✅ Sufficient

- Next.js on Vercel (auto-scales)
- Firebase (generous free tier)

**No changes needed**

---

### From 10,000 → 100,000 Users

**Bottlenecks:**

- Firebase reads (paid tier)
- Vercel bandwidth

**Solutions:**

- ✅ Optimize Firestore queries (indexes)
- ✅ Add Redis cache (Vercel KV)
- ✅ CDN for static assets
- **Cost:** ~$500-1,000/month

---

### From 100,000 → 1,000,000 Users

**Bottlenecks:**

- Firebase costs ($5K-10K/month)
- Real-time features

**Solutions:**

- 🔄 Consider PostgreSQL + Supabase (cheaper at scale)
- 🔄 Separate read/write databases (replica)
- 🔄 Queue system (BullMQ) for heavy calculations
- **Cost:** ~$3K-5K/month (with optimization)

---

### From 1M+ Users (Unicorn Status 🦄)

**Migrate to:**

- Kubernetes (GKE or AWS EKS)
- PostgreSQL (multi-region)
- Redis cluster
- Dedicated microservices

**But we're not there yet!** 😄

---

## 🚀 DEPLOYMENT STRATEGY

### Environments

1. **Local Development**
   - `npm run dev`
   - Local Firebase emulators (future)

2. **Staging** (Vercel Preview)
   - Auto-deploy on PR
   - Test Firebase project (staging)
   - Staging Stripe (test mode)

3. **Production** (Vercel)
   - Deploy on merge to `main`
   - Production Firebase project
   - Production Stripe (live mode)

---

### CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

### Deployment Checklist

**Before Every Deploy:**

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Lighthouse score >90
- [ ] Security headers configured
- [ ] Environment variables set
- [ ] Database migrations applied (if any)

---

## 🎯 TECHNICAL DEBT MANAGEMENT

### Current Technical Debt (from Audit)

**High Priority:**

1. No testing infrastructure
2. No error handling system
3. Duplicate routes
4. No security headers
5. No i18n

**Medium Priority:**

1. Basic ESLint config
2. No Prettier
3. No CI/CD
4. No monitoring

**Strategy:**

- ✅ Fix high-priority debt in Phase 1 (this month)
- 🔄 Fix medium-priority in Phase 2 (next month)
- 📝 Document all shortcuts (technical debt log)

---

## 📚 TECHNOLOGY DECISIONS LOG

| Date       | Decision               | Rationale             | Status                   |
| ---------- | ---------------------- | --------------------- | ------------------------ |
| 2025-10-03 | Next.js 15 + React 19  | SEO + Performance     | ✅ Implemented           |
| 2025-10-03 | Firebase BaaS          | Speed to market       | ✅ Implemented           |
| 2025-10-03 | Zustand (not Redux)    | Simplicity            | ✅ Implemented           |
| 2025-10-03 | Vercel hosting         | Best Next.js platform | ✅ Implemented           |
| 2025-10-03 | TypeScript strict mode | Quality + Safety      | ⏳ Needs stricter config |

---

## 🔮 FUTURE TECHNICAL ROADMAP

### Q1 2025 (Now - Mar)

- ✅ Foundation (architecture, security, testing)
- ✅ Core tools (debt, budget, emergency, zakat)
- ✅ Premium tier (Stripe integration)

### Q2 2025 (Apr - Jun)

- 📱 Mobile apps (React Native + Expo)
- 🔗 Bank integrations (Plaid equivalent for MENA)
- 🤖 AI assistant (GPT-4 integration)

### Q3 2025 (Jul - Sep)

- 📊 Advanced analytics dashboard
- 🌍 Multi-language (full i18n)
- 💳 Multiple payment providers (local gateways)

### Q4 2025 (Oct - Dec)

- 🏢 B2B white-label platform
- 📈 Investment tools
- 🔐 Advanced security (MFA, biometrics)

---

**Document Owner:** Strategic Technical Partner
**Last Updated:** 2025-10-03
**Status:** Living Document (will evolve)
**Next Review:** After Phase 1 completion
