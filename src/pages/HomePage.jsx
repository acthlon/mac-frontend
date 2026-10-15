/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { ENDPOINTS } from "../api/client";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FeaturesBar from "../components/layout/FeaturesBar";
import QuickViewModal from "../components/catalog/QuickViewModal";
import ShopTheLook from "../components/catalog/ShopTheLook";
import UgcGallery from "../components/catalog/UgcGallery";
import VipClubBanner from "../components/catalog/VipClubBanner";
import HomeOrderTrackingTeaser from "../components/catalog/HomeOrderTrackingTeaser";
import StyleQuiz from "../components/catalog/StyleQuiz";
import RecentlyViewed from "../components/catalog/RecentlyViewed";
import WelcomeBriefModal from "../components/common/WelcomeBriefModal";
import { useTheme } from "../context/ThemeContext";
import formatNaira from "../utils/formatNaira";
import toTitleCase from "../utils/textFormatter";
import formatMaterialName from "../utils/materialNames";
import {
  Menu,
  ChevronRight,
  ChevronLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
  Ruler,
  Lock,
  BadgeCheck,
  Quote,
  Sparkles,
  Zap,
  Search,
  ArrowRight,
} from "lucide-react";

function InstagramIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

const FLASH_DEALS = [
  { id: 1, name: "Silk Embroidered Abaya", price: 45000, discounted_price: 38250, percent_discount: 15, seed: "flash-1", rating: 5, reviews: 14 },
  { id: 2, name: "Luxury Velvet Boubou", price: 60000, discounted_price: 48000, percent_discount: 20, seed: "flash-2", rating: 4.9, reviews: 9 },
  { id: 3, name: "Royal Gold Kaftan", price: 55000, discounted_price: 46750, percent_discount: 15, seed: "flash-3", rating: 5, reviews: 22 },
  { id: 4, name: "Chiffon Layered Dress", price: 40000, discounted_price: 32000, percent_discount: 20, seed: "flash-4", rating: 4.8, reviews: 18 },
  { id: 5, name: "Hand-Beaded Lace Set", price: 75000, discounted_price: 63750, percent_discount: 15, seed: "flash-5", rating: 5, reviews: 30 },
];

const NEW_ARRIVALS = [
  { id: 6, name: "Elegance Satin Abaya", price: 42000, seed: "new-1" },
  { id: 7, name: "Prestige Organza Boubou", price: 58000, seed: "new-2" },
  { id: 8, name: "Modern Cut-Out Dress", price: 48000, seed: "new-3" },
  { id: 9, name: "Floral Jacquard Two-Piece", price: 52000, seed: "new-4" },
  { id: 10, name: "Crystal Embellished Kaftan", price: 65000, seed: "new-5" },
  { id: 11, name: "Midnight Silk Wrap", price: 44000, seed: "new-6" },
];

const SIDEBAR_CATEGORIES = [
  "Abayas",
  "Boubous",
  "Kaftans",
  "Dresses",
  "Two Piece Sets",
  "Luxury Fabrics",
  "Lace Fabrics",
  "Silk Fabrics",
  "Ankara Premium",
  "Accessories",
  "New Arrivals",
];

const TOP_FEATURES = [
  { icon: ShieldCheck, title: "Premium Quality", copy: "Finest fabrics & exceptional finish" },
  { icon: Truck, title: "Nationwide Delivery", copy: "Fast, reliable & secure delivery" },
  { icon: ShieldCheck, title: "Secure Payment", copy: "100% secure & trusted checkout" },
  { icon: RotateCcw, title: "Easy Returns", copy: "Hassle-free returns within 7 days" },
  { icon: Headset, title: "Dedicated Support", copy: "We are here to help you always" },
];

const SHOP_CATEGORIES = [
  { name: "Abayas", seed: "cat-abayas", path: "/products?category=Abayas" },
  { name: "Kaftans", seed: "cat-kaftans", path: "/products?category=Kaftans" },
  { name: "Boubous", seed: "cat-boubous", path: "/products?category=Boubous" },
  { name: "Dresses", seed: "cat-dresses", path: "/products?category=Dresses" },
  { name: "Luxury Lace", seed: "cat-lace", path: "/fabrics" },
  { name: "Silk Fabrics", seed: "cat-silk", path: "/fabrics" },
  { name: "Accessories", seed: "cat-accessories", path: "/products" },
];

const FABRICS = [
  { name: "Silk", seed: "fabric-silk" },
  { name: "Chiffon", seed: "fabric-chiffon" },
  { name: "Satin", seed: "fabric-satin" },
  { name: "Lace", seed: "fabric-lace" },
  { name: "Jacquard", seed: "fabric-jacquard" },
  { name: "Ankara", seed: "fabric-ankara" },
];

