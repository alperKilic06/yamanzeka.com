"use client";

import { useRef, useEffect, useContext } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { ModelContext } from "../app/layout";
import { AI_MODELS } from "../data/models";

/* ================= TYPES ================= */

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
};

/* ================= COMPONENT ================= */

export default function ChatInterface() {
  const {
    model,
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    userEmail,
  } = useContext(ModelContext);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ================= SEND MESSAGE ================= */

  const handleSend = async (text?: string) => {
    if (!userEmail) return;

    const contentToSend = text || input;
    if (!contentToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: contentToSend,
    };

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "API hatası");
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        model,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "❌ Sunucu hatası: " + err.message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
        {!userEmail ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Yamanzeka'ya Hoşgeldiniz</h2>
            <p className="text-muted-foreground max-w-md">
              Yapay zeka modellerini kullanmak için giriş yapmalısınız.
            </p>
            <a
              href="/auth"
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full shadow-lg hover:shadow-primary/25 transition-all"
            >
              Giriş Yap / Kayıt Ol
            </a>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center space-y-4 py-10 opacity-70">
                <h2 className="text-2xl font-bold">Nasıl yardımcı olabilirim?</h2>
              </div>
            )}

            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={cn(
                    "p-4 rounded-2xl max-w-[70%] text-sm shadow-sm whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted border"
                  )}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-muted-foreground">
                <Bot size={16} /> Yazıyor...
              </div>
            )}
          </>
        )}
        <div ref={scrollRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        {userEmail ? (
          <div className="relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full p-4 rounded-xl border resize-none bg-background shadow-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              rows={1}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-4 bottom-4 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        ) : (
          <div className="w-full p-4 rounded-xl border bg-muted/50 text-center text-muted-foreground text-sm">
            Sohbet etmek için giriş yapmalısınız.
          </div>
        )}
      </div>
    </div>
  );
}
