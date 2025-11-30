"use client";

import "./globals.css";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { createContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export const ModelContext = createContext<any>(null);
export const SidebarContext = createContext<any>(null);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState("gemini");
  const [isOpen, setIsOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setUserEmail(user?.email ?? null);
      const meta = (user?.user_metadata as any) || {};
      setUserName(meta.full_name ?? null);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserEmail(user?.email ?? null);
      const meta = (user?.user_metadata as any) || {};
      setUserName(meta.full_name ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <html lang="tr">
      <body className="flex bg-black text-white">
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
          <ModelContext.Provider value={{ model, setModel }}>
            {/* Sol Sidebar */}
            <Sidebar />

            {/* Sağdaki içerik (sidebar genişliği ile birlikte hareket eder) */}
            <div
              className={`flex-1 transition-all duration-300 p-6 ${
                isOpen ? "ml-64" : "ml-20"
              }`}
            >
              <div className="flex justify-end items-center mb-4 text-sm gap-3">
                {!userEmail ? (
                  <>
                    <span className="text-gray-400">Giriş yapılmamış</span>
                    <Link
                      href="/auth"
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white"
                    >
                      Üye Ol / Giriş Yap
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-gray-300">
                      Giriş yapan: <strong>{userName ?? userEmail}</strong>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200"
                    >
                      Çıkış Yap
                    </button>
                  </>
                )}
              </div>

              {children}
            </div>
          </ModelContext.Provider>
        </SidebarContext.Provider>
      </body>
    </html>
  );
}
