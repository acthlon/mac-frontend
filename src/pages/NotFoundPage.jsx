import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  ArrowLeft,
  Search,
  Sparkles,
  ShoppingBag,
  Package,
  Home,
  Scissors,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";

const QUICK_DISCOVERY_LINKS = [
  { label: "New Arrivals", path: "/products" },
  { label: "Premium Fabrics", path: "/fabrics" },
  { label: "Track an Order", path: "/track" },
  { label: "Lookbook & Editorials", path: "/lookbook" },
  { label: "Style Finder Quiz", path: "/style-finder" },
];

export default function NotFoundPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"
      }`}
    >
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Luxury Atelier Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFB400]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#C59B27]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full text-center">
          {/* Atelier Emblem & 404 Accent */}
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans text-xs uppercase tracking-[0.2em] font-semibold ${
                isDark
                  ? "border-[#FFB400]/30 bg-[#FFB400]/10 text-[#FFB400]"
                  : "border-[#FFB400]/40 bg-[#FFB400]/15 text-[#9E6E00]"
              }`}
            >
              <Compass size={13} className="animate-spin-slow" />
              <span>Lost in the Atelier</span>
            </div>
          </div>

          {/* Large Artistic 404 Headline */}
          <h1 className="font-display text-7xl sm:text-9xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFB400] via-[#E5A000] to-[#8C6000] select-none">
            404
          </h1>

          <h2
            className={`mt-2 font-display text-2xl sm:text-4xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-[#141414]"
            }`}
          >
            A Misplaced Silhouette
          </h2>

          <p
            className={`mt-4 font-sans text-sm sm:text-base max-w-lg mx-auto leading-relaxed ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            The bespoke garment, collection, or destination you are seeking has
            been moved, renamed, or is currently on our atelier&apos;s cutting table.
          </p>

          {/* Integrated Atelier Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-md mx-auto relative flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections, fabrics, or agbadas..."
              className={`w-full rounded-full border py-3.5 pl-5 pr-12 font-sans text-sm focus:border-[#FFB400] focus:outline-none transition-all ${
                isDark
                  ? "border-white/15 bg-[#171717] text-white placeholder:text-white/40 shadow-inner"
                  : "border-[#D8D2C5] bg-white text-neutral-800 placeholder:text-neutral-400 shadow-sm"
              }`}
            />
            <button
              type="submit"
              aria-label="Search store"
              className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB400] text-[#0F0F0F] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Navigation Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB400] px-6 py-3 font-sans text-xs sm:text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#e09e00] hover:scale-105 shadow-md"
            >
              <Home size={15} /> Return to Homepage
            </Link>

            <Link
              to="/products"
              className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-sans text-xs sm:text-sm font-medium transition-all duration-200 ${
                isDark
                  ? "border-white/20 text-white hover:border-[#FFB400] hover:text-[#FFB400] bg-white/5"
                  : "border-neutral-300 text-neutral-800 hover:border-[#FFB400] hover:text-[#FFB400] bg-white shadow-xs"
              }`}
            >
              <ShoppingBag size={15} /> Browse Collections
            </Link>
          </div>

          {/* Quick Discovery Tags */}
          <div className="mt-12 pt-8 border-t border-dashed border-neutral-300/30">
            <p
              className={`font-sans text-xs uppercase tracking-wider font-semibold mb-3 ${
                isDark ? "text-white/40" : "text-neutral-400"
              }`}
            >
              Popular Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_DISCOVERY_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-xs transition-colors duration-200 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white/70 hover:border-[#FFB400] hover:text-[#FFB400]"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-[#FFB400] hover:text-[#9E6E00] shadow-2xs"
                  }`}
                >
                  <Sparkles size={11} className="text-[#FFB400]" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
