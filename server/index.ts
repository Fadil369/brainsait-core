import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { WebSocketServer, type WebSocket } from 'ws';
import { Blob } from 'buffer';
import { randomUUID } from 'crypto';
import { GoogleGenAI, Modality, type LiveServerMessage, type Session } from '@google/genai';
import { COPILOT_SYSTEM_PROMPT } from '../copilotConfig';

const PORT = Number(process.env.SERVER_PORT) || 4000;
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
  : undefined;

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: corsOrigins || true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('combined'));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is required for the Gemini proxy server.');
}

const ai = new GoogleGenAI({ apiKey });

const auditLog = (event: string, payload: Record<string, unknown>) => {
  console.info(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      ...payload,
    })
  );
};

type CertificateRecord = {
  id: string;
  type: 'server' | 'client' | 'healthcare';
  commonName: string;
  organization: string;
  issuedDate: string;
  expiryDate: string;
  serialNumber: string;
  fingerprint: string;
  status: 'valid' | 'expiring' | 'expired' | 'revoked';
  oid?: string;
};

type DocumentTemplateRecord = {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
  requiredFields: string[];
  supportedLanguages: ('en' | 'ar')[];
};

type GeneratedDocumentRecord = {
  id: string;
  templateId: string;
  title: string;
  language: 'en' | 'ar';
  generatedDate: string;
  author: string;
  fileUrl: string;
  fileSize: number;
};

const certificates: CertificateRecord[] = [
  {
    id: randomUUID(),
    type: 'server',
    commonName: 'api.brainsait.com',
    organization: 'BrainSAIT Ltd',
    issuedDate: '2025-01-01',
    expiryDate: '2026-01-11',
    serialNumber: 'BRSAIT-001',
    fingerprint: 'AA:BB:CC:DD',
    status: 'valid',
    oid: '1.3.6.1.4.1.61026.2.1',
  },
  {
    id: randomUUID(),
    type: 'healthcare',
    commonName: 'nphies-gateway.brainsait.sa',
    organization: 'BrainSAIT Ltd',
    issuedDate: '2025-02-15',
    expiryDate: '2026-02-25',
    serialNumber: 'BRSAIT-002',
    fingerprint: 'EE:FF:00:11',
    status: 'valid',
    oid: '1.3.6.1.4.1.61026.2.9',
  },
];

const documentTemplates: DocumentTemplateRecord[] = [
  {
    id: 'business-plan',
    name: 'Business Plan',
    nameAr: 'خطة العمل',
    category: 'Strategy',
    description: '3-year strategic business plan with financial projections',
    icon: '📊',
    tags: ['strategy', 'finance', 'planning'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar'],
  },
  {
    id: 'proposal',
    name: 'Business Proposal',
    nameAr: 'عرض تجاري',
    category: 'Sales',
    description: 'Professional client proposal with pricing and timeline',
    icon: '📝',
    tags: ['sales', 'client', 'proposal'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar'],
  },
  {
    id: 'policy',
    name: 'Company Policy',
    nameAr: 'سياسة الشركة',
    category: 'Administration',
    description: 'HIPAA-compliant company policy document',
    icon: '📋',
    tags: ['policy', 'compliance', 'HIPAA'],
    requiredFields: ['department', 'title'],
    supportedLanguages: ['en', 'ar'],
  },
];

const generatedDocuments: GeneratedDocumentRecord[] = [];
const generatedFiles = new Map<string, Buffer>();

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/certificates/list', (_req, res) => {
  res.json(certificates);
});

