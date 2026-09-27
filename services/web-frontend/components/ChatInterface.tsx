import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ChatInterfaceProps {
    fullHeight?: boolean;
}

function formatAgentMessage(content: string) {
    let formatted = content;

    // Si le message est un gros bloc de texte brut, on le restructure
    if ((formatted.match(/\n/g) || []).length < 2) {
        // Ajoute un double saut de ligne avant les numéros (ex: " 1. ", " 2. ")
        formatted = formatted.replace(/ (\d+\.) /g, '\n\n$1 ');
        // Transforme les tirets en vraies puces avec saut de ligne
        formatted = formatted.replace(/ - /g, '\n  • ');
    }

    return (
        <div className="space-y-1.5">
            {formatted.split('\n').map((line, i) => {
                const trimmed = line.trim();
                // Lignes vides
                if (!trimmed) return <div key={i} className="h-1" />;

                // Titre numéroté
                const isHeading = /^\d+\./.test(trimmed);
                // Élément de liste
                const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');

                return (
                    <div
                        key={i}
                        className={cn(
                            "leading-relaxed",
                            isHeading && "font-medium text-white mt-4 mb-1 first:mt-0",
                            isBullet && "pl-4 text-zinc-300 relative before:content-[''] before:absolute before:left-1.5 before:top-2.5 before:w-1 before:h-1 before:bg-signal before:rounded-full",
                            !isHeading && !isBullet && "text-zinc-200"
                        )}
                    >
                        {isBullet ? trimmed.substring(1).trim() : line}
                    </div>
                );
            })}
        </div>
    );
}

export function ChatInterface({ fullHeight = false }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial load from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('chat_history');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to parse chat history", e);
                setMessages([{ role: 'assistant', content: 'Hello! I am your AI maintenance assistant. How can I help you today?' }]);
            }
        } else {
            setMessages([{ role: 'assistant', content: 'Hello! I am your AI maintenance assistant. How can I help you today?' }]);
        }
    }, []);

    // Save to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const clearChat = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            const initial = [{ role: 'assistant' as const, content: 'Hello! I am your AI maintenance assistant. How can I help you today?' }];
            setMessages(initial);
            localStorage.setItem('chat_history', JSON.stringify(initial));
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'system', content: 'Error: Failed to communicate with AI service.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Please select a PDF file.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        setMessages(prev => [...prev, { role: 'system', content: `Uploading ${file.name}...` }]);

        try {
            const response = await fetch(`${API_URL}/api/chat/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Upload failed');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'system', content: `✓ ${data.message}` }]);
        } catch (error) {
            console.error(error);
            const outputError = error instanceof Error ? error.message : "Unknown error";
            setMessages(prev => [...prev, { role: 'system', content: `✗ Upload failed: ${outputError}` }]);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <Card className={cn(
            "flex flex-col w-full mx-auto gap-0 py-0 border-white/[0.06] bg-graphite relative overflow-hidden",
            fullHeight ? "h-full max-w-none" : "h-[700px] max-w-xl"
        )}>

            <CardHeader className="border-b border-white/[0.08] bg-ink px-5 py-4 sm:px-6 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-lg font-normal">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white text-neutral-950">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl tracking-[-0.02em] text-white">
                            AI Engine Assistant
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                            <span className="text-[11px] uppercase tracking-[0.08em] text-slate-400">
                                Systems Online
                            </span>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col relative">
                <div className="dot-grid-light flex-1 overflow-y-auto px-4 py-8 sm:px-8 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "flex items-start gap-4",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === 'assistant'
                                        ? "bg-signal text-neutral-950"
                                        : msg.role === 'user'
                                            ? "bg-white/10 text-white"
                                            : "bg-white/[0.04] text-slate-500"
                                )}>
                                    {msg.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>

                                {/* Bubble */}
                                <div className={cn(
                                    "relative max-w-[80%] group",
                                    msg.role === 'user' ? "items-end text-right" : "items-start"
                                )}>
                                    <div className={cn(
                                        "rounded-2xl px-5 py-4 text-[14px] leading-relaxed transition-all",
                                        msg.role === 'user'
                                            ? "bg-white text-neutral-950 rounded-tr-md whitespace-pre-wrap text-left"
                                            : msg.role === 'system'
                                                ? "bg-ink ring-1 ring-white/[0.08] text-slate-400 font-mono text-xs rounded-tl-md whitespace-pre-wrap"
                                                : "bg-coal ring-1 ring-white/[0.06] rounded-tl-md"
                                    )}>
                                        {msg.role === 'assistant' ? formatAgentMessage(msg.content) : msg.content}
                                    </div>
                                    <span className="mt-1.5 block px-1 text-[10px] uppercase tracking-[0.1em] text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">
                                        {msg.role === 'assistant' ? 'Agent' : 'User'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-slate-400"
                        >
                            <div className="w-10 h-10 rounded-full bg-signal text-neutral-950 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                            <span className="text-xs animate-pulse uppercase tracking-[0.1em]">
                                Processing Telemetry...
                            </span>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-5 border-t border-white/[0.08] bg-graphite">
                    <div className="relative max-w-4xl mx-auto flex flex-col gap-3">
                        <div className="relative group bg-ink ring-1 ring-white/[0.08] rounded-2xl transition-all focus-within:ring-signal/50 overflow-hidden">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                placeholder="Ask about equipment status, anomalies, or technical docs..."
                                disabled={isLoading}
                                aria-label="Message"
                                className="w-full bg-transparent border-none outline-none focus:ring-0 text-[15px] text-white placeholder:text-slate-500 resize-none max-h-48 min-h-[60px] p-4 custom-scrollbar"
                            />

                            <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-2 border-t border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                    />
                                    <Button
                                        variant="outline"
                                        disabled={isUploading || isLoading}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-9 shrink-0 px-3.5 text-slate-300 flex items-center gap-2 group"
                                        title="Upload Technical Manual (PDF)"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-signal" />
                                        ) : (
                                            <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        )}
                                        <span className="text-xs font-medium">Attach PDF</span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearChat}
                                        className="h-9 text-slate-500 hover:text-red-400 hover:bg-red-400/10 px-3 flex items-center gap-2"
                                        title="Clear Chat History"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden sm:inline text-xs font-medium">Clear</span>
                                    </Button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="hidden md:inline text-[11px] text-slate-600">
                                        Shift + Enter for new line
                                    </span>
                                    <Button
                                        onClick={sendMessage}
                                        disabled={isLoading || !input.trim()}
                                        className={cn(
                                            "h-9 px-4 shrink-0 transition-all duration-300 flex items-center gap-2 font-medium text-[13px]",
                                            input.trim()
                                                ? "bg-signal text-neutral-950 hover:bg-signal-strong"
                                                : "bg-white/[0.06] text-slate-500"
                                        )}
                                    >
                                        <span>Send</span>
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
