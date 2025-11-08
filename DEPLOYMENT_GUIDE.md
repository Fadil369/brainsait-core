# BrainSAIT Core - Production Build & Deployment Guide

## 🚀 Quick Build

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Generate documents
npm run generate-docs
```

---

## 📦 Build Output

After running `npm run build`, you'll get:

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── index-[hash].css   # Compiled styles
│   └── [other assets]     # Images, fonts, etc.
└── [static files]          # Copied from public/
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_APP_NAME": "BrainSAIT",
    "VITE_API_BASE_URL": "https://api.brainsait.com"
  }
}
```

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_APP_NAME = "BrainSAIT"
  VITE_API_BASE_URL = "https://api.brainsait.com"
```

---

### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Install AWS CLI
brew install awscli  # macOS
# or download from https://aws.amazon.com/cli/

# Configure AWS
aws configure

# Create S3 bucket
aws s3 mb s3://app.brainsait.com

# Enable static website hosting
aws s3 website s3://app.brainsait.com \
  --index-document index.html \
  --error-document index.html

# Upload build
aws s3 sync dist/ s3://app.brainsait.com --delete

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name app.brainsait.com.s3.amazonaws.com \
  --default-root-object index.html
```

---

### Option 4: Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Build and run:**
```bash
# Build image
docker build -t brainsait-core .

# Run container
docker run -d -p 80:80 brainsait-core

# Or with docker-compose
docker-compose up -d
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Add backend services
  api:
    image: brainsait/api:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - db
      - cache

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=brainsait
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 🔧 Environment Variables

Create `.env.production`:

```bash
# Application
VITE_APP_NAME=BrainSAIT
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://api.brainsait.com

# Gemini AI
GEMINI_API_KEY=your_production_key_here

# Feature Flags
VITE_ENABLE_AI_ASSISTANT=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CERTIFICATES=true

# OID Configuration
VITE_BRAINSAIT_OID_BASE=1.3.6.1.4.1.61026
VITE_COUNTRY_SUDAN_OID=1.3.6.1.4.1.61026.1
VITE_COUNTRY_SAUDI_OID=1.3.6.1.4.1.61026.2

# Analytics (optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 📊 Performance Optimization

### Build Optimization

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Target modern browsers
    target: 'es2020',
    
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
    
    // Chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': [
            './src/components/HomePage',
            './src/components/Dashboard',
          ],
        },
      },
    },
    
    // Source maps (optional for debugging)
    sourcemap: false,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Remove all `console.log` statements
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS only
- [ ] Enable security headers
- [ ] Configure CORS properly
- [ ] Remove development dependencies
- [ ] Scan for vulnerabilities: `npm audit`
- [ ] Update all dependencies: `npm update`
- [ ] Test in production-like environment
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup strategy
- [ ] Set up SSL certificates
- [ ] Enable rate limiting on API
- [ ] Configure CDN (CloudFlare/AWS CloudFront)
- [ ] Set up monitoring (Datadog/New Relic)

---

## 📈 Monitoring & Analytics

### Setup Google Analytics

```typescript
// src/utils/analytics.ts
export const initAnalytics = () => {
  const GA_ID = import.meta.env.VITE_GA_TRACKING_ID;
  
  if (GA_ID && typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

### Setup Sentry (Error Tracking)

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  const DSN = import.meta.env.VITE_SENTRY_DSN;
  
  if (DSN) {
    Sentry.init({
      dsn: DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  }
};
```

---

## 🧪 Testing Before Deploy

```bash
# Type check
npm run type-check

# Build
npm run build

# Preview build locally
npm run preview

# Test in production mode
NODE_ENV=production npm run preview

# Check bundle size
npx vite-bundle-visualizer

# Lighthouse audit
npx lighthouse http://localhost:4173 --view

# Accessibility check
npx pa11y http://localhost:4173
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📱 Progressive Web App (PWA)

Add PWA support for offline capabilities:

```bash
npm install -D vite-plugin-pwa
```

```javascript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'BrainSAIT Healthcare Platform',
        short_name: 'BrainSAIT',
        description: 'Enterprise Healthcare AI Platform',
        theme_color: '#2b6cb8',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

---

## 🎯 Post-Deployment

### Verify Deployment

```bash
# Check if site is live
curl -I https://app.brainsait.com

# Test API connectivity
curl https://app.brainsait.com/api/health

# Check SSL certificate
openssl s_client -connect app.brainsait.com:443 -servername app.brainsait.com
```

### Performance Metrics

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

---

## 📞 Support

For deployment issues:
- **Email**: devops@brainsait.com
- **Documentation**: https://docs.brainsait.com/deployment
- **Status Page**: https://status.brainsait.com

---

**Built with ❤️ for healthcare excellence**

**BrainSAIT** | **برين سايت**  
*Enterprise Healthcare AI Platform*

---

*Last Updated: November 2025*  
*Version: 1.0.0*
