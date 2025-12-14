"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { Send, Bot, User, Sparkles, Paperclip, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { ModelContext } from "../app/layout";
import { AI_MODELS } from "../data/models";

export default function ChatInterface() {
    const { model, setModel, messages, setMessages, input, setInput, isLoading, setIsLoading } = useContext(ModelContext);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter "New" or popular models for the dashboard
    const featuredModels = [
        AI_MODELS.find(m => m.id === "gemini-3-pro"),
        AI_MODELS.find(m => m.id === "gpt-5-2"),
        AI_MODELS.find(m => m.id === "flux-1-pro"),
        AI_MODELS.find(m => m.id === "codestral-mamba"),
    ].filter(Boolean);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async (text?: string) => {
        const contentToSend = text || input;
        if (!contentToSend.trim()) return;

        const newMsg = {
            role: "user",
            content: contentToSend,
            id: Date.now().toString(),
        };

        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setIsLoading(true);

        // Simulate AI response based on selected model
        const selectedModel = AI_MODELS.find(m => m.id === model) || AI_MODELS[0];
        const isImageModel = selectedModel.category === "image";
        const isCodeModel = selectedModel.category === "code";

        setTimeout(() => {
            let responseContent = `**${selectedModel.name}** tarafından oluşturuldu.\n\n`;

            if (isImageModel) {
                responseContent += "🎨 Görsel oluşturuluyor... (Simülasyon)\n\n![Generated Image](https://via.placeholder.com/512x512.png?text=Created+by+" + encodeURIComponent(selectedModel.name) + ")";
            } else if (isCodeModel) {
                responseContent += "İşte istediğiniz kod bloğu:\n\n```typescript\nfunction example() {\n  console.log('Hello from " + selectedModel.name + "!');\n}\n```\n\nBu kod " + selectedModel.name + " modeli ile optimize edilmiştir.";
            } else {
                // Text models
                if (contentToSend.toLowerCase().includes("merhaba")) {
                    responseContent += `Merhaba! Ben ${selectedModel.name}. Size nasıl yardımcı olabilirim?`;
                } else {
                    responseContent += `"${contentToSend}" sorunuzu ${selectedModel.name} altyapısını kullanarak analiz ettim. \n\nİşte bulgularım:\n1. Model yetenekleri devreye alındı.\n2. Bağlam incelendi.\n3. Yanıt oluşturuldu.\n\nBaşka bir sorunuz var mı?`;
                }
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: responseContent,
                    id: (Date.now() + 1).toString(),
                    model: selectedModel.name // Optional tracking
                },
            ]);
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 custom-scroll">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col justify-center px-4 md:px-12 py-10">
                        {/* Hero Section */}
                        <div className="text-center space-y-4 mb-12 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-primary/10 to-purple-500/10 mb-4 ring-1 ring-primary/20 shadow-lg shadow-primary/5">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-purple-500 tracking-tight">
                                Yamanzeka Portal
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                                En gelişmiş yapay zeka modelleri tek çatı altında. <br className="hidden md:block" />
                                Kodlama, görsel oluşturma veya analiz için doğru modeli seçin.
                            </p>
                        </div>

                        {/* Featured Models Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                            {featuredModels.map((m: any, idx) => (
                                <motion.button
                                    key={m.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 + 0.3 }}
                                    onClick={() => setModel(m.id)}
                                    className={cn(
                                        "group relative flex flex-col items-start p-5 h-40 rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden",
                                        model === m.id && "ring-2 ring-primary bg-primary/5"
                                    )}
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Bot size={16} className="text-muted-foreground" />
                                    </div>

                                    <div className="w-10 h-10 rounded-xl bg-background shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {/* Fallback icon if logo fails or just use generic for now since we don't have Image import here yet (wait, we do need Image import) */}
                                        {/* Actually ChatInterface doesn't have Image import, I need to add it */}
                                        <span className="text-2xl">🤖</span>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className={cn("font-bold text-base group-hover:text-primary transition-colors", m.color)}>
                                            {m.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 opacity-80 group-hover:opacity-100">
                                            {m.description}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Quick Prompts */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto w-full">
                            {[
                                { label: "Bir React bileşeni yaz", icon: "⚛️", text: "Responsive bir navbar için React bileşeni yaz." },
                                { label: "Blog yazısı taslağı", icon: "📝", text: "Yapay zeka trendleri hakkında bir blog yazısı taslağı çıkar." },
                                { label: "Fütüristik şehir resmi", icon: "🌃", text: "Neon ışıklarla kaplı fütüristik bir şehir görseli oluştur." }
                            ].map((prompt, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                    onClick={() => handleSend(prompt.text)}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted border border-transparent hover:border-border transition-all text-sm font-medium text-muted-foreground hover:text-foreground text-left"
                                >
                                    <span className="text-lg">{prompt.icon}</span>
                                    <span>{prompt.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={cn(
                                "flex gap-4 w-full",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                    <Bot size={18} className="text-primary" />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "p-4 rounded-2xl max-w-[85%] md:max-w-[75%] lg:max-w-[65%] text-sm md:text-base shadow-sm relative group whitespace-pre-wrap leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted text-foreground rounded-tl-none border border-border"
                                )}
                            >
                                {msg.content}
                            </div>

                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
                                    <User size={18} className="text-muted-foreground" />
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 w-full justify-start"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                            <Bot size={18} className="text-primary" />
                        </div>
                        <div className="bg-muted p-4 rounded-2xl rounded-tl-none border border-border flex items-center gap-2">
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-200" />
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-6 left-0 right-0 px-4 z-20">
                <div className="max-w-3xl mx-auto relative glass rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 input-glow transition-all duration-300 focus-within:ring-primary/50">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={messages.length === 0 ? "Bir hayal kurun veya bir soru sorun..." : "Mesajınızı yazın..."}
                        className="w-full bg-transparent border-0 focus:ring-0 resize-none max-h-48 py-4 pl-4 pr-14 text-base md:text-lg placeholder:text-muted-foreground/50"
                        rows={1}
                        style={{ minHeight: "60px" }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        <button className="p-2 hover:bg-muted/50 rounded-full text-muted-foreground transition-colors" title="Dosya Ekle">
                            <Paperclip size={20} />
                        </button>
                        <button className="p-2 hover:bg-muted/50 rounded-full text-muted-foreground transition-colors" title="Sesli Giriş">
                            <Mic size={20} />
                        </button>
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
                <div className="text-center mt-2 text-xs text-muted-foreground/70 font-medium">
                    Yamanzeka 3.0 Pro • Hata yapabilir, lütfen bilgileri doğrulayın.
                </div>
            </div>
        </div>
    );
}