const SERVICE_CARDS = [
  {
    title: "Custom Tailoring",
    tagline: "Made Just For You",
    copy: "Perfect fit. Your style. Our expertise.",
    cta: "Book Now",
    seed: "service-tailoring",
    path: "/products",
  },
  {
    title: "Wholesale & Bulk Orders",
    tagline: "Retail & Boutiques",
    copy: "Special prices for retailers and bulk fabric buyers.",
    cta: "Learn More",
    seed: "service-wholesale",
    path: "/fabrics",
  },
  {
    title: "Bridal & Event Packages",
    tagline: "For Loved Ones",
    copy: "The perfect luxury outfits & group fabrics for your loved ones.",
    cta: "Explore Packages",
    seed: "service-giftcards",
    path: "/fabrics",
  },
];

const BOTTOM_FEATURES = [
  { icon: ShieldCheck, title: "Premium Quality", copy: "Finest fabrics & exceptional finish" },
  { icon: Ruler, title: "Perfect Fit", copy: "Tailored for comfort and elegance" },
  { icon: BadgeCheck, title: "Trusted Brand", copy: "Loved by thousands of women" },
  { icon: Lock, title: "Secure Shopping", copy: "Your data is safe with us" },
  { icon: RotateCcw, title: "Hassle Free Returns", copy: "Easy returns within 7 days" },
];

const TESTIMONIALS = [
  {
    quote: "The quality is unmatched. Every piece I've ordered from MAC is elegant and worth every penny.",
    name: "Aisha M.",
    seed: "test-1",
  },
  {
    quote: "MAC fabrics are everything! So soft, luxurious and perfect for my brand.",
    name: "Fatimah R.",
    seed: "test-2",
  },
  {
    quote: "My go-to brand for every occasion. Classy, modest and simply the best.",
    name: "Khadijah Y.",
    seed: "test-3",
  },
];

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Stars Component �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function Stars({ rating, size = 11, isDark = true }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(Number(rating) || 0)
              ? "fill-[#FFB400] text-[#FFB400]"
              : isDark
              ? "fill-transparent text-white/25"
              : "fill-transparent text-neutral-300"
          }
        />
      ))}
    </div>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Countdown Hook & Block �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function useCountdown(initial) {
  const [remaining, setRemaining] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return { days, hours, minutes, seconds };
}

