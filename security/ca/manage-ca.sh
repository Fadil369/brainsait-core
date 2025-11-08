#!/bin/bash
# BRAINSAIT Certificate Authority Management Script
# HIPAA & NPHIES Compliant Healthcare Certificate Management

set -e

CA_DIR="$(cd "$(dirname "$0")" && pwd)"
CONF="$CA_DIR/openssl.cnf"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       BRAINSAIT Certificate Authority Manager       ║${NC}"
echo -e "${BLUE}║         HIPAA & NPHIES Healthcare Compliant          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo

function show_menu() {
    echo -e "${GREEN}Available Commands:${NC}"
    echo "  1. Initialize Root CA"
    echo "  2. Create Server Certificate"
    echo "  3. Create Client Certificate"
    echo "  4. Create Healthcare Service Certificate (NPHIES)"
    echo "  5. Revoke Certificate"
    echo "  6. List Certificates"
    echo "  7. Verify Certificate"
    echo "  8. Export Certificate Chain"
    echo "  9. View CA Status"
    echo "  0. Exit"
    echo
}

function init_root_ca() {
    echo -e "${BLUE}Initializing BRAINSAIT Root CA...${NC}"
    
    # Generate root CA private key
    openssl genrsa -aes256 -out "$CA_DIR/private/brainsait-ca.key.pem" 4096
    chmod 400 "$CA_DIR/private/brainsait-ca.key.pem"
    
    # Generate root CA certificate
    openssl req -config "$CONF" \
        -key "$CA_DIR/private/brainsait-ca.key.pem" \
        -new -x509 -days 7300 -sha256 -extensions v3_ca \
        -out "$CA_DIR/certs/brainsait-ca.cert.pem"
    
    chmod 444 "$CA_DIR/certs/brainsait-ca.cert.pem"
    
    echo -e "${GREEN}✓ Root CA initialized successfully${NC}"
    openssl x509 -noout -text -in "$CA_DIR/certs/brainsait-ca.cert.pem"
}

function create_server_cert() {
    echo -e "${BLUE}Creating Server Certificate...${NC}"
    read -p "Enter server name (e.g., api.brainsait.com): " SERVER_NAME
    
    # Validate input
    if [ -z "$SERVER_NAME" ]; then
        echo -e "${RED}Error: Server name cannot be empty${NC}"
        return 1
    fi
    
    # Generate private key
    echo "Generating private key..."
    openssl genrsa -out "$CA_DIR/private/$SERVER_NAME.key.pem" 2048
    chmod 400 "$CA_DIR/private/$SERVER_NAME.key.pem"
    
    # Generate CSR
    echo "Creating certificate signing request..."
    openssl req -config "$CONF" \
        -key "$CA_DIR/private/$SERVER_NAME.key.pem" \
        -new -sha256 -out "$CA_DIR/csr/$SERVER_NAME.csr.pem" \
        -subj "/C=SA/ST=Riyadh/L=Riyadh/O=BrainSAIT Ltd/OU=Healthcare Technology/CN=$SERVER_NAME"
    
    # Sign certificate
    echo "Signing certificate..."
    openssl ca -config "$CONF" -batch \
        -extensions server_cert -days 375 -notext -md sha256 \
        -in "$CA_DIR/csr/$SERVER_NAME.csr.pem" \
        -out "$CA_DIR/certs/$SERVER_NAME.cert.pem"
    
    chmod 444 "$CA_DIR/certs/$SERVER_NAME.cert.pem"
    
    echo -e "${GREEN}✓ Server certificate created: $SERVER_NAME${NC}"
    echo -e "${GREEN}  Certificate: $CA_DIR/certs/$SERVER_NAME.cert.pem${NC}"
    echo -e "${GREEN}  Private Key: $CA_DIR/private/$SERVER_NAME.key.pem${NC}"
}

