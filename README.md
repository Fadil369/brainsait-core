# BrainSAIT Core - Healthcare AI Platform

<div align="center">

[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)

**Enterprise Healthcare Platform for Saudi Arabia & Sudan**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🏥 About BrainSAIT

BrainSAIT is an enterprise healthcare platform designed for **Saudi Arabia** and **Sudan**, providing **HIPAA** and **NPHIES-compliant** patient data management, clinical workflows, and healthcare analytics.

### Mission
Deliver world-class healthcare technology that seamlessly integrates with Saudi healthcare infrastructure while maintaining the highest standards of security, compliance, and user experience.

### OID System Root
`1.3.6.1.4.1.61026` - Registered BrainSAIT OID namespace
- Sudan Branch: `1.3.6.1.4.1.61026.1`
- Saudi Arabia Branch: `1.3.6.1.4.1.61026.2`

---

## ✨ Features

### 🎨 Modern UI/UX
- **Glass Morphism Design** - Modern, professional healthcare interface
- **Bilingual Support** - Full Arabic/English with RTL/LTR layouts
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Accessibility** - WCAG 2.1 Level AA compliant

### 🔐 Security & Compliance
- **HIPAA Compliant** - All PHI encrypted at rest and in transit
- **NPHIES Integration** - Saudi healthcare standards compliance
- **Certificate Authority** - Internal CA for healthcare services
- **Audit Logging** - Complete audit trail for all PHI access
- **Role-Based Access** - Granular permission controls
- **TLS 1.2/1.3** - Strong encryption for all communications

### 📊 Document Management
- **170+ Templates** - Professional business document templates
- **PDF Generation** - Automated branded document creation
- **Bilingual Documents** - Arabic/English support
- **Healthcare Focus** - HIPAA-compliant templates

### 🤖 AI Integration
- **Gemini AI Assistant** - Intelligent healthcare assistant
- **FHIR R4 Compliant** - Standard healthcare data formats
- **Clinical Decision Support** - AI-powered recommendations

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for document generation)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/Fadil369/brainsait-core.git
cd brainsait-core

# Install dependencies
npm install

# Install Python dependencies (for document generation)
pip install reportlab

# Set environment variables
cp .env.local.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run development server
npm run dev
```

### Development Server
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Project Structure

```
brainsait-core/
├── components/          # React components
│   ├── HomePage.tsx    # Main dashboard
│   ├── TemplatesPage.tsx   # Document templates
│   ├── GeminiAIAssistant.tsx  # AI assistant
│   └── ...
├── services/           # API services
│   └── geminiService.ts
├── security/           # Security & certificates
│   ├── ca/            # Certificate Authority
│   │   ├── manage-ca.sh    # CA management tool
│   │   ├── openssl.cnf     # OpenSSL config
│   │   └── README.md       # CA documentation
│   ├── HIPAA_COMPLIANCE.md # HIPAA guide
│   ├── NPHIES_INTEGRATION.md # NPHIES guide
│   └── README.md       # Security overview
├── docs/              # Business documents (18 PDFs)
│   ├── business-plans/
│   ├── proposals/
│   ├── policies/
│   ├── marketing/
│   └── sales/
├── document_templates.py  # PDF generation system
├── generate_all.py    # Batch document generator
├── package.json       # Node dependencies
├── tsconfig.json      # TypeScript config
└── vite.config.ts     # Vite config
```

---

## 📚 Documentation

### Core Documents
- **[INDEX.md](INDEX.md)** - Complete package contents and structure
- **[EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)** - Project overview
- **[QUICK_START.md](QUICK_START.md)** - Quick reference guide
- **[DELIVERY_SUMMARY.txt](DELIVERY_SUMMARY.txt)** - Delivery notes

### Business Documents (18 PDFs)
- **Business Plans** (4) - Strategic planning documents
- **Proposals** (3) - Client proposals
- **Policies** (5) - Company policies
- **Marketing Plans** (3) - Campaign plans
- **Sales Materials** (2) - Catalog and sales sheets
- **Employee Handbook** (1) - HR documentation

### Security & Certificates
- **Certificate Authority** - HIPAA-compliant CA system
- **HIPAA Compliance** - Complete compliance documentation
- **NPHIES Integration** - Saudi healthcare integration guide
- **SSL/TLS Certificates** - Healthcare service certificates

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - Modern UI framework
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool
- **Gemini AI** - AI integration

### Document Generation
- **Python 3.11+** - Backend processing
- **ReportLab** - PDF generation
- **Bilingual Support** - Arabic/English

### Design System
- **Glass Morphism** - Modern UI aesthetic
- **BrainSAIT Colors** - Professional healthcare palette
- **Responsive Layout** - Mobile-first design

---

## 📖 Usage

### Running the Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Generating Documents
```bash
# Generate all documents
python generate_all.py

# Generate specific document types
python document_templates.py
```

---

## 🎨 Design Tokens

```typescript
// BrainSAIT Official Colors
colors = {
  midnightBlue: '#1a365d',
  medicalBlue: '#2b6cb8',
  signalTeal: '#0ea5e9',
  deepOrange: '#ea580c',
  professionalGray: '#64748b',
  accentPurple: '#7c3aed',
}
```

---

## 🔒 Security

- **PHI Encryption** - All sensitive data encrypted
- **Certificate Authority** - Internal CA for healthcare services
- **Audit Trails** - Complete access logging
- **RBAC** - Role-based access control
- **Compliance** - HIPAA/NPHIES standards
- **TLS 1.2/1.3** - Strong encryption standards

### Certificate Authority

BrainSAIT includes a complete CA system for healthcare services:

```bash
cd security/ca
./manage-ca.sh

# Create certificates for:
# - HTTPS servers
# - Client authentication
# - NPHIES healthcare services
```

See [Security Documentation](security/README.md) for details.

---

## 🤝 Contributing

This is a proprietary project. For authorized contributors:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

**Copyright © 2025 BrainSAIT**

Proprietary and confidential. Unauthorized copying or distribution is prohibited.

- **OID**: 1.3.6.1.4.1.61026
- **Location**: Riyadh, Saudi Arabia
- **License**: Commercial (Proprietary)

---

## 📞 Contact

- **Website**: [brainsait.com](https://brainsait.com)
- **Email**: support@brainsait.com
- **Phone**: +966 11 XXX XXXX

---

## 🌟 Acknowledgments

Built with ❤️ by the BrainSAIT team for healthcare excellence in Saudi Arabia and Sudan.

**Making healthcare documentation elegant, compliant, and bilingual.**

---

<div align="center">

**BrainSAIT** | **برين سايت**

Healthcare AI Technology Platform

</div>
