"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface N8NResponse {
    output?: string;
    text?: string;
    message?: string;
}

export function TaxChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI tax assistant. I can help you with tax-related questions, deductions, and filing guidance. How can I assist you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/tax-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId: "tax-chat-session",
                    chatInput: input.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("API Error:", errorData);
                throw new Error(errorData.error || "Failed to get response from chatbot");
            }

            const data: N8NResponse = await response.json();
            const assistantContent = data.output || data.text || data.message || "I'm sorry, I couldn't process that request.";

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: assistantContent,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <Card className="border-none shadow-md overflow-hidden h-[600px] flex flex-col sticky top-6">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-sm">
                        <MessageSquare size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Tax Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-xs text-slate-500 font-medium">Always here to help</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        {/* Avatar */}
                        <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                            message.role === "user" 
                                ? "bg-slate-900" 
                                : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        )}>
                            {message.role === "user" ? (
                                <span className="text-xs font-bold text-white">You</span>
                            ) : (
                                <Bot size={16} className="text-white" />
                            )}
                        </div>
                        
                        {/* Message Content */}
                        <div className={cn(
                            "flex flex-col max-w-[80%]",
                            message.role === "user" ? "items-end" : "items-start"
                        )}>
                            <div
                                className={cn(
                                    "px-4 py-3 text-sm leading-relaxed",
                                    message.role === "user"
                                        ? "bg-slate-900 text-white rounded-2xl rounded-tr-md"
                                        : "bg-white text-slate-700 rounded-2xl rounded-tl-md border border-slate-100 shadow-sm"
                                )}
                            >
                                {message.content}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1.5 px-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                
                {/* Loading State */}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-md border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin text-emerald-600" />
                                <span className="text-sm text-slate-500">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask anything about taxes..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 rounded-2xl transition-all outline-none text-sm placeholder:text-slate-400 disabled:opacity-50"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className="w-11 h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-40 shrink-0"
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
