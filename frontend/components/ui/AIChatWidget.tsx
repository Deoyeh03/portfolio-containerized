"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useEffect } from "react";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function AIChatWidget() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm the AI assistant for this portfolio. I can explain the architecture behind the projects or summarize development details. What would you like to know?" }
    ]);
    const [input, setInput] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await api.post("/ai/ask", {
                userQuestion: userMsg,
                context: "This is a portfolio AI assistant. Be professional, concise, and highlight backend expertise."
            });

            setMessages((prev) => [
                ...prev,
                { role: "ai", content: response.data.answer }
            ]);
        } catch (error: any) {
            let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later!";
            
            // Check for rate limiting
            if (error.response?.status === 429 || error.response?.data?.message?.includes("high traffic")) {
                errorMessage = "I'm currently experiencing high traffic. Please try asking again in a moment.";
            } 
            // Check for connection errors
            else if (error.code === "ERR_NETWORK" || !error.response) {
                errorMessage = "I can't reach the brain right now. Please check your connection and try again.";
            }
            // Check for server errors
            else if (error.response?.status >= 500) {
                errorMessage = "The AI service is temporarily unavailable. Please try again in a few moments.";
            }

            setMessages((prev) => [
                ...prev,
                { role: "ai", content: errorMessage }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <>
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-black rounded-full shadow-lg shadow-primary/20 flex items-center justify-center border border-white/20"
            >
                <Sparkles className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-background border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="font-bold text-white text-sm">Portfolio AI</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-primary text-black rounded-tr-none"
                                            : "bg-white/10 text-white rounded-tl-none"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about my skills..."
                                    className="w-full bg-black/50 border border-white/10 rounded-full py-3 px-4 text-sm text-white focus:outline-none focus:border-primary transition-colors pr-10"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-black transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
