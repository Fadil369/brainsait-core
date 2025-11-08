# BrainSAIT Security & Certificate Authority

## 🔐 Overview

BrainSAIT includes a comprehensive Certificate Authority (CA) system designed specifically for **HIPAA-compliant** and **NPHIES-compatible** healthcare applications.

### Key Features
- ✅ **HIPAA Compliant** - Healthcare-grade security
- ✅ **NPHIES Compatible** - Saudi healthcare standards
- ✅ **BrainSAIT OID** - Registered namespace (1.3.6.1.4.1.61026)
- ✅ **Multiple Certificate Types** - Server, client, and healthcare service
- ✅ **Automated Management** - Interactive CLI tool
- ✅ **Audit Trail** - Complete certificate tracking

---

## 📁 Directory Structure

```
security/
├── ca/                      # Certificate Authority
│   ├── README.md           # Detailed CA documentation
│   ├── manage-ca.sh        # CA management script
│   ├── openssl.cnf         # OpenSSL configuration
│   ├── certs/              # Signed certificates
│   ├── private/            # Private keys (protected)
│   ├── csr/                # Certificate signing requests
│   ├── newcerts/           # Newly issued certificates
│   ├── index.txt           # Certificate database
│   └── serial              # Serial number tracker
│
├── policies/               # Security policies
│   ├── hipaa-compliance.md
│   ├── data-encryption.md
│   └── access-control.md
│
└── certificates/           # Certificate management docs
    ├── server-setup.md
    ├── client-auth.md
    └── nphies-integration.md
```

---

## 🚀 Quick Start

### 1. Initialize Certificate Authority

```bash
cd /Users/fadil369/brainsait-core/security/ca
./manage-ca.sh
# Select option 1: Initialize Root CA
```

### 2. Create Server Certificate (for HTTPS)

```bash
./manage-ca.sh
# Select option 2: Create Server Certificate
# Enter domain: api.brainsait.com
```

**Output:**
- Certificate: `certs/api.brainsait.com.cert.pem`
- Private Key: `private/api.brainsait.com.key.pem`

### 3. Create Healthcare Service Certificate (NPHIES)

```bash
./manage-ca.sh
# Select option 4: Create Healthcare Service Certificate
# Enter service name: nphies-gateway.brainsait.sa
```

This creates a **NPHIES-compliant** certificate with:
- BrainSAIT OID: `1.3.6.1.4.1.61026.3.1`
- Dual authentication: server + client
- Enhanced security for healthcare data

---

## 📜 Certificate Types

### 1. Server Certificates
**Purpose**: HTTPS/TLS for web services

**Features**:
- Valid for 375 days (HIPAA recommended)
- SHA-256 encryption
- Subject Alternative Names (SAN)
- Supports multiple domains

**Use Cases**:
- API servers (api.brainsait.com)
- Web applications (app.brainsait.com)
- Healthcare portals (portal.brainsait.sa)

### 2. Client Certificates
**Purpose**: User authentication

**Features**:
- Email protection
- Non-repudiation
- Digital signatures
- User identity verification

**Use Cases**:
- Healthcare professional authentication
- Administrative access
- API client authentication
- Secure email

### 3. Healthcare Service Certificates
**Purpose**: NPHIES-compliant healthcare services

**Features**:
- **MEDICAL**: NPHIES compliance
- **BRAINSAIT OID**: 1.3.6.1.4.1.61026.3.1
- **HIPAA**: Enhanced security
- Dual-purpose (client + server)
- Code signing capability

**Use Cases**:
- NPHIES gateway integration
- Healthcare data exchange
- Clinical systems
- PHI transmission

---

## 🔧 Integration Examples

### FastAPI (Python Backend)

```python
# SECURITY: HIPAA-compliant SSL/TLS configuration
import ssl
import uvicorn
from pathlib import Path

# BRAINSAIT: Certificate paths
CERT_DIR = Path("/Users/fadil369/brainsait-core/security/ca")
CERT_FILE = CERT_DIR / "certs/api.brainsait.com.cert.pem"
KEY_FILE = CERT_DIR / "private/api.brainsait.com.key.pem"
CA_FILE = CERT_DIR / "certs/brainsait-ca.cert.pem"

# Create SSL context
ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(
    certfile=str(CERT_FILE),
    keyfile=str(KEY_FILE)
)

# HIPAA: TLS 1.2+ only, strong ciphers
ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2
ssl_context.set_ciphers('ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS')

# Run server with SSL
uvicorn.run(
    app,
    host="0.0.0.0",
    port=443,
    ssl_context=ssl_context,
    log_config=None  # HIPAA: Custom audit logging
)
```

### Next.js (Node.js Frontend)

```typescript
// SECURITY: HTTPS server configuration
import https from 'https';
import { readFileSync } from 'fs';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// BRAINSAIT: Load certificates
const httpsOptions = {
  key: readFileSync('/path/to/security/ca/private/app.brainsait.com.key.pem'),
  cert: readFileSync('/path/to/security/ca/certs/app.brainsait.com.cert.pem'),
  ca: readFileSync('/path/to/security/ca/certs/brainsait-ca.cert.pem'),
  
  // HIPAA: Security settings
  minVersion: 'TLSv1.2',
  ciphers: 'ECDHE+AESGCM:ECDHE+CHACHA20:!aNULL:!MD5',
  honorCipherOrder: true
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(443, () => {
    console.log('> HTTPS server ready on https://app.brainsait.com:443');
  });
});
```

### Nginx Configuration

