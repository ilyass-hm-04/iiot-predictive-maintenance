"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your AI maintenance assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
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
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <Card className="flex flex-col h-[600px] w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="border-b bg-muted/50 p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Assistant
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-start gap-2",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                                        msg.role === 'user'
                                            ? "bg-primary text-primary-foreground"
                                            : msg.role === 'system'
                                                ? "bg-muted/50 text-muted-foreground italic border"
                                                : "bg-muted"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={isUploading || isLoading}
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload PDF"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                        </Button>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
