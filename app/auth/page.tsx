"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import { Lock, Mail, User, ShieldCheck, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Captcha State
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
    setCaptchaInput("");
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        // Validation for Signup
        if (password !== confirmPassword) {
          throw new Error("Şifreler eşleşmiyor. Lütfen kontrol edin.");
        }

        if (parseInt(captchaInput) !== captchaAnswer) {
          throw new Error("Güvenlik sorusu yanlış. Lütfen tekrar deneyin.");
        }

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
        setInfo("Kayıt başarılı! Lütfen e-postanıza gelen doğrulama bağlantısına tıklayın.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setInfo("Giriş başarılı! Yönlendiriliyorsunuz...");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message ?? "Bir hata oluştu.");
      if (mode === "signup") generateCaptcha(); // Refresh captcha on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2">
            {mode === "signin" ? "Hoş Geldiniz" : "Hesap Oluştur"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "signin"
              ? "Devam etmek için giriş yapın"
              : "Yamanzeka'yı keşfetmek için katılın"}
          </p>
        </div>

        <div className="flex bg-muted/50 p-1 rounded-xl mb-8 relative">
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 ${mode === "signin" ? "text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
          >
            {mode === "signin" && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-primary rounded-lg shadow-md -z-10" />
            )}
            Giriş Yap
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 ${mode === "signup" ? "text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
          >
            {mode === "signup" && (
              <motion.div layoutId="tab-bg" className="absolute inset-0 bg-primary rounded-lg shadow-md -z-10" />
            )}
            Üye Ol
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  className="w-full bg-background/50 border border-input focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
              <input
                type="email"
                placeholder="ornek@email.com"
                className="w-full bg-background/50 border border-input focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-background/50 border border-input focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground ml-1">Şifre Tekrar</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-background/50 border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${confirmPassword && password !== confirmPassword
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-input focus:border-primary focus:ring-primary/20"
                      }`}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 ml-1">Şifreler eşleşmiyor</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground ml-1">Güvenlik Sorusu</label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center bg-muted/50 border border-input rounded-xl px-4 min-w-[100px] font-mono font-bold text-lg select-none">
                    {captchaQuestion}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-3 hover:bg-muted rounded-xl text-muted-foreground transition-colors"
                    title="Yeni soru"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                  <div className="relative flex-1">
                    <ShieldCheck className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
                    <input
                      type="number"
                      placeholder="Sonuç?"
                      className="w-full bg-background/50 border border-input focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={captchaInput}
                      onChange={e => setCaptchaInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}
          {info && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg text-sm flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-70 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                İşleniyor...
              </>
            ) : mode === "signup" ? (
              <>
                Üye Ol
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Giriş Yap
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
