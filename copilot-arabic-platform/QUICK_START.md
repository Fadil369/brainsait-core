# Copilot Arabic Platform - Quick Start

## ⚡ 5-Minute Quick Start

Get the Copilot Arabic Platform running in 5 minutes!

---

## 📦 Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

---

## 🚀 Installation

```bash
# 1. Navigate to directory
cd /Users/fadil369/brainsait-core/copilot-arabic-platform

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Add your Gemini API key
# Edit .env.local and add: VITE_GEMINI_API_KEY=your_key_here

# 5. Start development server
npm run dev
```

**Done!** Platform running at `http://localhost:3000`

---

## 🎯 What You Get

### FREE Features (No Login Required)

- 🤖 **AI Chat Assistant** - 10 queries/day
- 📝 **Basic Templates** - 5 professional documents  
- 🌐 **Bilingual** - Full Arabic/English support
- 📊 **Analytics** - Usage tracking
- ⬆️ **Upgrade Path** - Clear path to premium

---

## 📝 Usage

### 1. Chat with AI

```
1. Type your question (Arabic or English)
2. Press Enter or click Send
3. Get instant AI-powered response
4. Continue conversation naturally
```

### 2. Generate Documents

```
1. Click "Templates" tab
2. Select from 5 free templates
3. Fill in details
4. Download PDF instantly
```

### 3. Switch Languages

```
1. Click EN/AR toggle
2. Entire interface changes
3. RTL/LTR automatically handled
```

---

## 🔑 Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Add to `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```

---

## 📊 Rate Limits (Free Tier)

- **AI Queries**: 10 per day
- **Documents**: 5 per month
- **Storage**: 100 MB
- **Support**: Community

**Want more?** Upgrade to BrainSAIT Core!

---

## ⬆️ Upgrade to Premium

### Pricing

```
Startup: $99/month
├─ 1-5 users
├─ 50 documents/month
└─ Email support

Professional: $299/month ⭐
├─ 6-20 users
├─ Unlimited documents
├─ NPHIES integration
└─ Priority support

Enterprise: $499+/month
├─ 21+ users
├─ Custom features
└─ SLA guarantee
```

---

## 🛠️ Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Production build
npm run build

# Preview production
npm run preview
```

---

## 🚀 Deployment

### Quick Deploy (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Required for production:

```
VITE_API_BASE_URL=https://api.brainsait.com
VITE_GEMINI_API_KEY=your_production_key
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_CORE_URL=https://app.brainsait.com
```

---

## 📚 Documentation

- **[README.md](README.md)** - Complete overview
- **[ZERO_TO_HERO_GUIDE.md](docs/ZERO_TO_HERO_GUIDE.md)** - Detailed setup
- **[API.md](docs/API.md)** - API documentation

---

## 🆘 Troubleshooting

### Common Issues

**"API key not working"**
```bash
# Make sure key is in .env.local
VITE_GEMINI_API_KEY=your_actual_key

# Restart dev server
npm run dev
```

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**"Rate limit exceeded"**
```
# Wait 24 hours for reset
# Or upgrade to BrainSAIT Core
```

---

## 📧 Support

- **Email:** support@brainsait.com
- **Docs:** https://docs.brainsait.com/copilot
- **Community:** Join our Discord

---

## 🎉 That's It!

You now have a fully functional bilingual AI assistant running!

**Next Steps:**
1. Customize the templates
2. Add your branding
3. Deploy to production
4. Start acquiring users!

---

**Copilot Arabic** | **المساعد العربي**  
*Free AI assistant for everyone*

Built with ❤️ by BrainSAIT
