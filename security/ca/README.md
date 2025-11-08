# BRAINSAIT Certificate Authority

## Overview
This Certificate Authority (CA) is designed for BRAINSAIT healthcare platform, providing HIPAA-compliant and NPHIES-compatible SSL/TLS certificates.

## Directory Structure
```
BRAINSAIT-CA/
├── certs/              # Signed certificates
├── private/            # Private keys (protected)
├── csr/                # Certificate signing requests
├── newcerts/           # Newly issued certificates
├── index.txt           # Certificate database
├── serial              # Serial number tracker
├── openssl.cnf         # OpenSSL configuration
└── manage-ca.sh        # CA management script
```

## Quick Start

### 1. Initialize Root CA
```bash
cd "/Users/fadil369/Library/Application Support/Certificate Authority/BRAINSAIT-CA"
./manage-ca.sh
# Select option 1: Initialize Root CA
```

### 2. Create Certificates

**Server Certificate (for web services):**
```bash
./manage-ca.sh
# Select option 2: Create Server Certificate
```

**Client Certificate (for users):**
```bash
./manage-ca.sh
# Select option 3: Create Client Certificate
```

**Healthcare Service Certificate (NPHIES-compliant):**
```bash
./manage-ca.sh
# Select option 4: Create Healthcare Service Certificate
# Uses BrainSAIT OID: 1.3.6.1.4.1.61026.3.1
```

## Certificate Types

### 1. Server Certificates
- Used for HTTPS/TLS services
- Valid for 375 days
- Includes subjectAltName for multiple domains
- Supports: brainsait.com, *.brainsait.com, brainsait.sa

### 2. Client Certificates
- Used for user authentication
- Valid for 375 days
- Includes email protection
- Non-repudiation enabled

### 3. Healthcare Service Certificates
- **MEDICAL**: NPHIES-compliant certificates
- **BRAINSAIT**: Uses BrainSAIT OID (1.3.6.1.4.1.61026.3.1)
- **HIPAA**: Enhanced security for healthcare data
- Valid for 375 days
- Dual-purpose: client + server authentication

## Command Line Usage

### Create a Server Certificate Manually
```bash
cd "/Users/fadil369/Library/Application Support/Certificate Authority/BRAINSAIT-CA"

# Generate private key
openssl genrsa -out private/server.key.pem 2048

# Generate CSR
openssl req -config openssl.cnf \
    -key private/server.key.pem \
    -new -sha256 -out csr/server.csr.pem \
    -subj "/C=SA/ST=Riyadh/O=BrainSAIT Ltd/CN=api.brainsait.com"

# Sign certificate
openssl ca -config openssl.cnf \
    -extensions server_cert -days 375 -notext -md sha256 \
    -in csr/server.csr.pem \
    -out certs/server.cert.pem
```

### Verify a Certificate
```bash
openssl verify -CAfile certs/brainsait-ca.cert.pem certs/server.cert.pem
```

### View Certificate Details
```bash
openssl x509 -noout -text -in certs/server.cert.pem
```

### Export Certificate with Chain
```bash
cat certs/server.cert.pem certs/brainsait-ca.cert.pem > certs/server-chain.pem
```

## Integration with Applications

### FastAPI (Python)
```python
import ssl
import uvicorn

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(
    certfile="/path/to/BRAINSAIT-CA/certs/server.cert.pem",
    keyfile="/path/to/BRAINSAIT-CA/private/server.key.pem"
)

uvicorn.run(app, host="0.0.0.0", port=443, ssl_context=ssl_context)
```

### Next.js (Node.js)
```javascript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/path/to/BRAINSAIT-CA/private/server.key.pem'),
  cert: fs.readFileSync('/path/to/BRAINSAIT-CA/certs/server.cert.pem'),
  ca: fs.readFileSync('/path/to/BRAINSAIT-CA/certs/brainsait-ca.cert.pem')
};

https.createServer(options, app).listen(443);
```

### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name api.brainsait.com;

    ssl_certificate /path/to/BRAINSAIT-CA/certs/server.cert.pem;
    ssl_certificate_key /path/to/BRAINSAIT-CA/private/server.key.pem;
    ssl_trusted_certificate /path/to/BRAINSAIT-CA/certs/brainsait-ca.cert.pem;

    # HIPAA-compliant SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

## Security Best Practices

### 1. Private Key Protection
- Private keys are stored in `private/` with 400 permissions
- Never share or commit private keys
- Use strong passphrases for root CA key

### 2. Certificate Rotation
- Certificates valid for 375 days (HIPAA recommended)
- Rotate certificates 30 days before expiration
- Maintain certificate inventory in `index.txt`

### 3. Audit Trail
- All certificate operations logged
- Review `index.txt` regularly
- Monitor certificate expiration dates

### 4. HIPAA Compliance
- Use TLS 1.2 or higher only
- Strong cipher suites (AES-256)
- Certificate-based authentication for healthcare services
- Regular security audits

## BrainSAIT OID Usage

All healthcare certificates include the BrainSAIT OID:
- **Base OID**: 1.3.6.1.4.1.61026
- **Certificate Policy OID**: 1.3.6.1.4.1.61026.3.1

This ensures NPHIES compliance and proper identification in Saudi healthcare systems.

## Troubleshooting

### Permission Denied
```bash
chmod 700 private/
chmod 400 private/*.pem
```

### Serial Number Issues
```bash
echo "1000" > serial
```

### Reset CA Database
```bash
# Backup first!
cp index.txt index.txt.backup
> index.txt
echo "1000" > serial
```

## Maintenance

### Weekly Tasks
- Review certificate expiration dates
- Check `index.txt` for anomalies
- Backup CA files

### Monthly Tasks
- Security audit of issued certificates
- Review and update certificate policies
- Test certificate validation

### Backup Strategy
```bash
# Backup entire CA
tar -czf brainsait-ca-backup-$(date +%Y%m%d).tar.gz \
    "/Users/fadil369/Library/Application Support/Certificate Authority/BRAINSAIT-CA"
```

## Support

For issues or questions:
- Email: security@brainsait.com
- Documentation: https://docs.brainsait.com/security/certificates
- Internal: BRAINSAIT Security Team

---

**Remember**: This CA handles sensitive healthcare infrastructure. All operations should be logged and reviewed for HIPAA compliance.