function CountdownBlock({ value, label, isDark }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className={`font-display text-xl sm:text-2xl font-bold tabular-nums ${isDark ? "text-white" : "text-neutral-900"}`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-sans text-[10px] font-bold text-[#FFB400]">
        {label[0].toLowerCase()}
      </span>
    </div>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Category Sidebar �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function CategorySidebar({ isDark, productCategories = [], materialCategories = [] }) {
  const navigate = useNavigate();

  const pCats = productCategories.length > 0
    ? productCategories.map((c) => ({
        id: c.id,
        name: c.name || c,
        slug: c.slug || (c.name ? c.name.toLowerCase().replace(/_/g, "-") : "all"),
      }))
    : [
        { name: "Abayas", slug: "abayas" },
        { name: "Boubous", slug: "boubous" },
        { name: "Kaftans", slug: "kaftans" },
        { name: "Dresses", slug: "dresses" },
        { name: "Two Piece Sets", slug: "two-piece" },
      ];

  const mCats = materialCategories.length > 0
    ? materialCategories.map((c) => ({
        id: c.id,
        name: formatMaterialName(c.name || c),
        slug: c.slug || (c.name ? c.name.toLowerCase() : "fabrics"),
      }))
    : [
        { name: "Luxury Fabrics", slug: "luxury" },
        { name: "Lace Fabrics", slug: "lac" },
        { name: "Silk Fabrics", slug: "slk" },
        { name: "Ankara Premium", slug: "ank" },
      ];

  return (
    <aside
      className={`hidden w-64 shrink-0 rounded-2xl border transition-all duration-300 lg:block ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      }`}
    >
      <button
        type="button"
        onClick={() => navigate("/products")}
        className={`flex w-full items-center justify-between border-b px-5 py-4 font-sans text-sm font-semibold ${
          isDark
            ? "border-white/10 text-white/90"
            : "border-[#EAE6DF] text-[#141414]"
        }`}
      >
        <span className="flex items-center gap-2">
          <Menu size={16} className="text-[#FFB400]" /> All Categories
        </span>
        <ChevronRight size={15} className={isDark ? "text-white/40" : "text-neutral-400"} />
      </button>

      <div className="py-2 font-sans text-xs">
        {/* Dresses & Wears Section */}
        <div className="px-5 pt-3 pb-1">
          <span className="font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#FFB400]">
            dY`- Ready-To-Wear
          </span>
        </div>
        <ul className="mb-2">
          {pCats.map((cat) => (
            <li key={cat.id || cat.slug}>
              <Link
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className={`flex items-center justify-between px-5 py-2 transition-colors duration-150 ${
                  isDark
                    ? "text-white/70 hover:bg-white/5 hover:text-[#FFB400]"
                    : "text-[#4A453E] hover:bg-neutral-100 hover:text-[#D4AF37]"
                }`}
              >
                <span>{toTitleCase(cat.name)}</span>
                <span className="rounded bg-[#FFB400]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#FFB400]">
                  Dress
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Fabrics & Materials Section */}
        <div className="px-5 pt-3 pb-1 border-t border-white/10">
          <span className="font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#FFB400]">
            dY� Fabrics &amp; Materials
          </span>
        </div>
        <ul>
          {mCats.map((cat) => (
            <li key={cat.id || cat.slug}>
              <Link
                to={`/fabrics?category=${encodeURIComponent(cat.slug)}`}
                className={`flex items-center justify-between px-5 py-2 transition-colors duration-150 ${
                  isDark
                    ? "text-white/70 hover:bg-white/5 hover:text-[#FFB400]"
                    : "text-[#4A453E] hover:bg-neutral-100 hover:text-[#D4AF37]"
                }`}
              >
                <span>{toTitleCase(cat.name)}</span>
                <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-purple-400">
                  Fabric
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/products?sale=true"
              className="mt-2 block px-5 py-2 font-semibold text-red-500 hover:bg-red-500/10"
            >
              Sale %
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Hero Banner Slider �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

const HERO_SLIDES = [
  {
    id: 1,
    tag: "New Collection 2026",
    titlePrefix: "Timeless ",
    titleHighlight: "Elegance",
    subtitle: "Luxury Modest Fashion",
    description: "Premium ready-made dresses and luxurious fabrics crafted for the modern, modest and confident woman.",
    primaryCta: "Shop Dresses",
    primaryPath: "/products",
    secondaryCta: "Shop Fabrics",
    secondaryPath: "/fabrics",
    image: "https://picsum.photos/seed/mac-hero-1/1000/560",
  },
  {
    id: 2,
    tag: "Exclusive Fabrics",
    titlePrefix: "Royal Velvet & ",
    titleHighlight: "Lace",
    subtitle: "Exquisite Textures & Colours",
    description: "Explore our hand-picked collection of imported silks, laces, and textured fabrics for your bespoke creations.",
    primaryCta: "Explore Fabrics",
    primaryPath: "/fabrics",
    secondaryCta: "Custom Tailoring",
    secondaryPath: "/products",
    image: "https://picsum.photos/seed/mac-hero-2/1000/560",
  },
  {
    id: 3,
    tag: "Limited Time Offer",
    titlePrefix: "The Ramadan ",
    titleHighlight: "Edition",
    subtitle: "Elegant Abayas & Boubous",
    description: "Statement pieces designed for celebratory occasions and everyday grace. Up to 20% off selected designs.",
    primaryCta: "Shop Sale",
    primaryPath: "/products?sale=true",
    secondaryCta: "View All",
    secondaryPath: "/products",
    image: "https://picsum.photos/seed/mac-hero-3/1000/560",
  },
];

function Hero({ isDark, banners = [], heroActions }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const baseSlides = banners.length > 0
    ? banners.map((b, i) => ({
        id: b.id || i + 1,
        tag: b.tag || "Collection 2026",
        titlePrefix: b.title || "Timeless Elegance",
        titleHighlight: "",
        subtitle: b.subtitle || "Luxury Modest Fashion",
        description: b.description || "Premium ready-made dresses and luxurious fabrics crafted for the modern, modest and confident woman.",
        primaryCta: heroActions?.button_text_dresses || "Shop Dresses",
        primaryPath: "/products",
        secondaryCta: heroActions?.button_text_fabrics || "Shop Fabrics",
        secondaryPath: "/fabrics",
        image: b.image || b.banner_image || HERO_SLIDES[i % HERO_SLIDES.length]?.image || `https://picsum.photos/seed/mac-banner-${b.id || i}/1000/560`,
      }))
    : HERO_SLIDES;

  const slideList = baseSlides.map((s, idx) => ({
    ...s,
    primaryCta: idx === 0 && heroActions?.button_text_dresses ? heroActions.button_text_dresses : s.primaryCta,
    secondaryCta: idx === 0 && heroActions?.button_text_fabrics ? heroActions.button_text_fabrics : s.secondaryCta,
  }));

  useEffect(() => {
    if (isPaused || slideList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slideList.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideList.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slideList.length) % slideList.length);
  };

  const slide = slideList[currentSlide] || slideList[0];

  return (
    <div
      className="relative flex-1 overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Crossfade */}
      {slideList.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <img
            src={s.image}
            alt={s.titlePrefix}
            className="h-[180px] w-full object-cover sm:h-[460px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/70 to-transparent" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="relative z-10 flex min-h-[180px] sm:min-h-[460px] max-w-md flex-col justify-center gap-1 sm:gap-3.5 py-3 px-4 sm:py-10 sm:pl-20 sm:pr-10">
        <span className="inline-flex items-center gap-1 w-fit rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-2 py-0.5 sm:px-3 sm:py-1 font-sans text-[8px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
          <Sparkles size={12} /> {slide.tag}
        </span>
        <h1 className="font-display text-xl leading-[1.05] text-[#F9FAFB] sm:text-5xl transition-all duration-300">
          {slide.titlePrefix}{slide.titleHighlight && <span className="text-[#FFB400]"> {slide.titleHighlight}</span>}
        </h1>
        <p className="font-sans text-[9px] sm:text-xs font-semibold uppercase tracking-wide text-white/80">
          {slide.subtitle}
        </p>
        <p className="font-sans text-sm leading-relaxed text-white/70 hidden sm:block">
          {slide.description}
        </p>
        <div className="mt-1 sm:mt-2 flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate(slide.primaryPath)}
            className="rounded sm:rounded-xl bg-[#FFB400] px-2 py-0.5 sm:px-6 sm:py-3 font-sans text-[7px] sm:text-sm font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105 shadow-sm sm:shadow-lg shadow-[#FFB400]/20"
          >
            {slide.primaryCta}
          </button>
          <button
            type="button"
            onClick={() => navigate(slide.secondaryPath)}
            className="rounded-xl border border-white/30 px-6 py-3 font-sans text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-[#FFB400] hover:text-[#FFB400]"
          >
            {slide.secondaryCta}
          </button>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      {slideList.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={handlePrev}
            className="absolute left-3.5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/60 text-white backdrop-blur-sm transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-md"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={handleNext}
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/60 text-white backdrop-blur-sm transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-md"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Pagination Slide Dots */}
      {slideList.length > 1 && (
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-6 bg-[#FFB400]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Feature Strip �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function FeatureStrip({ items, isDark }) {
  return (
    <section
      className={`border-y py-6 transition-colors duration-300 ${
        isDark ? "border-white/10" : "border-[#EAE6DF]"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 sm:px-8 lg:grid-cols-5">
        {items.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:text-left">
            <Icon size={22} className="shrink-0 text-[#FFB400]" />
            <div>
              <p className={`font-sans text-xs font-semibold ${isDark ? "text-white" : "text-[#141414]"}`}>
                {title}
              </p>
              <p className={`font-sans text-[11px] ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                {copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Shop By Category �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function ShopByCategory({ isDark, productCategories = [], materialCategories = [] }) {
  const scrollRef = React.useRef(null);

  const pCats = productCategories.map((c, i) => {
    const rawName = c.name || c;
    const slug = c.slug || (c.name ? c.name.toLowerCase().replace(/_/g, "-") : "all");
    return {
      name: toTitleCase(rawName),
      seed: `cat-prod-${c.id || i}`,
      path: `/products?category=${encodeURIComponent(slug)}`,
      typeLabel: "Ready-To-Wear",
      isMaterial: false,
    };
  });

  const mCats = materialCategories.map((c, i) => {
    const rawName = c.name || c;
    const friendlyName = formatMaterialName(rawName);
    const slug = c.slug || (c.name ? c.name.toLowerCase() : "fabrics");
    return {
      name: toTitleCase(friendlyName),
      seed: `cat-mat-${c.id || i}`,
      path: `/fabrics?category=${encodeURIComponent(slug)}`,
      typeLabel: "Fabric",
      isMaterial: true,
    };
  });

  const combined = [...pCats, ...mCats];

  const displayCategories = combined.length > 0
    ? combined
    : SHOP_CATEGORIES.map((c) => ({
        ...c,
        typeLabel: c.name.toLowerCase().includes("fabric") || c.name.toLowerCase().includes("lace") || c.name.toLowerCase().includes("silk") ? "Fabric" : "Dress",
        isMaterial: c.name.toLowerCase().includes("fabric"),
      }));

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
          <span className="h-4 w-1 bg-[#FFB400]" /> Shop by Category
        </h2>
      </div>

      <div className="relative mt-5 group">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Previous categories"
          className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Categories Scroll Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayCategories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="group/item flex w-36 shrink-0 flex-col sm:w-44">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-sm">
                <span
                  className={`absolute left-2 top-2 z-10 rounded-md px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                    cat.isMaterial
                      ? "bg-purple-600 text-white"
                      : "bg-[#FFB400] text-[#0F0F0F]"
                  }`}
                >
                  {cat.typeLabel}
                </span>
                <img
                  src={`https://picsum.photos/seed/${cat.seed}/240/240`}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                />
              </div>
              <p className={`mt-2.5 font-sans text-xs font-semibold uppercase tracking-wide line-clamp-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
                {toTitleCase(cat.name)}
              </p>
              <span className="text-[11px] font-semibold text-[#FFB400] group-hover/item:underline">
                Shop Now �+'
              </span>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Next categories"
          className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Product Card (Unified for Flash Deals & New Arrivals) �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function ProductCard({ product, isDark, badge }) {
  const navigate = useNavigate();

  const price = Number(product.discounted_price || product.price) || 0;
  const wasPrice = Number(product.price) || price;
  const discountPercent = product.percent_discount
    ? Math.round(product.percent_discount)
    : product.discount || (wasPrice > price ? Math.round(((wasPrice - price) / wasPrice) * 100) : 0);

  // Extract clean slug
  let extractedSlug = product.slug;
  if (!extractedSlug && product.item_detail_url) {
    const parts = product.item_detail_url.split("/").filter(Boolean);
    const prodIdx = parts.indexOf("products");
    if (prodIdx !== -1 && parts[prodIdx + 1]) {
      extractedSlug = parts[prodIdx + 1];
    }
  }
  const productSlug =
    extractedSlug ||
    (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "product");
  const productId = product.id || product.pk || "item";

  const fallbackImage = `https://picsum.photos/seed/${product.id || product.seed || "marvelam"}/300/380`;
  const [imgSrc, setImgSrc] = useState(product.pry_image || product.image || fallbackImage);

  // Keep state updated if product changes
  useEffect(() => {
    setImgSrc(product.pry_image || product.image || fallbackImage);
  }, [product.pry_image, product.image, fallbackImage]);

  const rating = Number(product.avg_rating || product.rating) || 5;
  const reviewCount = Number(product.review_count || product.reviews) || 0;

  return (
    <article
      onClick={() => navigate(`/products/${productSlug}/${productId}`)}
      className={`group flex shrink-0 flex-col overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 ${
        isDark
          ? "border-white/10 bg-[#151515] hover:border-[#FFB400]/50 hover:shadow-lg"
          : "border-[#EAE6DF] bg-white shadow-sm hover:border-[#FFB400] hover:shadow-md"
      }`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1A1A1A]">
        {badge ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-[#FFB400] px-2 py-0.5 font-sans text-[10px] font-bold text-[#0F0F0F] shadow uppercase tracking-wide">
            {badge}
          </span>
        ) : discountPercent > 0 ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-red-600 px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow">
            -{discountPercent}%
          </span>
        ) : null}
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc(fallbackImage)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <h3
            className={`font-sans text-xs font-medium leading-snug line-clamp-1 transition-colors group-hover:text-[#FFB400] ${
              isDark ? "text-white/90" : "text-[#141414]"
            }`}
          >
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-sans text-sm font-bold text-[#FFB400]">
              {formatNaira(price)}
            </span>
            {wasPrice > price && (
              <span className={`font-sans text-[11px] line-through ${isDark ? "text-white/35" : "text-neutral-400"}`}>
                {formatNaira(wasPrice)}
              </span>
            )}
          </div>
          <div className="mt-2.5 flex items-center gap-1 border-t border-white/10 pt-2">
            <Stars rating={rating} isDark={isDark} />
            <span className={`font-sans text-[10px] ${isDark ? "text-white/40" : "text-neutral-400"}`}>
              ({reviewCount})
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function FlashSale({ isDark, onQuickView, featuredProducts = [], newArrivals = [] }) {
  const { days, hours, minutes, seconds } = useCountdown(2 * 86400 + 14 * 3600 + 45 * 60 + 30);
  const navigate = useNavigate();

  // Find discounted items from backend arrivals if featured is empty
  const discountedArrivals = newArrivals.filter(
    (p) => Number(p.discounted_price) && Number(p.price) && Number(p.discounted_price) < Number(p.price)
  );

  const flashProducts =
    featuredProducts.length > 0
      ? featuredProducts.slice(0, 5)
      : discountedArrivals.length > 0
      ? discountedArrivals.slice(0, 5)
      : FLASH_DEALS;

    const scrollRef = React.useRef(null);
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
return (
    <section className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8">
      <div
        className={`rounded-2xl border p-6 transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-[#151515]"
            : "border-[#EAE6DF] bg-white shadow-sm"
        }`}
      >
        {/* Top Header Strip with Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-white/10">
          <div>
            <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#FFB400] flex items-center gap-1.5"><Zap size={14} className="text-[#FFB400] fill-[#FFB400]" /> Limited Offer Deals</span>
            <h2 className={`font-display text-2xl sm:text-3xl font-semibold mt-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
              Flash Sale Offers
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 sm:gap-3 rounded-full border px-4 py-2 sm:px-6 sm:py-2.5 shadow-inner ${isDark ? "border-[#FFB400]/20 bg-[#FFB400]/5" : "border-[#FFB400]/30 bg-[#FFB400]/10"}`}>
                <CountdownBlock value={days} label="Days" isDark={isDark} />
                <span className="text-[#FFB400]/40 font-bold mb-1">:</span>
                <CountdownBlock value={hours} label="Hrs" isDark={isDark} />
                <span className="text-[#FFB400]/40 font-bold mb-1">:</span>
                <CountdownBlock value={minutes} label="Mins" isDark={isDark} />
                <span className="text-[#FFB400]/40 font-bold mb-1">:</span>
                <CountdownBlock value={seconds} label="Secs" isDark={isDark} />
              </div>

            <button
              type="button"
              onClick={() => navigate("/products?sale=true")}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#FFB400] px-4 py-2.5 font-sans text-xs font-semibold text-[#FFB400] transition-colors duration-200 hover:bg-[#FFB400] hover:text-[#0F0F0F]"
            >
              View All Deals <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Wide Full-Width Product Grid */}
        <div className="relative group/slider mt-6 flex items-center min-w-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous products"
              className="absolute -left-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full snap-x snap-mandatory"
            >
              {flashProducts.map((p) => (
                <div key={p.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
                  <ProductCard product={p} isDark={isDark} />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next products"
              className="absolute -right-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronRight size={16} />
            </button>
</div>
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? New Arrivals Section (API Connected) �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function NewArrivals({ isDark, newArrivals = [] }) {
  const newProducts = newArrivals.length > 0
    ? newArrivals.slice(0, 8)
    : NEW_ARRIVALS;

    const scrollRef = React.useRef(null);
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
return (
    <section className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
          <span className="h-4 w-1 bg-[#FFB400]" /> New Arrivals
        </h2>
        <Link
          to="/products"
          className={`flex items-center gap-1 font-sans text-xs font-semibold transition-colors hover:text-[#FFB400] ${
            isDark ? "text-white/60" : "text-neutral-600"
          }`}
        >
          View All New Arrivals <ChevronRight size={13} />
        </Link>
      </div>
        <div className="relative group/slider mt-5 flex items-center min-w-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous products"
              className="absolute -left-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full snap-x snap-mandatory"
            >
              {newProducts.map((p) => (
                <div key={p.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
                  <ProductCard product={p} isDark={isDark} badge="New" />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next products"
              className="absolute -right-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronRight size={16} />
            </button>
        </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Luxurious Fabrics Section �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function LuxuriousFabrics({ isDark, materialCategories = [] }) {
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);

  const displayFabrics = materialCategories.length > 0
    ? materialCategories.map((m, i) => {
        const rawName = m.name || m;
        const friendlyName = formatMaterialName(rawName);
        return {
          name: friendlyName,
          slug: m.slug || (m.name ? m.name.toLowerCase() : "fabrics"),
          seed: `fabric-${m.id || i}`,
        };
      })
    : FABRICS.map((f) => ({ ...f, slug: f.name.toLowerCase() }));

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8">
      <div
        className={`grid gap-6 rounded-2xl border p-6 lg:grid-cols-[260px_1fr] transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-[#151515]"
            : "border-[#EAE6DF] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        }`}
      >
        <div className="flex flex-col justify-center gap-3">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
            Luxurious Fabrics
          </p>
          <h2 className={`font-display text-3xl font-semibold ${isDark ? "text-[#F9FAFB]" : "text-[#141414]"}`}>
            Crafted to Perfection
          </h2>
          <p className={`font-sans text-sm leading-relaxed ${isDark ? "text-white/55" : "text-neutral-600"}`}>
            Discover our exclusive range of premium fabrics in different materials, textures and colors.
          </p>
          <button
            type="button"
            onClick={() => navigate("/fabrics")}
            className="mt-2 flex w-fit items-center gap-2 rounded-xl bg-[#FFB400] px-5 py-3 font-sans text-xs font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105 shadow-md"
          >
            Explore Fabrics <ChevronRight size={14} />
          </button>
        </div>

        {/* Fabrics Scroll Container with Side Overlay Arrows */}
        <div className="relative group/fabrics flex items-center min-w-0">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous fabrics"
            className="absolute -left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full"
          >
            {displayFabrics.map((fabric) => (
              <Link
                key={fabric.name}
                to={`/fabrics?category=${encodeURIComponent(fabric.slug)}`}
                className="group/item flex w-32 shrink-0 flex-col sm:w-36"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-[#1A1A1A]">
                  <img
                    src={`https://picsum.photos/seed/${fabric.seed}/200/200`}
                    alt={fabric.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                  />
                </div>
                <p className={`mt-2 font-sans text-xs font-semibold uppercase tracking-wide line-clamp-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
                  {toTitleCase(fabric.name)}
                </p>
                <span className="text-[10px] font-semibold text-[#FFB400] group-hover/item:underline">Shop Now �+'</span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next fabrics"
            className="absolute -right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Service Cards Section �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function ServiceCards() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8">
      <div className="grid gap-5 lg:grid-cols-3">
        {SERVICE_CARDS.map((card) => (
          <div key={card.title} className="relative overflow-hidden rounded-2xl shadow-lg group">
            <img
              src={`https://picsum.photos/seed/${card.seed}/500/360`}
              alt={card.title}
              className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start justify-end">
              {card.tagline && (
                <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[#FFB400]">
                  {card.tagline}
                </p>
              )}
              <h3 className="mt-1 font-display text-2xl font-semibold text-[#F9FAFB]">{card.title}</h3>
              <p className="mt-1 font-sans text-xs text-white/70">{card.copy}</p>
              <button
                type="button"
                onClick={() => navigate(card.path)}
                className="mt-4 flex items-center gap-1.5 rounded-xl border border-[#FFB400] px-4 py-2 font-sans text-xs font-semibold text-[#FFB400] backdrop-blur-sm transition-all duration-200 hover:bg-[#FFB400] hover:text-[#0F0F0F]"
              >
                {card.cta} <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Style Finder Teaser Card �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function StyleFinderTeaserCard({ isDark }) {
  const navigate = useNavigate();
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-8">
      <div
        className={`rounded-xl sm:rounded-2xl border p-4 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 transition-all duration-300 ${
          isDark
            ? "border-[#FFB400]/30 bg-gradient-to-r from-[#181818] via-[#1E1E1E] to-[#181818]"
            : "border-[#FFB400]/40 bg-gradient-to-r from-[#FFFDF9] via-[#FDF8EE] to-[#FFFDF9] shadow-sm"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFB400]/15 text-[#FFB400]">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#FFB400]">
              Personalized Styling Assistant
            </span>
            <h3 className={`font-display text-lg sm:text-2xl font-semibold mt-0.5 ${isDark ? "text-white" : "text-[#141414]"}`}>
              Unsure What to Wear for Your Next Event?
            </h3>
            <p className={`font-sans text-[10px] sm:text-xs mt-1 ${isDark ? "text-white/60" : "text-neutral-600"}`}>
              Answer 2 quick questions to instantly discover tailored dresses, boubous, and luxury fabrics for your specific occasion.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/style-finder")}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB400] px-5 py-3 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-105 shadow-md shadow-[#FFB400]/20"
        >
          <span>Take 30-Sec Style Quiz</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Lookbook Teaser Card �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function LookbookTeaserCard({ isDark }) {
  const navigate = useNavigate();
  return (
    <section className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8">
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xl transition-all duration-300 group ${
          isDark ? "border-white/10 bg-[#151515]" : "border-[#EAE6DF] bg-white"
        }`}
      >
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="p-5 sm:p-10 flex flex-col items-start gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-2 py-0.5 sm:px-3 sm:py-1 font-sans text-[8px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
              <Sparkles size={13} /> Official 2026 Collection
            </span>
            <h2 className={`font-display text-2xl sm:text-4xl font-semibold ${isDark ? "text-white" : "text-[#141414]"}`}>
              Interactive <span className="text-[#FFB400]">Lookbook</span>
            </h2>
            <p className={`font-sans text-[10px] sm:text-sm leading-relaxed ${isDark ? "text-white/65" : "text-neutral-600"}`}>
              See how our velvet boubous, silk headwraps, and crystal evening clutches are styled together on real models. Hover or tap hotspot pins to inspect individual items or purchase the complete ensemble.
            </p>
            <button
              type="button"
              onClick={() => navigate("/lookbook")}
              className="mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#FFB400] px-4 py-2 sm:px-6 sm:py-3.5 font-sans text-[10px] sm:text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-105 shadow-md sm:shadow-lg shadow-[#FFB400]/20 w-full sm:w-auto justify-center"
            >
              <span>Explore Interactive Lookbook</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="relative h-48 sm:h-80 w-full overflow-hidden bg-neutral-900">
            <img
              src="https://picsum.photos/seed/mac-lookbook-1/800/600"
              alt="Interactive Lookbook Preview"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Full-Width Testimonials & Clean Social Bar �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

function TestimonialsAndSocial({ isDark, reviews = [], averageRating, totalCustomers }) {
  const [activeSocial, setActiveSocial] = useState("instagram");

  const displayReviews = reviews.length > 0
    ? reviews.map((r, i) => ({
        id: r.id || i,
        quote: r.comment || "Great experience shopping with Marvelam!",
        name: r.username || "Verified Customer",
        rating: r.rating || 5,
      }))
    : TESTIMONIALS;

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    if (displayReviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % displayReviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [displayReviews.length]);

  const activeReview = displayReviews[activeReviewIndex] || displayReviews[0];
  const ratingScore = averageRating && Number(averageRating) > 0 ? Number(averageRating).toFixed(1) : "4.9";
  const customerCountText = totalCustomers && Number(totalCustomers) > 0 ? `${totalCustomers}+ Verified Women Worldwide` : "1,200+ Verified Women Worldwide";

  const SOCIAL_LINKS = [
    { id: "instagram", name: "Instagram", icon: InstagramIcon, url: "https://instagram.com" },
    { id: "facebook", name: "Facebook", icon: FacebookIcon, url: "https://facebook.com" },
    { id: "tiktok", name: "TikTok", icon: TikTokIcon, url: "https://tiktok.com" },
    { id: "whatsapp", name: "WhatsApp", icon: WhatsAppIcon, url: "https://wa.me/" },
  ];

  return (
    <section className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8">
      {/* Option A: Option A Compact 1-Row Luxury Trust Bar */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-[#151515]"
            : "border-[#EAE6DF] bg-white shadow-sm"
        }`}
      >
        {/* Left: Star Rating Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFB400]/15 text-[#FFB400] font-bold font-sans text-sm">
            �~. {ratingScore}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Stars rating={Math.round(Number(ratingScore))} size={13} isDark={isDark} />
              <span className="font-sans text-xs font-bold text-[#FFB400]">{ratingScore} / 5.0</span>
            </div>
            <p className={`font-sans text-[11px] ${isDark ? "text-white/60" : "text-neutral-500"}`}>
              {customerCountText}
            </p>
          </div>
        </div>

        {/* Center: Soft Auto-Fading Customer Quote Pill */}
        <div className="flex-1 max-w-xl text-center md:text-left px-2">
          <p
            key={activeReviewIndex}
            className={`font-sans text-xs italic line-clamp-1 animate-in fade-in slide-in-from-bottom-1 duration-300 ${
              isDark ? "text-white/80" : "text-neutral-700"
            }`}
          >
            "{activeReview.quote || activeReview.comment}" �?" <span className="font-bold not-italic text-[#FFB400]">{activeReview.name}</span>
          </p>
        </div>

        {/* Right: Social Handle Button */}
        <Link
          to="/community"
          className="shrink-0 flex items-center gap-1.5 rounded-xl border border-[#FFB400] px-3.5 py-2 font-sans text-xs font-semibold text-[#FFB400] transition-colors hover:bg-[#FFB400] hover:text-[#0F0F0F]"
        >
          <span>See Client Gallery</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Clean Luxury Social Bar */}
      <div
        className={`mt-6 rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-gradient-to-r from-[#151515] via-[#1A1A1A] to-[#151515]"
            : "border-[#EAE6DF] bg-gradient-to-r from-[#F7F5F0] via-white to-[#F7F5F0] shadow-sm"
        }`}
      >
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
            Join Our Community
          </p>
          <h3 className={`font-display text-2xl font-semibold mt-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
            Follow Us <span className="text-[#FFB400]">@marvelam.apparel</span>
          </h3>
          <p className={`font-sans text-[10px] sm:text-xs mt-1 ${isDark ? "text-white/60" : "text-neutral-600"}`}>
            Tag us in your photos for a chance to be featured on our official channel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {SOCIAL_LINKS.map(({ id, name, icon: Icon, url }) => {
            const isActive = activeSocial === id;
            return (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={() => setActiveSocial(id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-sans text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                  isActive
                    ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F] shadow-md font-bold"
                    : isDark
                    ? "border-white/20 bg-white/5 text-white/80 hover:border-[#FFB400]/50 hover:text-[#FFB400]"
                    : "border-neutral-300 bg-white text-neutral-800 hover:border-[#FFB400] hover:text-[#FFB400]"
                }`}
              >
                <Icon size={16} /> {name}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? Main HomePage Component �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"? */

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homeData, setHomeData] = useState({
    banners: [],
    heroActions: null,
    productCategories: [],
    materialCategories: [],
    featuredProducts: [],
    newArrivals: [],
    reviews: [],
    averageRating: null,
    totalCustomers: null,
    satisfactionRate: null,
  });
  const navigate = useNavigate();

  // Fetch homepage data directly via centralized apiClient
  useEffect(() => {
    let isMounted = true;
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(ENDPOINTS.HOME);
        if (response.data && isMounted) {
          setHomeData({
            banners: response.data.banners || [],
            heroActions: response.data.hero_actions || null,
            productCategories: response.data.product_categories || [],
            materialCategories: response.data.material_categories || [],
            featuredProducts: response.data.featured_products || [],
            newArrivals: response.data.new_arrivals || [],
            reviews: response.data.reviews || [],
            averageRating: response.data.average_rating,
            totalCustomers: response.data.total_customers,
            satisfactionRate: response.data.satisfaction_rate,
          });
        }
      } catch (err) {
        console.warn("HomePage API notice:", err.message);
        if (isMounted) {
          setError(err.message || "Failed to load live data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"
      }`}
    >
      <WelcomeBriefModal isDark={isDark} />

      <Header />

      {/* Subtle Live Backend Status Indicator */}
      {loading && (
        <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-3">
          <div
            className={`flex items-center justify-between rounded-xl px-4 py-2 text-xs border ${
              isDark
                ? "bg-[#161616] border-white/10 text-white/70"
                : "bg-[#F4EFE6] border-[#E8E2D5] text-[#554D40]"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FFB400] animate-ping" />
              Syncing live catalog with Marvelam backend...
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#FFB400] font-semibold">Live Backend</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-3">
          <div className="flex items-center justify-between rounded-xl px-4 py-2 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <span>Notice: Backend cold start in progress ({error}). Showing cached items.</span>
            <button
              onClick={() => window.location.reload()}
              className="underline text-[11px] font-semibold ml-2 hover:text-[#FFB400]"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <main className="pb-16">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-6 sm:px-8">

          <Hero
            isDark={isDark}
            banners={homeData.banners}
            heroActions={homeData.heroActions}
          />
        </div>

        <StyleFinderTeaserCard isDark={isDark} />

        <ShopByCategory
          isDark={isDark}
          productCategories={homeData.productCategories}
          materialCategories={homeData.materialCategories}
        />
        <LookbookTeaserCard isDark={isDark} />
        <FlashSale
          isDark={isDark}
          featuredProducts={homeData.featuredProducts}
          newArrivals={homeData.newArrivals}
          onQuickView={(item) => setQuickViewItem(item)}
        />
        <NewArrivals
          isDark={isDark}
          newArrivals={homeData.newArrivals}
        />
        <LuxuriousFabrics
          isDark={isDark}
          materialCategories={homeData.materialCategories}
        />
        <ServiceCards />
        <VipClubBanner isDark={isDark} />
        <HomeOrderTrackingTeaser isDark={isDark} />

        <RecentlyViewed
          isDark={isDark}
          onQuickView={(item) => setQuickViewItem(item)}
        />
        <TestimonialsAndSocial
          isDark={isDark}
          reviews={homeData.reviews}
          averageRating={homeData.averageRating}
          totalCustomers={homeData.totalCustomers}
        />
      </main>

      <FeaturesBar />
      <Footer />

      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onViewFullDetails={(item) =>
          navigate(`/products/${item.slug || "product"}/${item.id}`)
        }
      />
    </div>
  );
}
