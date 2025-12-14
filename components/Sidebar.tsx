"use client";

import { useContext, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Bot, Settings, LogOut, Search, Code, Image as ImageIcon, MessageSquare } from "lucide-react";
import { ModelContext, SidebarContext } from "../app/layout";
import { AI_MODELS, ModelCategory } from "../data/models";
import { cn } from "../lib/utils";

const CATEGORY_ICONS: Record<string, any> = {
  text: MessageSquare,
  code: Code,
  image: ImageIcon,
  audio: Bot,
  analysis: Bot,
};

const CATEGORY_NAMES: Record<string, string> = {
  text: "Sohbet & Yazım Asistanları",
  code: "Yazılım & Kodlama Araçları",
  image: "Görsel & Sanat Stüdyosu",
  audio: "Ses & Müzik Üretimi",
  analysis: "Veri & Analiz Uzmanları",
};

export default function Sidebar() {
  const { model, setModel, availableModels, checkForUpdates, isUpdating, resetChat } = useContext(ModelContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const filteredModels = useMemo(() => {
    return (availableModels || AI_MODELS).filter((m: any) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, availableModels]);

  const groupedModels = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredModels.forEach((m: any) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, [filteredModels]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className={cn(
          "fixed top-0 left-0 z-50 h-screen border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "hidden md:flex flex-col transition-all duration-300 ease-in-out"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                  <Image
                    src="/logos/mylogo.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-bold text-lg tracking-tight">Yamanzeka</span>
              </motion.div>
            ) : (
              <div className="mx-auto">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                  <Image
                    src="/logos/mylogo.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {isOpen && (
          <div className="px-3 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Model ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted/50 border border-input rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scroll">
          <div className="space-y-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground mb-4"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} className="mx-auto" />}
              {isOpen && <span className="text-sm font-medium">Kapat</span>}
            </button>

            <button
              onClick={() => resetChat()}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-left",
                pathname === "/"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Home size={20} className={cn(!isOpen && "mx-auto")} />
              {isOpen && <span className="text-sm font-medium">Ana Sayfa</span>}
            </button>
          </div>

          <div className="border-t border-border/40" />

          <div className="space-y-6">
            {Object.entries(groupedModels).map(([category, models]) => {
              const Icon = CATEGORY_ICONS[category] || Bot;
              return (
                <div key={category} className="space-y-1">
                  {isOpen && (
                    <div className="px-2 mb-2 flex items-center gap-2 sticky top-0 z-10 pt-2 pb-1 bg-background/95 backdrop-blur-sm">
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-primary/10 text-primary rounded-md w-full">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold tracking-wide uppercase">
                          {CATEGORY_NAMES[category] || category}
                        </span>
                      </div>
                    </div>
                  )}

                  {models.map((m: any) => {
                    const isActive = model === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setModel(m.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                          isActive
                            ? "bg-muted text-foreground ring-1 ring-border shadow-sm"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                        title={!isOpen ? m.name : undefined}
                      >
                        <div className={cn("relative h-6 w-6 shrink-0 rounded-md overflow-hidden bg-foreground/5 p-0.5", !isOpen && "mx-auto")}>
                          <Image
                            src={m.logo}
                            alt={m.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {isOpen && (
                          <div className="flex flex-col items-start overflow-hidden">
                            <span className={cn("text-sm font-medium truncate w-full", m.color)}>
                              {m.name}
                            </span>
                            {m.isNew && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-full font-bold">YENİ</span>
                            )}
                          </div>
                        )}
                        {isActive && !isOpen && (
                          <div className="absolute left-full ml-2 w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-border shrink-0">
          <button
            onClick={checkForUpdates}
            disabled={isUpdating}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
              !isOpen && "justify-center px-2"
            )}
            title="Güncellemeleri Kontrol Et"
          >
            <Settings size={20} className={cn(isUpdating && "animate-spin text-primary")} />
            {isOpen && <span className="text-sm font-medium">{isUpdating ? "Güncelleniyor..." : "Güncellemeler"}</span>}
          </button>
        </div>
      </motion.aside>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg bg-background border border-border shadow-sm">
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-background border-r border-border flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                  <Image
                    src="/logos/mylogo.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-bold text-xl">Yamanzeka</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded-md">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 pt-4 pb-2 border-b border-border/40">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Model ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-muted/50 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <button
                onClick={() => {
                  resetChat();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left",
                  pathname === "/"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Home size={20} />
                <span className="font-medium">Ana Sayfa</span>
              </button>

              {Object.entries(groupedModels).map(([category, models]) => {
                const Icon = CATEGORY_ICONS[category] || Bot;
                return (
                  <div key={category} className="space-y-1">
                    <div className="px-3 mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <Icon className="h-3 w-3" />
                      {CATEGORY_NAMES[category] || category}
                    </div>
                    {models.map((m: any) => (
                      <button
                        key={m.id}
                        onClick={() => { setModel(m.id); setIsOpen(false); }}
                        className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200", model === m.id ? "bg-muted text-foreground ring-1 ring-border shadow-sm" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground")}
                      >
                        <div className="relative h-6 w-6 shrink-0 rounded-md overflow-hidden bg-foreground/5 p-0.5">
                          <Image src={m.logo} alt={m.name} fill className="object-contain" />
                        </div>
                        <div className="flex flex-col items-start"><span className="text-sm font-medium">{m.name}</span></div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-border">
              <button onClick={checkForUpdates} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <Settings size={20} className={cn(isUpdating && "animate-spin")} />
                <span className="text-sm font-medium">{isUpdating ? "Güncelleniyor..." : "Güncellemeler"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
