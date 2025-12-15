"use client";

import "./globals.css";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { supabase } from "./supabaseClient";
import { Inter, Outfit } from "next/font/google";
import { motion } from "framer-motion";
import { AI_MODELS, AIModel } from "../data/models";

/* =========================
   FONT SETUP
========================= */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

/* =========================
   GLOBAL TYPES
========================= */
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
};

type ModelContextType = {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  availableModels: AIModel[];
  checkForUpdates: () => Promise<boolean>;
  isUpdating: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetChat: () => void;
  userEmail: string | null;
  userName: string | null;
  handleLogout: () => Promise<void>;
};

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/* =========================
   CONTEXTS
========================= */
export const ModelContext = createContext<ModelContextType>(
  {} as ModelContextType
);

export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType
);

/* =========================
   ROOT LAYOUT
========================= */
export default function RootLayout({ children }: { children: ReactNode }) {
  const [model, setModel] = useState("gemini-3-pro");
  const [isOpen, setIsOpen] = useState(true);
  const [availableModels, setAvailableModels] = useState<AIModel[]>(AI_MODELS);
  const [isUpdating, setIsUpdating] = useState(false);

  /* Chat State */
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* Auth State */
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setUserName((data.user.user_metadata as any)?.full_name ?? null);
      }
    };
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user;
        setUserEmail(user?.email ?? null);
        setUserName((user?.user_metadata as any)?.full_name ?? null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setUserName(null);
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
  };

  const checkForUpdates = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedModels = availableModels.map(m => {
      if (m.id === "gpt-5-2") {
        return {
          ...m,
          name: "GPT 5.3 Turbo",
          isNew: true,
          description: "Otomatik güncellendi: En yeni GPT versiyonu."
        };
      }
      return m;
    });

    setAvailableModels(updatedModels);
    setIsUpdating(false);
    return true;
  };

  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground overflow-x-hidden">
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
          <ModelContext.Provider
            value={{
              model,
              setModel,
              availableModels,
              checkForUpdates,
              isUpdating,
              messages,
              setMessages,
              input,
              setInput,
              isLoading,
              setIsLoading,
              resetChat,
              userEmail,
              userName,
              handleLogout
            }}
          >
            <div className="flex min-h-screen">
              <Sidebar />
              <ContentWrapper>{children}</ContentWrapper>
            </div>
          </ModelContext.Provider>
        </SidebarContext.Provider>
      </body>
    </html>
  );
}

/* =========================
   CONTENT WRAPPER
========================= */
function ContentWrapper({ children }: { children: ReactNode }) {
  const { isOpen } = useContext(SidebarContext);
  const { userEmail, userName, handleLogout } = useContext(ModelContext);

  // Removed local auth logic from here

  return (
    <motion.div
      initial={false}
      animate={{ marginLeft: isOpen ? 280 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex-1 flex flex-col min-h-screen"
    >
      <div className="absolute top-4 right-6 z-30">
        {!userEmail ? (
          <Link
            href="/auth"
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm"
          >
            Giriş Yap
          </Link>
        ) : (
          <div className="flex items-center gap-3 bg-secondary p-2 rounded-full">
            <span className="text-sm">
              {userName || userEmail.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-xs bg-background rounded-full"
            >
              Çıkış
            </button>
          </div>
        )}
      </div>

      <main className="flex-1">{children}</main>
    </motion.div>
  );
}
