"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setInfo("Kayıt başarılı! Lütfen e-postanı kontrol et.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setInfo("Giriş başarılı! Chat ekranına yönlendiriliyorsunuz...");
        router.push("/chat");
      }
    } catch (err: any) {
      setError(err.message ?? "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
              mode === "signin" ? "bg-blue-600" : "bg-gray-800"
            }`}
            onClick={() => setMode("signin")}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
              mode === "signup" ? "bg-blue-600" : "bg-gray-800"
            }`}
            onClick={() => setMode("signup")}
          >
            Üye Ol
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Ad Soyad</label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">E-posta</label>
            <input
              type="email"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Şifre</label>
            <input
              type="password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {info && <p className="text-green-400 text-sm">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 rounded-lg text-sm font-semibold"
          >
            {loading
              ? "Lütfen bekleyin..."
              : mode === "signup"
              ? "Üye Ol"
              : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
