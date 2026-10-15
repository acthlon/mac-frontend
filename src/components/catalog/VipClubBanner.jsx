import React, { useState, useEffect } from "react";
import { Crown, Sparkles, Mail, Send, Check, Copy, Gift, ShieldCheck } from "lucide-react";

function WhatsAppIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function VipClubBanner({ isDark }) {
  const [method, setMethod] = useState("email"); // 'email' | 'whatsapp'
  const [inputVal, setInputVal] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const PROMO_CODE = "MARVELAMVIP10";

  useEffect(() => {
    const saved = localStorage.getItem("marvelam_vip_subscribed");
    if (saved) {
      setIsSubscribed(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!inputVal.trim()) {
      setErrorMsg("Please enter your contact information to claim 10% off.");
      return;
    }

    if (method === "email" && !inputVal.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (method === "whatsapp" && inputVal.trim().length < 8) {
      setErrorMsg("Please enter a valid WhatsApp phone number.");
      return;
    }

    // Success state
    localStorage.setItem("marvelam_vip_subscribed", "true");
    setIsSubscribed(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-8">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 transition-all duration-300 shadow-2xl ${
          isDark
            ? "border-white/15 bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] text-white"
            : "border-[#EAE6DF] bg-gradient-to-r from-[#171717] via-[#222222] to-[#171717] text-white"
        }`}
      >
        {/* Background Decorative Accents */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFB400]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          {/* Left Column: Offer Info */}
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
                <Crown size={13} /> Marvelam VIP Club
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow">
                <Gift size={11} /> 10% Off
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-white">
              Unlock <span className="text-[#FFB400]">10% Off</span> Your First Order
            </h2>

            <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
              Join our exclusive VIP circle to receive your first-order discount, priority access to new abaya &amp; fabric drops, and complimentary tailoring swatches.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] font-semibold text-white/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#FFB400]" /> No Spam, Cancel Anytime
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#FFB400]" /> Exclusive Early Access
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Sign-Up Form or Promo Code Card */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Method Switcher */}
                <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("email");
                      setErrorMsg("");
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-sans text-xs font-semibold transition-all ${
                      method === "email"
                        ? "bg-[#FFB400] text-[#0F0F0F] shadow"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Mail size={14} /> Via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("whatsapp");
                      setErrorMsg("");
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-sans text-xs font-semibold transition-all ${
                      method === "whatsapp"
                        ? "bg-[#FFB400] text-[#0F0F0F] shadow"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <WhatsAppIcon size={14} /> Via WhatsApp
                  </button>
                </div>

                {/* Input Field */}
                <div>
                  <div className="relative">
                    <input
                      type={method === "email" ? "email" : "tel"}
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder={
                        method === "email"
                          ? "Enter your email address..."
                          : "Enter phone/WhatsApp number..."
                      }
                      className="w-full rounded-xl border border-white/20 bg-black/60 py-3 pl-4 pr-12 font-sans text-xs text-white placeholder:text-white/40 focus:border-[#FFB400] focus:outline-none transition-all"
                    />
                    <button
                      type="submit"
                      aria-label="Submit VIP subscription"
                      className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#FFB400] text-[#0F0F0F] transition-transform hover:scale-105"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  {errorMsg && (
                    <p className="mt-2 font-sans text-[11px] text-red-400 font-medium">
                      {errorMsg}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB400] py-3 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-[1.01] shadow-lg shadow-[#FFB400]/20"
                >
                  <Gift size={15} /> Claim 10% Off Code Now
                </button>
              </form>
            ) : (
              /* Success Unlocked Code Card */
              <div className="flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFB400]/20 border border-[#FFB400]/40 text-[#FFB400]">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Welcome to the VIP Club! 🎉
                </h3>
                <p className="font-sans text-xs text-white/70">
                  Use your exclusive 10% discount code at checkout:
                </p>

                {/* Promo Code Box with Copy Button */}
                <div className="flex w-full items-center justify-between rounded-xl border border-[#FFB400]/50 bg-black/60 px-4 py-2.5">
                  <span className="font-mono text-base font-bold text-[#FFB400] tracking-wider">
                    {PROMO_CODE}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 rounded-lg bg-[#FFB400] px-3 py-1.5 font-sans text-[11px] font-bold text-[#0F0F0F] transition-transform hover:scale-105"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
