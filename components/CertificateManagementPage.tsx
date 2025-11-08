// BRAINSAIT: Certificate Management Page
// SECURITY: User interface for SSL/TLS certificate management
// HIPAA: Audit logging for all certificate operations

import { useState } from 'react';

interface Certificate {
  id: string;
  name: string;
  type: 'server' | 'client' | 'healthcare';
  status: 'valid' | 'expiring' | 'expired';
  issuedDate: string;
  expiryDate: string;
  commonName: string;
  organization: string;
}

export const CertificateManagementPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      name: 'api.brainsait.com',
      type: 'server',
      status: 'valid',
      issuedDate: '2025-01-01',
      expiryDate: '2026-01-11',
      commonName: 'api.brainsait.com',
      organization: 'BrainSAIT Ltd'
    },
    {
      id: '2',
      name: 'nphies-gateway.brainsait.sa',
      type: 'healthcare',
      status: 'valid',
      issuedDate: '2025-01-01',
      expiryDate: '2026-01-11',
      commonName: 'nphies-gateway.brainsait.sa',
      organization: 'BrainSAIT Ltd'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [certType, setCertType] = useState<'server' | 'client' | 'healthcare'>('server');
  const [commonName, setCommonName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCertificate = async () => {
    setIsCreating(true);
    
    try {
      // SECURITY: Call backend API to generate certificate
      const response = await fetch('/api/certificates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: certType,
          commonName: commonName,
          organization: 'BrainSAIT Ltd',
          country: 'SA',
          state: 'Riyadh',
          locality: 'Riyadh'
        })
      });

      if (response.ok) {
        const newCert = await response.json();
        setCertificates([...certificates, newCert]);
        setShowCreateModal(false);
        setCommonName('');
      }
    } catch (error) {
      console.error('Failed to create certificate:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-500';
      case 'expiring': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return '🖥️';
      case 'client': return '👤';
      case 'healthcare': return '🏥';
      default: return '📜';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      {/* BRAINSAIT: Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔐 Certificate Management
            </h1>
            <p className="text-gray-600">
              Manage SSL/TLS certificates for healthcare services
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Create Certificate
          </button>
        </div>
      </div>

      {/* BRAINSAIT: Certificate Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{getTypeIcon(cert.type)}</span>
              <span className={`${getStatusColor(cert.status)} text-white text-xs px-3 py-1 rounded-full uppercase font-semibold`}>
                {cert.status}
              </span>
            </div>

            {/* Certificate Info */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{cert.organization}</p>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-semibold capitalize">{cert.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Issued:</span>
                <span className="font-semibold">{cert.issuedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expires:</span>
                <span className="font-semibold">{cert.expiryDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                Download
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                Renew
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SECURITY: Create Certificate Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Certificate
            </h2>

            {/* Certificate Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Certificate Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['server', 'client', 'healthcare'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCertType(type)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      certType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{getTypeIcon(type)}</div>
                    <div className="text-sm font-semibold capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Common Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Common Name (CN)
              </label>
              <input
                type="text"
                value={commonName}
                onChange={(e) => setCommonName(e.target.value)}
                placeholder={
                  certType === 'server'
                    ? 'api.brainsait.com'
                    : certType === 'healthcare'
                    ? 'nphies-gateway.brainsait.sa'
                    : 'user@brainsait.com'
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* NPHIES Info for Healthcare Certs */}
            {certType === 'healthcare' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏥</span>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      NPHIES-Compliant Certificate
                    </h4>
                    <p className="text-sm text-blue-700">
                      This certificate will include BrainSAIT OID (1.3.6.1.4.1.61026.3.1)
                      and be compliant with Saudi NPHIES standards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCertificate}
                disabled={!commonName || isCreating}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIPAA: Info Panel */}
      <div className="max-w-7xl mx-auto mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <span className="text-3xl">ℹ️</span>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">HIPAA & NPHIES Compliance</h3>
            <p className="text-blue-700 text-sm">
              All certificates are generated with HIPAA-compliant security (TLS 1.2/1.3, AES-256 encryption).
              Healthcare certificates include BrainSAIT OID namespace for NPHIES compatibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
