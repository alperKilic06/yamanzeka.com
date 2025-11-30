"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { ModelContext } from "../layout";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function ChatPage() {
  const { model } = useContext(ModelContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userMessage,
          model: model,
        }),
      });

      const data = await res.json();

      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Bağlantı hatası oluştu." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* ÜST BAR */}
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">Yamanzeka Chat</h1>
        <span className="text-sm text-gray-400">Aktif model: {model}</span>
      </div>

      {/* MESAJLAR */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-black"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-base leading-relaxed ${
              m.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-gray-800 border border-gray-700"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 px-4 py-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-bounce" />
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-bounce delay-150" />
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-bounce delay-300" />
          </div>
        )}
      </div>

      {/* MESAJ GİRİŞ ALANI */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-3">
        <input
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mesaj yaz..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />

        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
          onClick={sendMessage}
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