function create_client_cert() {
    echo -e "${BLUE}Creating Client Certificate...${NC}"
    read -p "Enter client name (e.g., user@brainsait.com): " CLIENT_NAME
    
    # Validate input
    if [ -z "$CLIENT_NAME" ]; then
        echo -e "${RED}Error: Client name cannot be empty${NC}"
        return 1
    fi
    
    # Sanitize filename
    SAFE_NAME=$(echo "$CLIENT_NAME" | tr '@' '_')
    
    # Generate private key
    echo "Generating private key..."
    openssl genrsa -out "$CA_DIR/private/$SAFE_NAME.key.pem" 2048
    chmod 400 "$CA_DIR/private/$SAFE_NAME.key.pem"
    
    # Generate CSR
    echo "Creating certificate signing request..."
    openssl req -config "$CONF" \
        -key "$CA_DIR/private/$SAFE_NAME.key.pem" \
        -new -sha256 -out "$CA_DIR/csr/$SAFE_NAME.csr.pem" \
        -subj "/C=SA/ST=Riyadh/O=BrainSAIT Ltd/CN=$CLIENT_NAME"
    
    # Sign certificate
    echo "Signing certificate..."
    openssl ca -config "$CONF" -batch \
        -extensions usr_cert -days 375 -notext -md sha256 \
        -in "$CA_DIR/csr/$SAFE_NAME.csr.pem" \
        -out "$CA_DIR/certs/$SAFE_NAME.cert.pem"
    
    chmod 444 "$CA_DIR/certs/$SAFE_NAME.cert.pem"
    
    echo -e "${GREEN}✓ Client certificate created: $CLIENT_NAME${NC}"
    echo -e "${GREEN}  Certificate: $CA_DIR/certs/$SAFE_NAME.cert.pem${NC}"
    echo -e "${GREEN}  Private Key: $CA_DIR/private/$SAFE_NAME.key.pem${NC}"
}

function create_healthcare_cert() {
    echo -e "${BLUE}Creating NPHIES Healthcare Service Certificate...${NC}"
    read -p "Enter service name (e.g., nphies-gateway.brainsait.sa): " SERVICE_NAME
    
    # Validate input
    if [ -z "$SERVICE_NAME" ]; then
        echo -e "${RED}Error: Service name cannot be empty${NC}"
        return 1
    fi
    
    # Generate private key
    echo "Generating private key..."
    openssl genrsa -out "$CA_DIR/private/$SERVICE_NAME.key.pem" 2048
    chmod 400 "$CA_DIR/private/$SERVICE_NAME.key.pem"
    
    # Generate CSR with proper CN
    echo "Creating certificate signing request..."
    openssl req -config "$CONF" \
        -key "$CA_DIR/private/$SERVICE_NAME.key.pem" \
        -new -sha256 -out "$CA_DIR/csr/$SERVICE_NAME.csr.pem" \
        -subj "/C=SA/ST=Riyadh/L=Riyadh/O=BrainSAIT Ltd/OU=Healthcare Services/CN=$SERVICE_NAME"
    
    # Sign with healthcare extensions
    echo "Signing certificate with healthcare extensions..."
    openssl ca -config "$CONF" -batch \
        -extensions healthcare_cert -days 375 -notext -md sha256 \
        -in "$CA_DIR/csr/$SERVICE_NAME.csr.pem" \
        -out "$CA_DIR/certs/$SERVICE_NAME.cert.pem"
    
    chmod 444 "$CA_DIR/certs/$SERVICE_NAME.cert.pem"
    
    echo -e "${GREEN}✓ Healthcare service certificate created: $SERVICE_NAME${NC}"
    echo -e "${GREEN}  Certificate: $CA_DIR/certs/$SERVICE_NAME.cert.pem${NC}"
    echo -e "${GREEN}  Private Key: $CA_DIR/private/$SERVICE_NAME.key.pem${NC}"
    echo -e "${GREEN}  OID: 1.3.6.1.4.1.61026.3.1${NC}"
}

function list_certificates() {
    echo -e "${BLUE}Active Certificates:${NC}"
    cat "$CA_DIR/index.txt" | awk -F'\t' '{print $3 "\t" $6}'
}

function verify_certificate() {
    read -p "Enter certificate filename: " CERT_FILE
    openssl verify -CAfile "$CA_DIR/certs/brainsait-ca.cert.pem" "$CA_DIR/certs/$CERT_FILE"
}

function view_status() {
    echo -e "${BLUE}BRAINSAIT CA Status:${NC}"
    echo "Location: $CA_DIR"
    echo "Total Certificates: $(wc -l < "$CA_DIR/index.txt")"
    echo
    echo -e "${BLUE}Root CA Information:${NC}"
    openssl x509 -noout -subject -issuer -dates -in "$CA_DIR/certs/brainsait-ca.cert.pem"
}

# Main menu loop
while true; do
    show_menu
    read -p "Select option: " choice
    
    case $choice in
        1) init_root_ca ;;
        2) create_server_cert ;;
        3) create_client_cert ;;
        4) create_healthcare_cert ;;
        5) echo "Revocation feature - TBD" ;;
        6) list_certificates ;;
        7) verify_certificate ;;
        8) echo "Export feature - TBD" ;;
        9) view_status ;;
        0) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
    
    echo
    read -p "Press Enter to continue..."
    clear
done
