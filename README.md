# Hyve Dynamics Website

Modern, responsive website for Hyve Dynamics - Transforming Industries Through Real-World Intelligence.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📦 Deployment

### Vercel (Recommended)
See [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT.md)

```bash
# Using Vercel CLI
vercel

# Or import from GitHub on vercel.com
```

### GitHub Pages
See [GitHub Pages Setup](docs/GITHUB_PAGES_SETUP.md)

```bash
npm run build:gh-pages
# Automated deployment via GitHub Actions
```

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **Animations**: Framer Motion
- **3D Graphics**: Three.js
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── assets/          # Static assets
├── components/      # React components
│   ├── common/      # Shared components
│   ├── layout/      # Layout components
│   ├── pages/       # Page templates
│   ├── sections/    # Page sections
│   └── ui/          # UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── pages/           # Route pages
└── types/           # TypeScript types
```

### Private pitch deck pack (not in Git on this repo)

Investor deck copy, research, and confidential attachments live in **`deck_private_7pc/`** at the repository root. That path is **gitignored** here so it is not pushed with the website. Initialise a **separate private repository** from that folder if you want version control for the deck. See **`deck_private_7pc/README.md`**.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y
```

## 🔧 Development Tools

### Code Quality
```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Performance
```bash
# Analyze bundle
npm run build
# Check dist/stats.html

# Lighthouse audit
npm run lighthouse

# Security audit
npm run security:audit
```

## 📚 Documentation

- [Polishing Checklist](docs/POLISHING_CHECKLIST.md)
- [Accessibility Audit](docs/ACCESSIBILITY_AUDIT.md)
- [Security Audit](docs/SECURITY_AUDIT.md)
- [Production Deployment](docs/PRODUCTION_DEPLOYMENT.md)
- [Vercel Deployment](docs/VERCEL_DEPLOYMENT.md)
- [GitHub Pages Setup](docs/GITHUB_PAGES_SETUP.md)

## 🌐 Environment Variables

Create `.env.local` for local development:

```env
# API endpoints
VITE_API_URL=https://api.hyvedynamics.com

# Feature flags
VITE_ENABLE_ANALYTICS=false
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

© 2024 Hyve Dynamics Holdings. All rights reserved.