app.post('/api/certificates/create', (req, res) => {
  const { type, commonName, organization, country } = req.body ?? {};

  if (!type || !commonName) {
    return res.status(400).json({ error: 'type and commonName are required' });
  }

  const newCert: CertificateRecord = {
    id: randomUUID(),
    type,
    commonName,
    organization: organization || 'BrainSAIT Ltd',
    issuedDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 375).toISOString().split('T')[0],
    serialNumber: `BRSAIT-${Math.floor(Math.random() * 1000)}`,
    fingerprint: `${Math.random().toString(16).slice(2, 6)}:${Math.random().toString(16).slice(2, 6)}`,
    status: 'valid',
    oid: country === 'SD' ? '1.3.6.1.4.1.61026.1.1' : '1.3.6.1.4.1.61026.2.1',
  };

  certificates.push(newCert);
  auditLog('certificate_created', { id: newCert.id, type: newCert.type });
  res.status(201).json(newCert);
});

app.get('/api/certificates/:id', (req, res) => {
  const cert = certificates.find(c => c.id === req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  res.json(cert);
});

app.get('/api/certificates/:id/download', (req, res) => {
  const cert = certificates.find(c => c.id === req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  const pem = `-----BEGIN CERTIFICATE-----
${Buffer.from(`${cert.commonName}-${cert.serialNumber}`).toString('base64')}
-----END CERTIFICATE-----`;

  res
    .type('application/x-pem-file')
    .attachment(`${cert.commonName}.pem`)
    .send(pem);
});

app.post('/api/certificates/:id/renew', (req, res) => {
  const cert = certificates.find(c => c.id === req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  const validity = req.body?.validity ?? 375;
  cert.expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * validity).toISOString().split('T')[0];
  cert.status = 'valid';
  auditLog('certificate_renewed', { id: cert.id, expiryDate: cert.expiryDate });
  res.json(cert);
});

app.post('/api/certificates/:id/revoke', (req, res) => {
  const cert = certificates.find(c => c.id === req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  cert.status = 'revoked';
  auditLog('certificate_revoked', { id: cert.id });
  res.status(204).end();
});

app.get('/api/certificates/:id/verify', (req, res) => {
  const cert = certificates.find(c => c.id === req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  const valid = cert.status === 'valid';
  res.json({
    valid,
    message: valid ? 'Certificate is valid and trusted.' : 'Certificate is not valid.',
  });
});

app.get('/api/documents/templates', (req, res) => {
  const { category } = req.query;
  if (category && typeof category === 'string' && category !== 'all') {
    return res.json(documentTemplates.filter(template => template.category === category));
  }
  res.json(documentTemplates);
});

app.get('/api/documents/templates/:id', (req, res) => {
  const template = documentTemplates.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

app.get('/api/documents/list', (_req, res) => {
  res.json(generatedDocuments);
});

app.post('/api/documents/generate', (req, res) => {
  const { templateId, language, department, title, author, customContent } = req.body ?? {};
  const template = documentTemplates.find(t => t.id === templateId);

  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const documentId = randomUUID();
  const buffer = Buffer.from(
    `BrainSAIT Document\nTemplate: ${template.name}\nDepartment: ${department}\nTitle: ${title}\nAuthor: ${author}\nLanguage: ${language}\nNotes: ${customContent || 'N/A'}`
  );

  generatedDocuments.push({
    id: documentId,
    templateId,
    title,
    language,
    generatedDate: new Date().toISOString(),
    author,
    fileUrl: `/api/documents/${documentId}/download`,
    fileSize: buffer.length,
  });
  generatedFiles.set(documentId, buffer);
  auditLog('document_generated', { templateId, language });

  res
    .setHeader('Content-Type', 'application/pdf')
    .setHeader('Content-Disposition', `attachment; filename="${templateId}-${language}.pdf"`)
    .send(buffer);
});

app.get('/api/documents/:id/download', (req, res) => {
  const file = generatedFiles.get(req.params.id);
  if (!file) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res
    .setHeader('Content-Type', 'application/pdf')
    .setHeader('Content-Disposition', `attachment; filename="document-${req.params.id}.pdf"`)
    .send(file);
});

app.delete('/api/documents/:id', (req, res) => {
  const index = generatedDocuments.findIndex(doc => doc.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }
  generatedDocuments.splice(index, 1);
  generatedFiles.delete(req.params.id);
  auditLog('document_deleted', { id: req.params.id });
  res.status(204).end();
});

app.post('/api/gemini/text', async (req, res) => {
  const { prompt, model = 'gemini-2.5-pro', locale = process.env.COPILOT_LOCALE ?? 'ar-SA', userRole = 'provider' } =
    req.body ?? {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  auditLog('gemini_text_request', {
    userRole,
    locale,
    model,
  });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const text = response.text ?? '';

    auditLog('gemini_text_response', {
      modelVersion: response.modelVersion,
      usage: response.usageMetadata,
    });

    return res.json({
      text,
      modelVersion: response.modelVersion,
      usage: response.usageMetadata,
    });
  } catch (error) {
    console.error('Gemini text proxy failed', error);
    return res.status(500).json({ error: 'Gemini text proxy failed.' });
  }
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/gemini-live' });

type AudioChunk = { data: string; mimeType?: string };

const sendAudioChunk = (session: Session, chunk: AudioChunk) => {
  const buffer = Buffer.from(chunk.data, 'base64');
  const blob = new Blob([buffer], { type: chunk.mimeType ?? 'audio/pcm;rate=16000' });
  session.sendRealtimeInput({ media: blob });
};

wss.on('connection', (socket: WebSocket, request) => {
  auditLog('gemini_live_connection', { ip: request.socket.remoteAddress });

  let liveSession: Session | null = null;
  const chunkQueue: AudioChunk[] = [];

  const flushQueue = () => {
    if (!liveSession) return;
    while (chunkQueue.length > 0) {
      const next = chunkQueue.shift();
      if (next) {
        sendAudioChunk(liveSession, next);
      }
    }
  };

  ai.live
    .connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO, Modality.TEXT],
        inputAudioTranscription: {},
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: COPILOT_SYSTEM_PROMPT,
      },
      callbacks: {
        onopen: () => {
          socket.send(JSON.stringify({ type: 'status', status: 'connected' }));
        },
        onmessage: (message: LiveServerMessage) => {
          socket.send(
            JSON.stringify({
              type: 'gemini',
              payload: message,
            })
          );
        },
        onerror: (event: { message: string }) => {
          socket.send(
            JSON.stringify({
              type: 'error',
              message: event.message,
            })
          );
          socket.close();
        },
        onclose: () => {
          socket.send(JSON.stringify({ type: 'status', status: 'closed' }));
          socket.close();
        },
      },
    })
    .then(session => {
      liveSession = session;
      flushQueue();
      auditLog('gemini_live_ready', { session: true });
    })
    .catch(error => {
      console.error('Failed to open Gemini live session', error);
      socket.send(
        JSON.stringify({
          type: 'error',
          message: 'Unable to establish Gemini live session.',
        })
      );
      socket.close();
    });

  socket.on('message', raw => {
    try {
      const data = JSON.parse(raw.toString()) as { type: string; [key: string]: unknown };
      if (data.type === 'audio' && typeof data.data === 'string') {
        const chunk: AudioChunk = { data: data.data, mimeType: typeof data.mimeType === 'string' ? data.mimeType : undefined };
        if (liveSession) {
          sendAudioChunk(liveSession, chunk);
        } else {
          chunkQueue.push(chunk);
        }
      } else if (data.type === 'control' && data.action === 'stop') {
        liveSession?.close();
        socket.close();
      }
    } catch (error) {
      console.error('Failed to parse WS payload', error);
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid payload received.' }));
    }
  });

  socket.on('close', () => {
    auditLog('gemini_live_disconnected', { ip: request.socket.remoteAddress });
    liveSession?.close();
  });

  socket.on('error', err => {
    console.error('WebSocket error', err);
    liveSession?.close();
  });
});

server.listen(PORT, () => {
  console.log(`BrainSAIT Gemini proxy listening on port ${PORT}`);
});
