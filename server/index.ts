import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { WebSocketServer, type WebSocket } from 'ws';
import { Blob } from 'buffer';
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

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
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
