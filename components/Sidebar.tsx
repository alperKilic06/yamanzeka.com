"use client";

import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModelContext, SidebarContext } from "../app/layout";
import { AI_MODELS } from "../data/models";

export default function Sidebar() {
  const { model, setModel } = useContext(ModelContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen 
        bg-gray-900 border-r border-gray-800 
        transition-all duration-300 
        ${isOpen ? "w-64" : "w-20"}
        overflow-y-auto
        overflow-x-hidden
        custom-scroll
      `}
    >
      {/* LOGO */}
      <div className="flex justify-center items-center py-6">
        <Image
          src="/logos/mylogo.png"
          alt="Yamanzeka Logo"
          width={isOpen ? 110 : 45}
          height={45}
          className="rounded-lg transition-all duration-300"
        />
      </div>

      {/* Menü Aç / Kapat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-4 hover:bg-gray-800 w-full text-lg"
      >
        {isOpen ? "Kapat" : "Aç"}
      </button>

      {/* Ana Sayfa */}
      <div className="mt-4 px-3">
        <Link
          href="/"
          className="block bg-blue-600 hover:bg-blue-700 text-center py-2 rounded-lg font-semibold"
        >
          {isOpen ? "Ana Sayfa" : "Ana"}
        </Link>
      </div>

      {/* MODEL LİSTESİ */}
      <div className="mt-6 px-3 space-y-3 pb-10">
        {AI_MODELS.map((m) => {
          const active = model === m.id;

          return (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${active ? "bg-gray-800 border border-blue-500 shadow-glow" : "hover:bg-gray-800"}
              `}
            >
              {/* MODEL LOGO */}
              <div
                className={`
                  h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden
                  ${active ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900" : ""}
                `}
              >
                <Image
                  src={m.logo}
                  alt={m.name}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

              {/* MODEL ADI */}
              {isOpen && (
                <span className={`${m.color} text-sm font-semibold`}>
                  {m.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
