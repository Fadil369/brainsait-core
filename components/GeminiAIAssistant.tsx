
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenAIBlob } from "@google/genai";
import { Icon } from './Icon';
import { IconName } from '../constants';
import { encode, decode, decodeAudioData } from '../services/geminiService';

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext
    }
}
interface GeminiAIAssistantProps {
    onClose: () => void;
}

export const GeminiAIAssistant: React.FC<GeminiAIAssistantProps> = ({ onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<{user: string, model: string}[]>([]);
    const [currentInterim, setCurrentInterim] = useState('');

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    
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
        
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        setIsRecording(false);
        
    }, []);

    const startConversation = useCallback(async () => {
        setError(null);
        setIsConnecting(true);

        if (!process.env.API_KEY) {
            setError("API key not found. Please set the API_KEY environment variable.");
            setIsConnecting(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = inputAudioContext;
            
            const outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            outputAudioContextRef.current = outputAudioContext;
            let nextStartTime = 0;


            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnecting(false);
                        setIsRecording(true);
                        
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setCurrentInterim(message.serverContent.inputTranscription.text);
                        }

                        if (message.serverContent?.turnComplete) {
                           setTranscription(prev => [...prev, {user: currentInterim, model: ''}]);
                           setCurrentInterim('');
                        }
                        
                        const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64EncodedAudioString) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(
                                decode(base64EncodedAudioString),
                                outputAudioContext,
                                24000,
                                1,
                            );
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.destination);
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        setError(`An error occurred: ${e.message}`);
                        cleanup();
                    },
                    onclose: () => {
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: "You are a friendly and helpful business assistant for the 'Business in a Box' application.",
                },
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to start microphone: ${err.message}`);
            } else {
                setError("An unknown error occurred.");
            }
            setIsConnecting(false);
        }
    }, [cleanup, currentInterim]);

    const stopConversation = useCallback(() => {
        cleanup();
    }, [cleanup]);

    const createBlob = (data: Float32Array): GenAIBlob => {
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

    useEffect(() => {
        startConversation();
        return () => {
            stopConversation();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleRecord = () => {
        if (isRecording) {
            stopConversation();
        } else {
            startConversation();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-bib-dark-2 rounded-lg shadow-xl w-full max-w-md m-4 flex flex-col" style={{height: '600px'}}>
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
                            <p><span className="font-bold text-blue-400">You:</span> {t.user}</p>
                            {t.model && <p><span className="font-bold text-purple-400">Gemini:</span> {t.model}</p>}
                        </div>
                    ))}
                    {currentInterim && <p className="text-sm text-bib-light italic">You: {currentInterim}</p>}
                </main>

                <footer className="p-4 border-t border-bib-dark-3 flex flex-col items-center justify-center">
                    <button onClick={handleToggleRecord} className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                       {isConnecting ? 
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div> :
                        <Icon name={isRecording ? IconName.StopCircle : IconName.Microphone} className="w-8 h-8 text-white"/>
                        }
                    </button>
                    <p className="text-sm text-bib-light mt-2">
                        {isConnecting ? "Connecting..." : (isRecording ? "Recording..." : "Click to start recording")}
                    </p>
                </footer>
            </div>
        </div>
    );
};
