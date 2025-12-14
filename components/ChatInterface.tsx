"use client";

import { useRef, useEffect, useContext } from "react";
import { Send, Bot, User, Sparkles, Paperclip, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { ModelContext } from "../app/layout";
import { AI_MODELS } from "../data/models";

/* ✅ NET ve GENİŞ Message tipi */
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
};

export default function ChatInterface() {
  const {
    model,
    setModel,
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
  } = useContext(ModelContext);

  const scrollRef = useRef<HTMLDivElement>(null);

  const featuredModels = [
    AI_MODELS.find(m => m.id === "gemini-3-pro"),
    AI_MODELS.find(m => m.id === "gpt-5-2"),
    AI_MODELS.find(m => m.id === "flux-1-pro"),
    AI_MODELS.find(m => m.id === "codestral-mamba"),
  ].filter(Boolean);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const contentToSend = text || input;
    if (!contentToSend.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: contentToSend,
    };

    setMessages((prev: Message[]) => [...prev, newMsg]);
    setInput("");
    setIsLoading(true);

    const selectedModel =
      AI_MODELS.find(m => m.id === model) || AI_MODELS[0];

    setTimeout(() => {
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `**${selectedModel.name}** yanıtı:\n\n"${contentToSend}"`,
        model: selectedModel.name,
      };

      setMessages((prev: Message[]) => [...prev, responseMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
        {messages.map((msg: Message) => (
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
        <div ref={scrollRef} />
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="w-full p-4 rounded-xl border resize-none"
          rows={2}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
