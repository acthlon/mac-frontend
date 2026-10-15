import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FeaturesBar from "../components/layout/FeaturesBar";
import StyleQuiz from "../components/catalog/StyleQuiz";
import QuickViewModal from "../components/catalog/QuickViewModal";
import { useTheme } from "../context/ThemeContext";
import { Sparkles, Upload, Search, ShieldCheck, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StyleFinderPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [quickViewItem, setQuickViewItem] = useState(null);
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"
      }`}
    >
      <Header />

      <main className="pb-16 pt-6">
        {/* Page Hero Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div
            className={`rounded-3xl border p-8 sm:p-12 transition-all duration-300 ${
              isDark
                ? "border-white/10 bg-gradient-to-r from-[#151515] via-[#1A1A1A] to-[#151515]"
                : "border-[#EAE6DF] bg-gradient-to-r from-[#F7F5F0] via-white to-[#F7F5F0] shadow-sm"
            }`}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-3.5 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
              <Sparkles size={14} /> Bespoke Style Assistant
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-3">
              Style &amp; Fabric <span className="text-[#FFB400]">Finder</span>
            </h1>
            <p className={`font-sans text-sm sm:text-base max-w-2xl mt-2 ${isDark ? "text-white/70" : "text-neutral-600"}`}>
              Answer 2 quick questions to discover tailored dresses and luxury fabrics for your specific occasion.
            </p>
          </div>
        </div>

        {/* Main Style Finder Quiz */}
        <div className="mt-8">
          <StyleQuiz
            isDark={isDark}
            onQuickView={(item) => setQuickViewItem(item)}
          />
        </div>

        {/* Future Plan: Style Upload & Community Vault Teaser Banner */}
        <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-8">
          <div
            className={`rounded-3xl border p-8 sm:p-10 transition-all duration-300 shadow-xl ${
              isDark
                ? "border-[#FFB400]/30 bg-gradient-to-r from-[#181818] via-[#1F1F1F] to-[#181818]"
                : "border-[#FFB400]/40 bg-gradient-to-r from-[#FFFDF9] via-[#FDF8EE] to-[#FFFDF9] shadow-sm"
            }`}
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB400] px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-[#0F0F0F]">
                  🚀 Coming Soon — Style Vault &amp; Detection
                </span>
                <h3 className={`font-display text-2xl sm:text-3xl font-semibold mt-3 ${isDark ? "text-white" : "text-[#141414]"}`}>
                  Have a Unique Outfit Style in Mind?
                </h3>
                <p className={`font-sans text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? "text-white/70" : "text-neutral-600"}`}>
                  Soon, you will be able to upload custom dress or boubou photos directly. Our AI Style Vault will match your design with our luxury fabrics and custom tailoring team. When your custom style is crafted, original style creators earn royalties &amp; credit!
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#FFB400]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={15} /> 100% Creator Credit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart size={15} /> Community Style Library
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border p-6 border-white/10 bg-black/20 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => alert("Custom Style Upload feature will be available once backend infrastructure is launched!")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FFB400] py-3.5 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-[1.02] shadow-lg"
                >
                  <Upload size={16} /> Upload Custom Style Photo
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/catalog")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 py-3.5 font-sans text-xs font-semibold hover:border-[#FFB400] hover:text-[#FFB400] transition-colors"
                >
                  <Search size={16} /> Search Existing Styles Vault
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FeaturesBar />
      <Footer />

      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onViewFullDetails={(item) => navigate(`/product/${item.slug || "product"}/${item.id}`)}
      />
    </div>
  );
}
