
// Base64 encoding/decoding functions for audio data.
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decodes raw PCM audio data into an AudioBuffer for playback.
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiPath = (path: string) => `${API_BASE_URL}${path}`;

interface GeminiProxyResponse {
  text: string;
  modelVersion?: string;
}

export async function generateText(prompt: string, modelName: 'gemini-2.5-flash' | 'gemini-2.5-pro'): Promise<string> {
  const response = await fetch(apiPath('/api/gemini/text'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      model: modelName,
    }),
  });

  if (!response.ok) {
    throw new Error('Gemini proxy request failed.');
  }

  const data = (await response.json()) as GeminiProxyResponse;
  if (!data.text) {
    throw new Error('Gemini proxy did not return text.');
  }
  return data.text;
}

export const geminiService = {
  async chat(prompt: string, modelName: 'gemini-2.5-flash' | 'gemini-2.5-pro' = 'gemini-2.5-flash') {
    return generateText(prompt, modelName);
  },
};
