import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FeaturesBar from "../components/layout/FeaturesBar";
import ShopTheLook from "../components/catalog/ShopTheLook";
import QuickViewModal from "../components/catalog/QuickViewModal";
import { useTheme } from "../context/ThemeContext";
import { Sparkles, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LookbookPage() {
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
              <Sparkles size={14} /> Official 2026 Collection
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-3">
              Interactive <span className="text-[#FFB400]">Lookbook</span>
            </h1>
            <p className={`font-sans text-sm sm:text-base max-w-2xl mt-2 ${isDark ? "text-white/70" : "text-neutral-600"}`}>
              Explore fully-styled models, click hotspot pins to inspect matching inner slips, headwraps &amp; accessories, or purchase complete outfits with one click.
            </p>
          </div>
        </div>

        {/* Main Shop The Look Component */}
        <div className="mt-8">
          <ShopTheLook
            isDark={isDark}
            onQuickView={(item) => setQuickViewItem(item)}
          />
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
