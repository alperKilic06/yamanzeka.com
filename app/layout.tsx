"use client";

import "./globals.css";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { supabase } from "./supabaseClient";
import { Inter, Outfit } from "next/font/google"; // Import fonts
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { AI_MODELS, AIModel } from "../data/models";

export const ModelContext = createContext<any>(null);
export const SidebarContext = createContext<any>(null);

function MainContent({ children }: { children: ReactNode }) {
  // ... existing MainContent code ...
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState("gemini-3-pro"); // Default to new model
  const [isOpen, setIsOpen] = useState(true);
  const [availableModels, setAvailableModels] = useState<AIModel[]>(AI_MODELS);
  const [isUpdating, setIsUpdating] = useState(false);

  // Chat State (Global)
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetChat = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
  };

  // Simulation of an "Auto Update" check
  const checkForUpdates = async () => {
    setIsUpdating(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate finding a new version
    const updatedModels = availableModels.map(m => {
      if (m.id === "gpt-5-2") {
        return { ...m, name: "GPT 5.3 Turbo", isNew: true, description: "Otomatik güncellendi: En yeni GPT versiyonu." };
      }
      if (m.id === "claude-4-5") {
        return { ...m, name: "Claude 4.6 Opus", isNew: true };
      }
      return m;
    });

    // Add a completely new model if not exists
    if (!updatedModels.find(m => m.id === "apple-intelligence")) {
      updatedModels.push({
        id: "apple-intelligence",
        name: "Apple Intelligence",
        category: "text",
        description: "Apple'ın yerel ve gizlilik odaklı yapay zeka modeli.",
        color: "text-gray-400",
        logo: "/logos/mylogo.png",
        isNew: true
      });
    }

    setAvailableModels(updatedModels);
    setIsUpdating(false);
    return true;
  };


  // Auto-check once on mount (optional, or triggered by user)
  // useEffect(() => { checkForUpdates(); }, []); 

  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable} antialiased`}>
      <body className="bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
          <ModelContext.Provider value={{
            model, setModel,
            availableModels, checkForUpdates, isUpdating,
            messages, setMessages,
            input, setInput,
            isLoading, setIsLoading,
            resetChat
          }}>
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

function ContentWrapper({ children }: { children: ReactNode }) {
  const { isOpen } = useContext(SidebarContext);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserEmail(user?.email ?? null);
      setUserName((user?.user_metadata as any)?.full_name ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setUserName(null);
  };

  return (
    <>
      {/* Mobile Content Wrapper (No Framer Motion for margin, just full width) */}
      <div className="md:hidden flex-1 flex flex-col min-h-screen relative w-full ml-0">
        <div className="absolute top-4 right-6 z-30">
          {!userEmail ? (
            <Link href="/auth" className="px-5 py-2 rounded-full bg-primary font-medium text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all text-sm">
              Giriş Yap
            </Link>
          ) : (
            <div className="flex items-center gap-3 bg-secondary/50 backdrop-blur-md p-1 pl-4 rounded-full border border-border">
              <span className="text-sm font-medium">{userName || userEmail?.split('@')[0]}</span>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-full bg-background hover:bg-muted text-xs font-semibold shadow-sm transition-colors border border-border">
                Çıkış
              </button>
            </div>
          )}
        </div>
        <main className="flex-1 h-full w-full pt-16 px-4">
          {children}
        </main>
      </div>

      {/* Desktop Content Wrapper (With Framer Motion) */}
      <motion.div
        initial={false}
        animate={{ marginLeft: isOpen ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-1 flex-col min-h-screen relative w-full"
      >
        {/* User Profile / Auth Button Top Right */}
        <div className="absolute top-4 right-6 z-30">
          {!userEmail ? (
            <Link
              href="/auth"
              className="px-5 py-2 rounded-full bg-primary font-medium text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all text-sm"
            >
              Giriş Yap
            </Link>
          ) : (
            <div className="flex items-center gap-3 bg-secondary/50 backdrop-blur-md p-1 pl-4 rounded-full border border-border">
              <span className="text-sm font-medium">
                {userName || userEmail?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full bg-background hover:bg-muted text-xs font-semibold shadow-sm transition-colors border border-border"
              >
                Çıkış
              </button>
            </div>
          )}
        </div>

        <main className="flex-1 h-full w-full">
          {children}
        </main>
      </motion.div>
    </>
  );
}
