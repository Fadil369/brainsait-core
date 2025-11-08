// BRAINSAIT: Certificate Management Service
// SECURITY: API calls for certificate operations
// HIPAA: Audit logging for all operations

export interface CertificateRequest {
  type: 'server' | 'client' | 'healthcare';
  commonName: string;
  organization: string;
  country: string;
  state: string;
  locality: string;
  email?: string;
  validity?: number; // days
}

export interface Certificate {
  id: string;
  type: 'server' | 'client' | 'healthcare';
  commonName: string;
  organization: string;
  issuedDate: string;
  expiryDate: string;
  serialNumber: string;
  fingerprint: string;
  status: 'valid' | 'expiring' | 'expired' | 'revoked';
  oid?: string; // For healthcare certificates
}

class CertificateService {
  private baseUrl = '/api/certificates';

  /**
   * SECURITY: Create a new certificate
   * HIPAA: Logs certificate creation for audit trail
   */
  async createCertificate(request: CertificateRequest): Promise<Certificate> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to create certificate');
      }

      return await response.json();
    } catch (error) {
      console.error('Certificate creation error:', error);
      throw error;
    }
  }

  /**
   * List all certificates
   */
  async listCertificates(): Promise<Certificate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/list`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to list certificates:', error);
      throw error;
    }
  }

  /**
   * Get certificate details
   */
  async getCertificate(id: string): Promise<Certificate> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch certificate');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get certificate:', error);
      throw error;
    }
  }

  /**
   * Download certificate file
   */
  async downloadCertificate(id: string, format: 'pem' | 'der' | 'p12' = 'pem'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/download?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to download certificate:', error);
      throw error;
    }
  }

  /**
   * Renew certificate
   */
  async renewCertificate(id: string, validity: number = 375): Promise<Certificate> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ validity }),
      });

      if (!response.ok) {
        throw new Error('Failed to renew certificate');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to renew certificate:', error);
      throw error;
    }
  }

  /**
   * SECURITY: Revoke certificate
   * HIPAA: Logs revocation for audit trail
   */
  async revokeCertificate(id: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to revoke certificate');
      }
    } catch (error) {
      console.error('Failed to revoke certificate:', error);
      throw error;
    }
  }

  /**
   * Verify certificate validity
   */
  async verifyCertificate(id: string): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/verify`);
      
      if (!response.ok) {
        throw new Error('Failed to verify certificate');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      throw error;
    }
  }
}

export const certificateService = new CertificateService();
