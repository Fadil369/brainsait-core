# BrainSAIT NPHIES Integration Guide

## Overview

This guide covers integration with Saudi Arabia's **National Platform for Healthcare Information Exchange Services (NPHIES)**.

## What is NPHIES?

NPHIES is Saudi Arabia's national healthcare information exchange platform that enables:
- Healthcare claims submission and processing
- Prior authorization requests
- Eligibility verification
- Clinical data exchange
- Insurance coordination

## BrainSAIT NPHIES Compliance

### OID Registration

BrainSAIT is registered with the following OID:

```
Base OID: 1.3.6.1.4.1.61026
├── Saudi Arabia: 1.3.6.1.4.1.61026.2
│   ├── Patients: 1.3.6.1.4.1.61026.2.1
│   ├── Providers: 1.3.6.1.4.1.61026.2.2
│   ├── Organizations: 1.3.6.1.4.1.61026.2.3
│   └── Facilities: 1.3.6.1.4.1.61026.2.4
│
└── Security: 1.3.6.1.4.1.61026.3
    └── Healthcare Services: 1.3.6.1.4.1.61026.3.1
```

### FHIR R4 Compliance

BrainSAIT uses **FHIR R4** for all healthcare data exchange:

```python
# MEDICAL: Create NPHIES-compliant Patient resource
from fhir.resources.patient import Patient
from fhir.resources.identifier import Identifier

def create_nphies_patient(
    national_id: str,
    given_name: str,
    family_name: str,
    birth_date: str,
    gender: str
) -> Patient:
    """
    BRAINSAIT: Create FHIR Patient with Saudi identifiers
    NPHIES: Uses BrainSAIT OID for identification
    """
    
    patient = Patient(
        identifier=[
            # National ID
            Identifier(
                system="urn:oid:1.3.6.1.4.1.61026.2.1",
                value=national_id,
                type={
                    "coding": [{
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "NI",
                        "display": "National Identifier"
                    }]
                }
            ),
            # BrainSAIT Patient ID
            Identifier(
                system="https://brainsait.sa/fhir/patients",
                value=f"PAT-{national_id}"
            )
        ],
        name=[{
            "use": "official",
            "family": family_name,
            "given": [given_name],
            "text": f"{given_name} {family_name}"
        }],
        gender=gender,
        birthDate=birth_date,
        active=True
    )
    
    # Validate FHIR resource
    patient.validate()
    return patient
```

## NPHIES API Integration

### Authentication

NPHIES requires certificate-based authentication:

```python
# SECURITY: NPHIES authentication with BrainSAIT certificates
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.poolmanager import PoolManager
import ssl

class NPHIESAdapter(HTTPAdapter):
    """Custom adapter for NPHIES certificate authentication"""
    
    def init_poolmanager(self, *args, **kwargs):
        context = ssl.create_default_context()
        
        # BRAINSAIT: Load our healthcare service certificate
        context.load_cert_chain(
            certfile="/path/to/security/ca/certs/nphies-gateway.brainsait.sa.cert.pem",
            keyfile="/path/to/security/ca/private/nphies-gateway.brainsait.sa.key.pem"
        )
        
        # NPHIES: TLS 1.2 minimum
        context.minimum_version = ssl.TLSVersion.TLSv1_2
        
        kwargs['ssl_context'] = context
        return super().init_poolmanager(*args, **kwargs)

# Create session with certificate
session = requests.Session()
session.mount('https://', NPHIESAdapter())

# NPHIES API endpoint (production)
NPHIES_BASE_URL = "https://api.nphies.sa/fhir"

# Example: Submit claim
response = session.post(
    f"{NPHIES_BASE_URL}/Claim",
    json=claim_resource.dict(),
    headers={
        "Content-Type": "application/fhir+json",
        "Authorization": f"Bearer {access_token}"
    }
)
```

### Claim Submission

```python
# MEDICAL: Submit healthcare claim to NPHIES
from fhir.resources.claim import Claim
from fhir.resources.money import Money

def submit_nphies_claim(
    patient_id: str,
    provider_id: str,
    insurance_id: str,
    diagnosis_codes: list,
    procedure_codes: list,
    total_amount: float
) -> Claim:
    """
    NPHIES: Submit claim for processing
    BRAINSAIT: Uses BrainSAIT OID namespace
    """
    
    claim = Claim(
        status="active",
        type={
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/claim-type",
                "code": "institutional",
                "display": "Institutional"
            }]
        },
        use="claim",
        patient={"reference": f"Patient/{patient_id}"},
        created=datetime.now().isoformat(),
        provider={"reference": f"Organization/{provider_id}"},
        priority={
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/processpriority",
                "code": "normal"
            }]
        },
        insurance=[{
            "sequence": 1,
            "focal": True,
            "coverage": {"reference": f"Coverage/{insurance_id}"}
        }],
        total=Money(
            value=total_amount,
            currency="SAR"
        )
    )
    
    # Add diagnosis
    claim.diagnosis = []
    for idx, code in enumerate(diagnosis_codes, 1):
        claim.diagnosis.append({
            "sequence": idx,
            "diagnosisCodeableConcept": {
                "coding": [{
                    "system": "http://hl7.org/fhir/sid/icd-10",
                    "code": code
                }]
            }
        })
    
    # Add procedures
    claim.procedure = []
    for idx, code in enumerate(procedure_codes, 1):
        claim.procedure.append({
            "sequence": idx,
            "procedureCodeableConcept": {
                "coding": [{
                    "system": "http://www.ama-assn.org/go/cpt",
                    "code": code
                }]
            }
        })
    
    # Validate before submission
    claim.validate()
    
    # Submit to NPHIES
    response = session.post(
        f"{NPHIES_BASE_URL}/Claim",
        json=claim.dict()
    )
    
    return claim
```

