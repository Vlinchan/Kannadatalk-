import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Chat } from '@google/genai';
import { Language, LearningMode, Message, Sender } from './types';
import { SYSTEM_PROMPTS } from './constants';
import * as GeminiService from './services/geminiService';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { ModeSelector } from './components/ModeSelector';
import { ChatInterface } from './components/ChatInterface';
import { TempleBellIcon } from './components/icons/TempleBellIcon';

const MESSAGES_PAGE_SIZE = 30;

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language | null>(null);
    const [learningMode, setLearningMode] = useState<LearningMode | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [numMessagesToShow, setNumMessagesToShow] = useState(MESSAGES_PAGE_SIZE);
    const chatSessionRef = useRef<Chat | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
    }, []);

    const messagesToShow = useMemo(() => {
        return messages.slice(-numMessagesToShow);
    }, [messages, numMessagesToShow]);

    const hasMoreMessages = useMemo(() => {
        return numMessagesToShow < messages.length;
    }, [messages.length, numMessagesToShow]);

    const loadMoreMessages = useCallback(() => {
        setNumMessagesToShow(prev => prev + MESSAGES_PAGE_SIZE);
    }, []);

    const initializeChat = useCallback(async (lang: Language, mode: LearningMode) => {
        setIsLoading(true);
        setMessages([]); // Clear previous messages
        setNumMessagesToShow(MESSAGES_PAGE_SIZE); // Reset pagination
        const systemInstruction = SYSTEM_PROMPTS[lang][mode];
        chatSessionRef.current = GeminiService.startChatSession(systemInstruction);

        try {
            const initialMessage = await GeminiService.sendMessageToChat(
                chatSessionRef.current,
                "Please greet me and give me my first lesson."
            );
            
            setMessages([{
                id: crypto.randomUUID(),
                sender: Sender.Bot,
                text: initialMessage,
            }]);
        } catch (error) {
             console.error("Failed to initialize chat:", error);
             setMessages([{
                id: crypto.randomUUID(),
                sender: Sender.Bot,
                text: "I'm sorry, I couldn't start our lesson. Please try selecting the mode again.",
            }]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLanguageSelect = (selectedLanguage: Language) => {
        setLanguage(selectedLanguage);
    };

    const handleModeSelect = (selectedMode: LearningMode) => {
        if (language) {
            setLearningMode(selectedMode);
            initializeChat(language, selectedMode);
        }
    };

    const handleSendMessage = useCallback(async (text: string) => {
        if (!chatSessionRef.current) return;

        const userMessage: Message = { id: crypto.randomUUID(), sender: Sender.User, text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const botResponseText = await GeminiService.sendMessageToChat(chatSessionRef.current, text);
            const botMessage: Message = { id: crypto.randomUUID(), sender: Sender.Bot, text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Failed to get bot response:", error);
            const errorMessage: Message = { 
                id: crypto.randomUUID(), 
                sender: Sender.Bot, 
                text: "I'm sorry, I encountered an issue. Could you please try that again?" 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePlayAudio = useCallback(async (text: string) => {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;
        
        try {
            const base64Audio = await GeminiService.textToSpeech(text);
            if (base64Audio) {
                const audioBytes = GeminiService.decode(base64Audio);
                const audioBuffer = await GeminiService.decodeAudioData(audioBytes, audioContext, 24000, 1);
                
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }

                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
            }
        } catch (error) {
            console.error("Failed to play audio:", error);
        }
    }, []);

    const resetFlow = useCallback(() => {
        setLanguage(null);
        setLearningMode(null);
        setMessages([]);
        setNumMessagesToShow(MESSAGES_PAGE_SIZE);
        chatSessionRef.current = null;
    }, []);
    
    const renderContent = () => {
        if (!language) {
            return <LanguageSelector onSelect={handleLanguageSelect} />;
        }
        if (!learningMode) {
            return <ModeSelector onSelect={handleModeSelect} />;
        }
        return (
            <ChatInterface 
                messages={messagesToShow} 
                onSendMessage={handleSendMessage} 
                onPlayAudio={handlePlayAudio} 
                isLoading={isLoading}
                hasMoreMessages={hasMoreMessages}
                onLoadMore={loadMoreMessages}
            />
        );
    };

    return (
        <div className="h-screen w-screen bg-amber-50 text-stone-800 overflow-hidden relative">
             <div className="absolute inset-0 z-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-8 transform-gpu -skew-y-12 scale-150">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <TempleBellIcon key={i} className="w-16 h-16 text-amber-900/10" />
                    ))}
                </div>
            </div>
            <div className="relative z-10 flex flex-col h-full bg-amber-50/10">
                <Header language={language} onLanguageChange={resetFlow} />
                <main className="flex-grow min-h-0">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