```nginx
# BRAINSAIT: HIPAA-compliant Nginx configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.brainsait.com;

    # SECURITY: Certificate configuration
    ssl_certificate /path/to/security/ca/certs/api.brainsait.com.cert.pem;
    ssl_certificate_key /path/to/security/ca/private/api.brainsait.com.key.pem;
    ssl_trusted_certificate /path/to/security/ca/certs/brainsait-ca.cert.pem;

    # HIPAA: TLS protocols and ciphers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305';
    ssl_prefer_server_ciphers on;

    # HIPAA: Session security
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # HIPAA: Enable OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.brainsait.com;
    return 301 https://$server_name$request_uri;
}
```

### Docker Compose with SSL

```yaml
version: '3.8'

services:
  brainsait-api:
    image: brainsait/api:latest
    ports:
      - "443:443"
    volumes:
      # SECURITY: Mount certificates
      - ./security/ca/certs/api.brainsait.com.cert.pem:/certs/server.cert.pem:ro
      - ./security/ca/private/api.brainsait.com.key.pem:/certs/server.key.pem:ro
      - ./security/ca/certs/brainsait-ca.cert.pem:/certs/ca.cert.pem:ro
    environment:
      - SSL_CERT_FILE=/certs/server.cert.pem
      - SSL_KEY_FILE=/certs/server.key.pem
      - SSL_CA_FILE=/certs/ca.cert.pem
      # HIPAA: Enable audit logging
      - AUDIT_LOGGING=enabled
    networks:
      - brainsait-network

networks:
  brainsait-network:
    driver: bridge
```

---

## 🔒 Security Best Practices

### 1. Private Key Protection

```bash
# SECURITY: Proper permissions
chmod 700 security/ca/private/
chmod 400 security/ca/private/*.pem

# NEVER commit private keys
echo "security/ca/private/*.pem" >> .gitignore
echo "security/ca/certs/*.pem" >> .gitignore
```

### 2. Certificate Rotation

```bash
# Check expiration dates
openssl x509 -noout -dates -in security/ca/certs/api.brainsait.com.cert.pem

# Rotate certificates 30 days before expiration
# HIPAA: Maintain certificate inventory
```

### 3. Audit Trail

All certificate operations are logged in `security/ca/index.txt`:

```bash
# HIPAA: Review certificate operations
cat security/ca/index.txt

# Format: Status Expiry Serial Subject
# V = Valid, R = Revoked, E = Expired
```

### 4. Backup Strategy

```bash
# SECURITY: Regular backups of CA
tar -czf brainsait-ca-backup-$(date +%Y%m%d).tar.gz \
    security/ca/ \
    --exclude="*.pem"

# HIPAA: Store backups securely
# Encrypted storage, access controls
```

---

## 📊 BrainSAIT OID Namespace

All certificates use the registered BrainSAIT OID:

```
Base OID: 1.3.6.1.4.1.61026

Certificate Policies:
├── 1.3.6.1.4.1.61026.3       # Security
│   └── 1.3.6.1.4.1.61026.3.1  # Healthcare Services (NPHIES)
│
Country Branches:
├── 1.3.6.1.4.1.61026.1       # Sudan
└── 1.3.6.1.4.1.61026.2       # Saudi Arabia
```

**Usage in Certificates:**
```bash
# View OID in certificate
openssl x509 -noout -text -in security/ca/certs/service.cert.pem | grep "1.3.6.1.4.1.61026"
```

---

## 🧪 Testing & Verification

### Verify Certificate

```bash
cd /Users/fadil369/brainsait-core/security/ca

# Verify against CA
openssl verify -CAfile certs/brainsait-ca.cert.pem \
    certs/api.brainsait.com.cert.pem

# View certificate details
openssl x509 -noout -text -in certs/api.brainsait.com.cert.pem
```

### Test SSL Connection

```bash
# Test HTTPS endpoint
openssl s_client -connect api.brainsait.com:443 \
    -CAfile security/ca/certs/brainsait-ca.cert.pem

# Test TLS version
openssl s_client -connect api.brainsait.com:443 -tls1_2
```

### Validate HIPAA Compliance

```bash
# Check TLS protocols
nmap --script ssl-enum-ciphers -p 443 api.brainsait.com

# Verify cipher strength
sslscan api.brainsait.com
```

---

## 📞 Support & Resources

### Documentation
- **CA Setup**: `security/ca/README.md`
- **Management Script**: `security/ca/manage-ca.sh`
- **OpenSSL Config**: `security/ca/openssl.cnf`

### HIPAA Resources
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### NPHIES Resources
- [NPHIES Portal](https://nphies.sa.gov.sa)
- [Saudi Digital Health Standards](https://www.moh.gov.sa)

### Contact
- **Security Team**: security@brainsait.com
- **Compliance**: compliance@brainsait.com
- **Technical Support**: tech@brainsait.com

---

## ⚠️ Important Notes

### HIPAA Compliance
- ✅ Use TLS 1.2 or higher only
- ✅ Strong cipher suites (AES-256, ChaCha20)
- ✅ Certificate-based authentication
- ✅ Regular security audits
- ✅ Audit logging enabled
- ✅ Encrypted PHI transmission

### NPHIES Requirements
- ✅ Valid SSL/TLS certificates
- ✅ Proper OID namespace
- ✅ Healthcare service identification
- ✅ Saudi regulatory compliance

### Production Checklist
- [ ] Root CA properly secured
- [ ] Private keys protected (chmod 400)
- [ ] Certificates validated
- [ ] Backup strategy implemented
- [ ] Monitoring and alerts configured
- [ ] Audit logging enabled
- [ ] Documentation updated
- [ ] Team trained on procedures

---

**Built with ❤️ for healthcare security**

**BrainSAIT** | **برين سايت**  
*Healthcare AI Technology Platform*  
*OID: 1.3.6.1.4.1.61026*

---

*Last Updated: November 2025*  
*Version: 1.0.0*