### Prior Authorization

```python
# MEDICAL: Request prior authorization from NPHIES
from fhir.resources.claimresponse import ClaimResponse

def request_prior_authorization(
    patient_id: str,
    service_codes: list,
    estimated_cost: float
) -> str:
    """
    NPHIES: Request prior authorization for services
    Returns: Authorization reference number
    """
    
    auth_request = Claim(
        status="active",
        type={
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/claim-type",
                "code": "professional"
            }]
        },
        use="preauthorization",  # NPHIES: Pre-auth request
        patient={"reference": f"Patient/{patient_id}"},
        created=datetime.now().isoformat(),
        # ... other fields
    )
    
    response = session.post(
        f"{NPHIES_BASE_URL}/Claim",
        json=auth_request.dict()
    )
    
    if response.status_code == 201:
        claim_response = ClaimResponse.parse_obj(response.json())
        return claim_response.preAuthRef
    else:
        raise Exception(f"Authorization failed: {response.text}")
```

## Certificate Setup for NPHIES

### 1. Create Healthcare Service Certificate

```bash
cd /Users/fadil369/brainsait-core/security/ca
./manage-ca.sh

# Select option 4: Create Healthcare Service Certificate
# Enter: nphies-gateway.brainsait.sa
```

This creates:
- Certificate with OID: `1.3.6.1.4.1.61026.3.1`
- Dual authentication (client + server)
- NPHIES-compliant security

### 2. Register with NPHIES

1. **Submit Certificate**: Upload certificate to NPHIES portal
2. **Verify Identity**: Complete organization verification
3. **Obtain Credentials**: Receive API keys and endpoint URLs
4. **Test Connection**: Verify connectivity in sandbox

### 3. Configure BrainSAIT

```python
# config/nphies.py
NPHIES_CONFIG = {
    "base_url": "https://api.nphies.sa/fhir",
    "sandbox_url": "https://sandbox.nphies.sa/fhir",
    "cert_file": "/path/to/security/ca/certs/nphies-gateway.brainsait.sa.cert.pem",
    "key_file": "/path/to/security/ca/private/nphies-gateway.brainsait.sa.key.pem",
    "ca_file": "/path/to/security/ca/certs/brainsait-ca.cert.pem",
    "organization_id": "ORG-BRAINSAIT-001",
    "facility_id": "FAC-BRAINSAIT-001",
    "timeout": 30,
    "retry_attempts": 3
}
```

## Data Mapping

### BrainSAIT to NPHIES

| BrainSAIT Field | NPHIES Resource | FHIR Element |
|----------------|-----------------|--------------|
| Patient National ID | Patient | identifier (NI) |
| Provider License | Practitioner | identifier |
| Diagnosis Code | Claim | diagnosis.diagnosisCodeableConcept |
| Procedure Code | Claim | procedure.procedureCodeableConcept |
| Service Date | Claim | created |
| Total Amount | Claim | total.value |

## Testing

### Sandbox Environment

```python
# Test in NPHIES sandbox
NPHIES_SANDBOX = "https://sandbox.nphies.sa/fhir"

def test_nphies_connection():
    """Test connectivity to NPHIES sandbox"""
    
    response = session.get(
        f"{NPHIES_SANDBOX}/metadata",
        timeout=10
    )
    
    if response.status_code == 200:
        print("✓ NPHIES connection successful")
        capability_statement = response.json()
        print(f"  FHIR Version: {capability_statement['fhirVersion']}")
    else:
        print("✗ NPHIES connection failed")
```

### Validation

```python
# Validate FHIR resources before submission
from fhir.resources.validator import validate

def validate_for_nphies(resource):
    """Ensure resource meets NPHIES requirements"""
    
    # FHIR validation
    is_valid = validate(resource)
    
    # NPHIES-specific validation
    if isinstance(resource, Patient):
        # Must have Saudi National ID
        assert any(
            id.type.coding[0].code == "NI" 
            for id in resource.identifier
        ), "Missing National ID"
    
    return is_valid
```

## Monitoring & Logging

```python
# HIPAA: Audit all NPHIES interactions
import logging

nphies_logger = logging.getLogger('brainsait.nphies')

def log_nphies_transaction(
    transaction_type: str,
    resource_id: str,
    status: str
):
    """Log NPHIES transaction for audit trail"""
    
    nphies_logger.info({
        "timestamp": datetime.now().isoformat(),
        "type": transaction_type,
        "resource_id": resource_id,
        "status": status,
        "oid": "1.3.6.1.4.1.61026.3.1"
    })
```

## Support & Resources

### NPHIES Documentation
- Portal: https://nphies.sa.gov.sa
- Documentation: https://docs.nphies.sa
- Support: support@nphies.sa

### BrainSAIT Support
- Email: nphies-support@brainsait.com
- Documentation: https://docs.brainsait.com/nphies
- Integration Help: integration@brainsait.com

---

**BrainSAIT** | **برين سايت**  
*NPHIES Certified Healthcare Platform*  
*OID: 1.3.6.1.4.1.61026*

---

*Last Updated: November 2025*  
*NPHIES Version: 1.0*
