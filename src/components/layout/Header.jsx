import formatNaira from "../../utils/formatNaira";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { isAuthenticated } from "../../api/client";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Ready-Made Collection", path: "/products", caret: true },
  { label: "Fabrics", path: "/fabrics", caret: true },
  { label: "New Arrivals", path: "/products" },
  { label: "Best Sellers", path: "/products" },
  { label: "Sale", path: "/products", sale: true },
  { label: "Track Order", path: "/track", highlight: true },
  { label: "About Us", path: "/about" },
];

const TICKER_ANNOUNCEMENTS = [
  "✨ Free Nationwide Shipping on orders above ₦100,000",
  "📦 Real-Time Order Tracking is Live — Track your package easily!",
  "🧵 Complimentary Luxury Fabric Swatches available upon request",
  "🎁 Join the Marvelam VIP Club — Get 10% Off your first order (Code: MARVELAMVIP10)",
  "🚚 Express Nationwide & International Delivery Available",
];

export default function Header({ searchQuery = "", setSearchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === "dark";

  const isLinkActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (tickerPaused) return;
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tickerPaused]);

  const handleNextTicker = () => {
    setTickerIndex((prev) => (prev + 1) % TICKER_ANNOUNCEMENTS.length);
  };

  const handlePrevTicker = () => {
    setTickerIndex((prev) => (prev - 1 + TICKER_ANNOUNCEMENTS.length) % TICKER_ANNOUNCEMENTS.length);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${
        isDark
          ? "border-white/10 bg-[#0F0F0F]/95 text-white"
          : "border-[#EAE6DF] bg-[#FBF9F5]/90 text-[#141414] shadow-[0_2px_15px_rgba(0,0,0,0.02)]"
      }`}
    >
      {/* Upgraded Sliding Notification Ticker Bar */}
      <div
        onMouseEnter={() => setTickerPaused(true)}
        onMouseLeave={() => setTickerPaused(false)}
        className={`flex items-center justify-between px-4 py-2 text-[11px] sm:px-8 transition-colors duration-300 border-b ${
          isDark
            ? "bg-[#0A0A0A] text-white/80 border-white/5"
            : "bg-[#F2ECE1] text-[#5A5247] border-[#E2DDCF]"
        }`}
      >
        {/* Left Side: Sliding Ticker Message with Navigation Chevrons */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-2xl">
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handlePrevTicker}
              aria-label="Previous announcement"
              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
            >
              <ChevronLeft size={13} className="text-[#FFB400]" />
            </button>
            <button
              type="button"
              onClick={handleNextTicker}
              aria-label="Next announcement"
              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
            >
              <ChevronRight size={13} className="text-[#FFB400]" />
            </button>
          </div>

          <div className="relative overflow-hidden h-5 flex items-center flex-1">
            <p
              key={tickerIndex}
              className="font-sans font-semibold text-[11px] text-[#FFB400] tracking-wide line-clamp-1 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              {TICKER_ANNOUNCEMENTS[tickerIndex]}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Links */}
        <nav className="hidden md:flex items-center gap-5 font-sans font-medium text-[11px] shrink-0">
          <Link to="/catalog" className="hover:text-[#FFB400] transition-colors">
            Store Locator
          </Link>
          <Link to="/track" className="hover:text-[#FFB400] transition-colors">
            Track Order
          </Link>
          <Link to="/catalog" className="hover:text-[#FFB400] transition-colors">
            Help &amp; Support
          </Link>
        </nav>
      </div>

      {/* Main Header Container */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <button
          type="button"
          className={`lg:hidden ${isDark ? "text-white" : "text-[#141414]"}`}
          aria-label="Open menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Menu size={24} />
        </button>

        {/* Brand Logo */}
        <Link to="/" className="shrink-0 text-center leading-none">
          <span className="block font-display text-3xl tracking-wide text-[#FFB400]">
            MAC
          </span>
          <span
            className={`block font-sans text-[9px] font-semibold tracking-[0.2em] ${
              isDark ? "text-white/70" : "text-[#5A5247]"
            }`}
          >
            MARVELAM
          </span>
          <span
            className={`block font-sans text-[7px] tracking-[0.15em] ${
              isDark ? "text-white/40" : "text-[#8C8375]"
            }`}
          >
            APPAREL &amp; CLOTHING
          </span>
        </Link>

        {/* Desktop Search Input */}
        <div className="relative hidden flex-1 max-w-xl md:block">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search dresses, fabrics, abayas..."
            className={`w-full rounded-full border py-2.5 pl-5 pr-11 font-sans text-sm transition-all duration-300 focus:border-[#FFB400] focus:outline-none ${
              isDark
                ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
                : "border-[#E2DDCF] bg-white text-[#141414] placeholder:text-[#9E978C] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            }`}
          />
          <button
            type="button"
            aria-label="Search"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFB400] text-[#0F0F0F] transition-transform duration-150 hover:scale-105 shadow-sm"
          >
            <Search size={15} />
          </button>
        </div>

        {/* Header Right Action Icons + Theme Toggle Pill + Live Cart Icon */}
        <div className="flex items-center gap-4 sm:gap-6 font-sans text-xs">
          {/* Theme Toggle Pill */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className={`group relative flex h-8 w-16 items-center rounded-full p-1 transition-all duration-300 shadow-inner ${
              isDark
                ? "bg-[#181818] border border-white/20 hover:border-[#FFB400]/50"
                : "bg-[#EFEAE1] border border-[#D5CFBF] hover:border-[#D4AF37]"
            }`}
          >
            <span
              className={`flex h-6 w-6 transform items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-out ${
                isDark
                  ? "translate-x-8 bg-[#FFB400] text-[#0F0F0F] shadow-[#FFB400]/40"
                  : "translate-x-0 bg-white text-[#C59B27] shadow-black/10"
              }`}
            >
              {isDark ? (
                <Sun size={13} className="stroke-[2.5]" />
              ) : (
                <Moon size={13} className="stroke-[2.5]" />
              )}
            </span>
          </button>

          <Link
            to={isAuthenticated() ? "/account" : "/login"}
            className={`hidden flex-col items-center gap-1 sm:flex hover:text-[#FFB400] ${
              isDark ? "text-white" : "text-[#141414]"
            }`}
          >
            <User size={20} />
            {isAuthenticated() ? "Account" : "Sign In"}
          </Link>

          <Link
            to="/catalog"
            className={`hidden flex-col items-center gap-1 sm:flex hover:text-[#FFB400] ${
              isDark ? "text-white" : "text-[#141414]"
            }`}
          >
            <Heart size={20} />
            Wishlist
          </Link>

          {/* Interactive Live Shopping Bag Button */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={`relative flex flex-col items-center gap-1 hover:text-[#FFB400] ${
              isDark ? "text-white" : "text-[#141414]"
            }`}
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag size={20} />
            <span className="absolute -right-2 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#FFB400] text-[9px] font-bold text-[#0F0F0F] shadow-sm">
              {cartCount}
            </span>
            Cart
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav
        className={`hidden border-t lg:block transition-colors duration-300 ${
          isDark ? "border-white/10" : "border-[#EAE6DF]"
        }`}
      >
        <ul className="mx-auto flex max-w-7xl items-center gap-8 px-8 py-3 font-sans text-sm">
          <li>
            <Link
              to="/catalog"
              className={`flex items-center gap-1.5 hover:text-[#FFB400] ${
                isDark ? "text-white/85" : "text-[#3A352F]"
              }`}
            >
              <Menu size={16} /> All Categories <ChevronDown size={14} />
            </Link>
          </li>
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 transition-colors duration-150 ${
                    active
                      ? "border-b-2 border-[#FFB400] pb-3 -mb-3 font-semibold text-[#FFB400]"
                      : link.highlight
                      ? "text-[#FFB400] hover:text-[#e09e00] font-medium"
                      : link.sale
                      ? "text-red-500 hover:text-red-400"
                      : isDark
                      ? "text-white/75 hover:text-[#FFB400]"
                      : "text-[#4A453E] hover:text-[#FFB400]"
                  }`}
                >
                  {link.label}
                  {link.caret && <ChevronDown size={13} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <nav
          className={`border-t px-4 py-4 lg:hidden transition-colors duration-300 ${
            isDark
              ? "border-white/10 bg-[#0F0F0F]"
              : "border-[#EAE6DF] bg-[#FBF9F5]"
          }`}
        >
          <div className="relative mb-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search dresses, fabrics, abayas..."
              className={`w-full rounded-full border py-2.5 pl-5 pr-11 font-sans text-sm focus:border-[#FFB400] focus:outline-none ${
                isDark
                  ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
                  : "border-[#E2DDCF] bg-white text-[#141414] placeholder:text-[#9E978C]"
              }`}
            />
            <Search
              size={15}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                isDark ? "text-white/50" : "text-[#8C8375]"
              }`}
            />
          </div>
          <ul className="flex flex-col gap-3 font-sans text-sm">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={
                      active
                        ? "font-semibold text-[#FFB400] flex items-center justify-between"
                        : link.highlight
                        ? "font-medium text-[#FFB400]"
                        : link.sale
                        ? "text-red-500"
                        : isDark
                        ? "text-white/80"
                        : "text-[#4A453E]"
                    }
                  >
                    <span>{link.label}</span>
                    {active && <span className="text-[10px] uppercase font-bold text-[#FFB400]">&bull;</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
