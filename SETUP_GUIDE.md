# 🚀 ACASH.AI - SETUP GUIDE

## Getting Started with Development

**Last Updated:** 2025-10-03

---

## 📋 PREREQUISITES

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed
- ✅ **npm** or **yarn** installed
- ✅ **Git** installed
- ✅ **Firebase project** created (see below)
- ✅ **Code editor** (VS Code recommended)

---

## 🔥 STEP 1: CREATE FIREBASE PROJECT

### 1.1 Go to Firebase Console

1. Visit: https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Project name: `acash-ai` (or your preferred name)
4. Enable Google Analytics (recommended)
5. Click **"Create project"**

### 1.2 Register Web App

1. In your Firebase project, click **⚙️ Project Settings**
2. Scroll to **"Your apps"** section
3. Click **Web icon (</>)** to register a web app
4. App nickname: `Acash.ai Web`
5. **Check** "Also set up Firebase Hosting" (optional)
6. Click **"Register app"**

### 1.3 Copy Firebase Config

You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef123456789',
};
```

**Copy these values** - you'll need them in Step 3!

---

### 1.4 Enable Authentication

1. In Firebase Console, go to **🔐 Authentication**
2. Click **"Get started"**
3. Enable these sign-in methods:
   - ✅ **Email/Password** (click it, toggle "Enable", save)
   - ✅ **Google** (recommended for future)
   - ✅ **Anonymous** (for guest users - optional)

---

### 1.5 Create Firestore Database

1. In Firebase Console, go to **🗄️ Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location: `us-central1` (or closest to your users)
5. Click **"Enable"**

**Important:** We'll deploy security rules later!

---

### 1.6 Enable Storage (Optional for now)

1. In Firebase Console, go to **📦 Storage**
2. Click **"Get started"**
3. Accept default rules
4. Click **"Done"**

---

## 💻 STEP 2: CLONE & INSTALL

### 2.1 Clone Repository

```bash
cd c:\acash.ai  # or your preferred directory
git clone <your-repo-url> Acash.ai
cd Acash.ai
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages (~500 packages, takes 2-3 minutes).

---

## 🔐 STEP 3: CONFIGURE ENVIRONMENT VARIABLES

### 3.1 Create .env.local file

```bash
# Copy the example file
cp .env.example .env.local

# Or manually create it
```

### 3.2 Edit .env.local

Open `.env.local` in your code editor and **paste your Firebase config**:

```env
# Firebase Configuration (from Step 1.3)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789

# AI Configuration (optional - for future features)
# GEMINI_API_KEY=your_gemini_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Replace ALL the `XXX` and `your-project` values with **YOUR actual Firebase config** from Step 1.3!

---

## 🔒 STEP 4: DEPLOY FIREBASE SECURITY RULES

### 4.1 Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 4.2 Login to Firebase

```bash
firebase login
```

This will open a browser window. Sign in with your Google account.

### 4.3 Initialize Firebase Project

```bash
firebase init
```

**Select:**

- ✅ **Firestore** (press Space to select, Enter to continue)
- Use existing project → Select your project
- Firestore rules file: **firestore.rules** (default)
- Firestore indexes: **firestore.indexes.json** (default)

### 4.4 Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

You should see:

```
✔  Deploy complete!
```

---

## ✅ STEP 5: VERIFY SETUP

### 5.1 Start Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Network:      http://172.x.x.x:3000

✓ Ready in 1.5s
```

### 5.2 Open Browser

Open http://localhost:3000

**If you see the home page without errors** → ✅ **SUCCESS!**

**If you see Firebase errors** → Go to Step 6 (Troubleshooting)

---

## 🐛 STEP 6: TROUBLESHOOTING

### Error: "Firebase configuration is missing"

**Cause:** `.env.local` file missing or empty

**Solution:**

1. Check if `.env.local` exists in project root
2. Make sure all values are filled (no `your_api_key_here`)
3. **Restart dev server**: Stop (Ctrl+C) and run `npm run dev` again

---

### Error: "Firebase: Error (auth/invalid-api-key)"

**Cause:** Wrong API key in `.env.local`

**Solution:**

1. Go to Firebase Console → ⚙️ Project Settings
2. Scroll to "Your apps" → Click "Web app"
3. Copy the **exact** API key
4. Paste in `.env.local` (no spaces, no quotes)
5. Restart dev server

---

### Error: "Missing or insufficient permissions"

**Cause:** Firestore security rules not deployed

**Solution:**

```bash
firebase deploy --only firestore:rules
```

---

### Port 3000 already in use

**Solution:**

```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
```

---

## 📝 STEP 7: NEXT STEPS

Now that your environment is set up:

1. **Read Documentation**
   - `docs/MASTER_PLAN.md` - Full roadmap
   - `docs/PRODUCT_STRATEGY.md` - Product vision
   - `docs/TECHNICAL_ARCHITECTURE.md` - Tech specs

2. **Check Code Quality**

   ```bash
   npm run check    # Run lint + type-check + format
   ```

3. **Run Tests** (when available)

   ```bash
   npm run test
   ```

4. **Start Building!** 🚀

---

## 🎯 DEVELOPMENT COMMANDS

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking
npm run check            # Run all checks (format + lint + types)

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
```

---

## 📦 PROJECT STRUCTURE

```
acash.ai/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Dashboard pages
│   ├── tools/             # Financial tools
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── providers/        # Context providers
├── lib/                   # Utility functions
│   ├── firebase/         # Firebase config
│   └── utils/            # Helper functions
├── store/                 # Zustand stores
├── docs/                  # Documentation
├── .env.local            # Environment variables (YOU CREATE THIS)
├── .env.example          # Example env file
├── firestore.rules       # Firestore security rules
└── next.config.ts        # Next.js configuration
```

---

## 🆘 NEED HELP?

### Documentation

- 📘 **Product Strategy:** `docs/PRODUCT_STRATEGY.md`
- 🏗️ **Architecture:** `docs/TECHNICAL_ARCHITECTURE.md`
- 🎯 **Master Plan:** `docs/MASTER_PLAN.md`
- 📊 **Current Progress:** `docs/PHASE_0_1_PROGRESS.md`

### Common Issues

1. **Can't connect to Firebase?** → Check `.env.local` values
2. **TypeScript errors?** → Run `npm run type-check`
3. **Linting errors?** → Run `npm run lint:fix`
4. **Format issues?** → Run `npm run format`

---

## ✅ SETUP CHECKLIST

- [ ] Node.js 18+ installed
- [ ] Firebase project created
- [ ] Firebase web app registered
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] `.env.local` file created with Firebase config
- [ ] Dependencies installed (`npm install`)
- [ ] Firebase security rules deployed
- [ ] Dev server running (`npm run dev`)
- [ ] Home page loads without errors
- [ ] Code quality checks passing (`npm run check`)

**When all boxes are checked → You're ready to build!** 🎉

---

**Last Updated:** 2025-10-03
**For questions:** Check docs/ folder or ask your technical partner
