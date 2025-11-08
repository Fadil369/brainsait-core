import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from './Icon';
import { IconName } from '../constants';
import { encode, decode, decodeAudioData } from '../services/geminiService';

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

interface GeminiAIAssistantProps {
    onClose: () => void;
}

type EncodedAudioChunk = {
    data: string;
    mimeType: string;
};

interface LiveServerPayload {
    serverContent?: {
        modelTurn?: ModelTurn;
        inputTranscription?: Transcription;
        outputTranscription?: Transcription;
        turnComplete?: boolean;
    };
}

type ModelTurn = {
    parts?: Array<{
        text?: string;
        inlineData?: {
            data?: string;
            mimeType?: string;
        };
    }>;
};

type Transcription = {
    text?: string;
    finished?: boolean;
};

type SocketEnvelope =
    | { type: 'status'; status: string }
    | { type: 'error'; message?: string }
    | { type: 'gemini'; payload: LiveServerPayload };

const deriveWsUrl = (): string => {
    const explicitWs = import.meta.env.VITE_WS_BASE_URL as string | undefined;
    if (explicitWs) {
        return `${explicitWs.replace(/\/$/, '')}/ws/gemini-live`;
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
    if (apiBase) {
        const wsBase = apiBase.replace(/\/$/, '').replace(/^http/i, apiBase.startsWith('https') ? 'wss' : 'ws');
        return `${wsBase}/ws/gemini-live`;
    }
    if (typeof window !== 'undefined') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}/ws/gemini-live`;
    }
    return 'ws://localhost:4000/ws/gemini-live';
};

export const GeminiAIAssistant: React.FC<GeminiAIAssistantProps> = ({ onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<{ user: string; model: string }[]>([]);
    const [currentInterim, setCurrentInterimState] = useState('');

    const currentInterimRef = useRef('');
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextAudioStartRef = useRef(0);
    const wsRef = useRef<WebSocket | null>(null);
    const outboundQueueRef = useRef<EncodedAudioChunk[]>([]);

    const updateCurrentInterim = useCallback((value: string) => {
        currentInterimRef.current = value;
        setCurrentInterimState(value);
    }, []);

    const resetCurrentInterim = useCallback(() => {
        updateCurrentInterim('');
    }, [updateCurrentInterim]);

    const finalizeUserTurn = useCallback(
        (overrideText?: string) => {
            const text = (overrideText ?? currentInterimRef.current).trim();
            if (!text) {
                return;
            }
            setTranscription(prev => [...prev, { user: text, model: '' }]);
            resetCurrentInterim();
        },
        [resetCurrentInterim]
    );

    const appendModelResponse = useCallback((modelText: string) => {
        const text = modelText.trim();
        if (!text) return;
        setTranscription(prev => {
            if (prev.length === 0) {
                return [{ user: 'Copilot Arabic', model: text }];
            }
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            const lastEntry = updated[lastIndex];
            updated[lastIndex] = {
                ...lastEntry,
                model: lastEntry.model ? `${lastEntry.model}\n${text}` : text,
            };
            return updated;
        });
    }, []);

    const flushAudioQueue = useCallback(() => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        while (outboundQueueRef.current.length > 0) {
            const chunk = outboundQueueRef.current.shift();
            if (chunk) {
                ws.send(JSON.stringify({ type: 'audio', data: chunk.data, mimeType: chunk.mimeType }));
            }
        }
    }, []);

    const queueAudioChunk = useCallback((chunk: EncodedAudioChunk) => {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'audio', data: chunk.data, mimeType: chunk.mimeType }));
        } else {
            outboundQueueRef.current.push(chunk);
        }
    }, []);

    const closeWebSocket = useCallback(() => {
        const ws = wsRef.current;
        if (ws) {
            try {
                ws.send(JSON.stringify({ type: 'control', action: 'stop' }));
            } catch {
                // ignore
            }
            ws.close();
        }
        wsRef.current = null;
        outboundQueueRef.current = [];
    }, []);

    const cleanup = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        closeWebSocket();
        setIsRecording(false);
        resetCurrentInterim();
        setTranscription([]);
    }, [closeWebSocket, resetCurrentInterim]);

    const handleGeminiPayload = useCallback(
        async (payload: LiveServerPayload) => {
            const serverContent = payload.serverContent;
            if (!serverContent) return;

            const inputTranscription = serverContent.inputTranscription;
            if (inputTranscription?.text) {
                updateCurrentInterim(inputTranscription.text);
                if (inputTranscription.finished) {
                    finalizeUserTurn(inputTranscription.text);
                }
            }

            if (serverContent.turnComplete) {
                finalizeUserTurn();
            }

            const serverText =
                serverContent.outputTranscription?.text ||
                extractTextFromModelTurn(serverContent.modelTurn);
            if (serverText) {
                appendModelResponse(serverText);
            }

            const inlineAudio = findInlineAudio(serverContent.modelTurn);
            if (inlineAudio && outputAudioContextRef.current) {
                nextAudioStartRef.current = Math.max(nextAudioStartRef.current, outputAudioContextRef.current.currentTime);
                const audioBuffer = await decodeAudioData(
                    decode(inlineAudio.data),
                    outputAudioContextRef.current,
                    24000,
                    1
                );
                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContextRef.current.destination);
                source.start(nextAudioStartRef.current);
                nextAudioStartRef.current += audioBuffer.duration;
            }
        },
        [appendModelResponse, finalizeUserTurn, updateCurrentInterim]
    );

    const connectWebSocket = useCallback(() => {
        const wsUrl = deriveWsUrl();
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnecting(false);
            setIsRecording(true);
            flushAudioQueue();
        };

        ws.onmessage = event => {
            try {
                const payload = JSON.parse(event.data) as SocketEnvelope;
                if (payload.type === 'error') {
                    setError(payload.message ?? 'Gemini connection error.');
                } else if (payload.type === 'status' && payload.status === 'closed') {
                    setIsRecording(false);
                } else if (payload.type === 'gemini') {
                    handleGeminiPayload(payload.payload);
                }
            } catch (err) {
                console.error('Failed to parse Gemini socket message', err);
            }
        };

        ws.onerror = () => {
            setError('Gemini connection error.');
        };

        ws.onclose = () => {
            setIsRecording(false);
            wsRef.current = null;
        };
    }, [flushAudioQueue, handleGeminiPayload]);

    const startConversation = useCallback(async () => {
        setError(null);
        setIsConnecting(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = inputAudioContext;

            const outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            outputAudioContextRef.current = outputAudioContext;
            nextAudioStartRef.current = 0;

            connectWebSocket();

            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = event => {
                const inputData = event.inputBuffer.getChannelData(0);
                const chunk = createAudioChunk(inputData);
                queueAudioChunk(chunk);
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to start microphone: ${err.message}`);
            } else {
                setError('An unknown error occurred.');
            }
            setIsConnecting(false);
            cleanup();
        }
    }, [cleanup, connectWebSocket, queueAudioChunk]);

    const stopConversation = useCallback(() => {
        cleanup();
    }, [cleanup]);

    useEffect(() => {
        startConversation();
        return () => {
            stopConversation();
        };
    }, [startConversation, stopConversation]);

    const handleToggleRecord = () => {
        if (isRecording) {
            stopConversation();
        } else {
            startConversation();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-bib-dark-2 rounded-lg shadow-xl w-full max-w-md m-4 flex flex-col" style={{ height: '600px' }}>
                <header className="flex items-center justify-between p-4 border-b border-bib-dark-3">
                    <div className="flex items-center space-x-2">
                        <Icon name={IconName.Sparkles} className="w-6 h-6 text-purple-400" />
                        <h2 className="text-lg font-semibold">Gemini AI Assistant</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-bib-dark-3">
                        <Icon name={IconName.X} className="w-5 h-5 text-bib-light" />
                    </button>
                </header>

                <main className="flex-1 p-4 overflow-y-auto space-y-4">
                    {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm">{error}</div>}
                    <div className="text-center text-bib-light text-sm p-4 bg-bib-dark-3 rounded-md">
                        <p>I'm ready to help. Start speaking to ask me anything about your business.</p>
                    </div>

                    {transcription.map((t, i) => (
                        <div key={i} className="text-sm">
                            <p>
                                <span className="font-bold text-blue-400">You:</span> {t.user}
                            </p>
                            {t.model && (
                                <p>
                                    <span className="font-bold text-purple-400">Gemini:</span> {t.model}
                                </p>
                            )}
                        </div>
                    ))}
                    {currentInterim && <p className="text-sm text-bib-light italic">You: {currentInterim}</p>}
                </main>

                <footer className="p-4 border-t border-bib-dark-3 flex flex-col items-center justify-center">
                    <button
                        onClick={handleToggleRecord}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${
                            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isConnecting ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                            <Icon name={isRecording ? IconName.StopCircle : IconName.Microphone} className="w-8 h-8 text-white" />
                        )}
                    </button>
                    <p className="text-sm text-bib-light mt-2">{isConnecting ? 'Connecting...' : isRecording ? 'Recording...' : 'Click to start recording'}</p>
                </footer>
            </div>
        </div>
    );
};

const createAudioChunk = (data: Float32Array): EncodedAudioChunk => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
};

const extractTextFromModelTurn = (modelTurn?: ModelTurn): string => {
    if (!modelTurn?.parts) return '';
    return modelTurn.parts
        .map(part => part.text?.trim())
        .filter(Boolean)
        .join('\n');
};

const findInlineAudio = (modelTurn?: ModelTurn): { data: string } | null => {
    if (!modelTurn?.parts) return null;
    for (const part of modelTurn.parts) {
        if (part.inlineData?.data && part.inlineData.mimeType?.startsWith('audio/')) {
            return { data: part.inlineData.data };
        }
    }
    return null;
};
