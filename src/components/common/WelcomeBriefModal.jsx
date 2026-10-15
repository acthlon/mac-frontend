import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Scissors,
  Layers,
  Sparkles,
  X,
  Truck,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

/**
 * WelcomeBriefModal
 * 5-Second Instant Glance Popup
 *
 * Visual Hierarchy Principles Applied:
 * 1. Primary Hero Element (Largest & Highest Contrast):
 *    "BESPOKE CUSTOM TAILORING — FROM YOUR COMFORT ZONE"
 *    "Choose your style, enter your measurements from home. We tailor & deliver to your doorstep."
 * 2. Secondary Row (Supporting offerings):
 *    "Raw Luxury Fabrics by the Yard" & "Ready-to-Wear Gowns"
 * 3. 5-Second live golden progress bar + instant one-tap dismissal.
 */
export default function WelcomeBriefModal({ isDark }) {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsOpen(true);
    setProgress(100);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const duration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          setIsOpen(false);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`relative w-full max-w-[420px] rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-[#141414] border-[#FFB400]/40 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
            : "bg-white border-[#E5E0D8] text-[#0F0F0F] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        }`}
      >
        {/* Animated 5-second countdown gold bar */}
        <div className="w-full h-1 bg-neutral-200 dark:bg-white/10 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFB400] to-[#FFE28A] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Top Minimal Bar */}
        <div className="pt-3 px-4 sm:px-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-bold tracking-tight text-[#FFB400]">
              MAC
            </span>
            <span className="text-[9px] tracking-wider uppercase font-semibold text-neutral-400 border-l border-neutral-300/30 pl-1.5">
              Marvelam Atelier
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close introduction modal"
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-5 pt-2">
          
          {/* 🌟 DOMINANT PRIMARY FEATURE: Custom Tailoring (Largest Size, Golden Frame) */}
          <div className="rounded-xl border-2 border-[#FFB400] bg-gradient-to-br from-[#FFB400]/15 via-[#FFB400]/5 to-transparent p-3.5 sm:p-4 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFB400] text-[#0F0F0F] text-[9px] font-black uppercase tracking-wider mb-2 shadow-sm">
              <Scissors size={11} className="stroke-[3]" />
              Our Signature Superpower
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight text-neutral-900 dark:text-white">
              Custom Tailoring, <br className="hidden sm:inline" />
              <span className="text-[#FFB400]">From Your Comfort Zone</span>
            </h2>

            <p className="mt-1.5 text-xs sm:text-[13px] font-medium text-neutral-700 dark:text-neutral-200 leading-snug">
              Pick your style & fabric. Enter your measurements.
              <strong className="block text-[#FFB400] font-semibold mt-0.5">
                We sew & deliver your custom fit to your door.
              </strong>
            </p>
          </div>

          {/* 📦 SECONDARY LEVEL: What else you can do (Compact 2-Pill Row) */}
          <div className="mt-3">
            <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-400 block text-center mb-1.5">
              Also On Marvelam:
            </span>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
                <span className="text-sm block">🧵</span>
                <span className="text-[10px] font-bold block text-neutral-800 dark:text-neutral-200 mt-0.5">
                  Luxury Fabrics
                </span>
                <span className="text-[9px] text-neutral-400">Sold by the yard</span>
              </div>

              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
                <span className="text-sm block">👗</span>
                <span className="text-[10px] font-bold block text-neutral-800 dark:text-neutral-200 mt-0.5">
                  Ready-To-Wear
                </span>
                <span className="text-[9px] text-neutral-400">Instant luxury styles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Dismiss button */}
        <div className="px-4 sm:px-5 pb-3.5 pt-1 flex items-center justify-between text-xs">
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 hover:text-[#FFB400] transition-colors"
          >
            How it works →
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg bg-[#FFB400] px-4 py-1 font-sans text-xs font-bold text-[#0F0F0F] hover:bg-[#FFB400]/90 transition-colors cursor-pointer shadow-sm"
          >
            Got it ({Math.ceil((progress / 100) * 5)}s)
          </button>
        </div>
      </div>
    </div>
  );
}
