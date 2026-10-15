import React, { useState } from "react";
import {
  Sparkles,
  Scissors,
  Layers,
  Award,
  CheckCircle2,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Truck,
  Users,
  Compass,
  Building,
  Target,
  ChevronRight,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";

/**
 * MAC — Marvelam Apparel & Clothing
 * Corporate / Business "About Us" Page
 *
 * Modeled after established e-commerce company about pages (Jumia & Temu):
 * 1. Sub-nav jump links: Our Vision | Marvelam Today | Our History | Milestones & Craft
 * 2. Clear brand definitions ("What is Marvelam?", "What does MAC stand for?")
 * 3. Vision Banner & Core Value Pillars (100% Genuine Fabrics, Custom Tailoring, On-Demand Measurements, Nationwide Logistics)
 * 4. Company in a Nutshell (Metric Circles: garments crafted, verified master tailors, fabric varieties, customer satisfaction)
 * 5. Company History & Timeline (Founding, tech innovation, digital atelier integration)
 * 6. Brand Values & Commitments (Artisanal Craftsmanship, Inclusivity & Fit Diversity, Integrity, African Luxury Heritage)
 */
export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState("vision");

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 w-full overflow-x-hidden ${
        isDark ? "bg-[#0A0A0A] text-white" : "bg-[#F9FAFB] text-[#0F0F0F]"
      }`}
    >
      <Header />

      <main className="flex-1 w-full pb-16 sm:pb-24">
        {/* Page Top Heading */}
        <section className="pt-10 sm:pt-14 pb-6 text-center border-b transition-colors border-neutral-200 dark:border-white/10">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#FFB400]">
              About Us
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Discover Marvelam Apparel & Clothing — Pioneering Custom Tailoring & Textile Commerce
            </p>

            {/* Quick-Nav Submenu (Modeled after Jumia: Our Vision | Marvelam Today | Our History | Craft) */}
            <nav className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              {[
                { id: "vision", label: "Our Vision" },
                { id: "nutshell", label: "Marvelam Today" },
                { id: "faq-style", label: "What is Marvelam?" },
                { id: "history", label: "Our History" },
                { id: "values", label: "Our Values" },
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className={`pb-1 transition-colors relative cursor-pointer ${
                    activeSection === link.id
                      ? "text-[#FFB400] border-b-2 border-[#FFB400]"
                      : "hover:text-[#FFB400]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Section 1: Vision Banner & 4 Corner Value Badges */}
        <section id="vision" className="pt-4 sm:pt-10 max-w-6xl mx-auto px-3 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-stretch">
            {/* Visual Screen Mockup / Brand Frame */}
            <div className="lg:col-span-5 rounded-xl sm:rounded-2xl border-0 sm:border sm:border-[#FFB400]/25 bg-transparent sm:bg-gradient-to-br sm:from-[#1C1C1C] sm:to-[#121212] py-2 px-3 sm:p-6 flex flex-col justify-center items-center text-center shadow-none sm:shadow-md relative">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFB400]/15 sm:border sm:border-[#FFB400]/30 flex items-center justify-center text-[#FFB400] mb-1.5 sm:mb-2.5">
                <Scissors size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFB400] leading-none">
                MAC
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] text-neutral-400 sm:text-neutral-300 uppercase mt-1">
                Marvelam Apparel & Clothing
              </span>
              <p className="text-[11px] sm:text-xs text-neutral-500 sm:text-neutral-400 mt-1 sm:mt-2 max-w-xs leading-relaxed">
                A digitally-driven ecosystem uniting bespoke tailoring and direct textile procurement.
              </p>
            </div>

            {/* Vision Callout Box */}
            <div className="lg:col-span-7 rounded-xl sm:rounded-2xl border border-[#FFB400]/30 bg-gradient-to-r from-[#FFB400]/15 via-[#FFB400]/10 to-[#FFB400]/5 py-5 sm:py-7 px-4 sm:px-7 lg:p-8 flex flex-col justify-center min-h-[160px] sm:min-h-[200px]">
              <div className="inline-flex items-center gap-1.5 text-[#FFB400] mb-2 sm:mb-2.5">
                <Target size={15} className="sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Our Vision</span>
              </div>
              <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-semibold leading-snug">
                "We are building Africa's most trusted and beloved digital tailoring and luxury fashion destination."
              </h2>
              <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                To transform traditional bespoke tailoring from an uncertain local hassle into an effortless, transparent, and delight-driven online experience with guaranteed fit and premium craftsmanship.
              </p>
            </div>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-10">
            <div className="p-3.5 sm:p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] text-center flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] mb-2 sm:mb-3">
                <ShieldCheck size={18} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">100% Genuine Fabrics</h3>
              <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1 leading-snug">
                Directly sourced authentic lace, silks, organza & Ankara.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] text-center flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] mb-2 sm:mb-3">
                <Scissors size={18} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Custom Tailoring</h3>
              <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1 leading-snug">
                Precision garments cut to individual body proportions.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] text-center flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] mb-2 sm:mb-3">
                <Layers size={18} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Ready-To-Wear Range</h3>
              <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1 leading-snug">
                Finished gowns, boubous & modern two-piece sets.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] text-center flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] mb-2 sm:mb-3">
                <Truck size={18} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Nationwide Delivery</h3>
              <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1 leading-snug">
                Fast doorstep delivery across all 36 states and abroad.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Marvelam Today In A Nutshell (Redesigned with Modern Luxury Atelier Stat Cards) */}
        <section id="nutshell" className="mt-12 sm:mt-16 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-[#121212]/90 backdrop-blur-sm p-5 sm:p-10 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFB400]/15 text-[#FFB400] mb-2 sm:mb-3">
              <Clock size={18} />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Marvelam Today
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              In a Nutshell
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6 sm:mt-8">
              {/* Stat Card 1 */}
              <div className="group relative rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#181818] p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-[#FFB400]/50 hover:shadow-lg hover:shadow-[#FFB400]/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-[#FFB400]/20 to-[#FFB400]/5 border border-[#FFB400]/30 flex items-center justify-center text-[#FFB400] mb-3 group-hover:scale-110 transition-transform">
                  <Scissors size={20} />
                </div>
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFB400]">
                  5,000+
                </div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 text-neutral-800 dark:text-neutral-200">
                  Garments Crafted
                </span>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Bespoke abayas, boubous & formal kaftans tailored & delivered
                </p>
              </div>

              {/* Stat Card 2 */}
              <div className="group relative rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#181818] p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-[#FFB400]/50 hover:shadow-lg hover:shadow-[#FFB400]/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-[#FFB400]/20 to-[#FFB400]/5 border border-[#FFB400]/30 flex items-center justify-center text-[#FFB400] mb-3 group-hover:scale-110 transition-transform">
                  <Layers size={20} />
                </div>
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFB400]">
                  1,200+
                </div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 text-neutral-800 dark:text-neutral-200">
                  Fabric Varieties
                </span>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Lace, velvet, silk, organza & Ankara textiles in catalog
                </p>
              </div>

              {/* Stat Card 3 */}
              <div className="group relative rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#181818] p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-[#FFB400]/50 hover:shadow-lg hover:shadow-[#FFB400]/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-[#FFB400]/20 to-[#FFB400]/5 border border-[#FFB400]/30 flex items-center justify-center text-[#FFB400] mb-3 group-hover:scale-110 transition-transform">
                  <Compass size={20} />
                </div>
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFB400]">
                  36
                </div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 text-neutral-800 dark:text-neutral-200">
                  States Covered
                </span>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Fast delivery across Nigeria and international destinations
                </p>
              </div>

              {/* Stat Card 4 */}
              <div className="group relative rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#181818] p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-[#FFB400]/50 hover:shadow-lg hover:shadow-[#FFB400]/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-[#FFB400]/20 to-[#FFB400]/5 border border-[#FFB400]/30 flex items-center justify-center text-[#FFB400] mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFB400]">
                  99.4%
                </div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 text-neutral-800 dark:text-neutral-200">
                  Fit Accuracy
                </span>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  Precision tailoring via stored measurement profiles
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Conceptual Clarifications (Modeled after Temu's "What is Temu? / What does it mean? / Strengths") */}
        <section id="faq-style" className="mt-16 sm:mt-20 max-w-4xl mx-auto px-4 sm:px-8 space-y-12 text-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFB400]">
              What is Marvelam?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Marvelam is a hybrid e-commerce fashion and tailoring platform that solves the traditional challenge of bespoke apparel. We provide direct access to verified master tailors, an extensive catalog of premium fabrics sold by the yard, and fully finished ready-to-wear garments. Founded in Nigeria, Marvelam was created to make bespoke elegance accessible, consistent, and frictionless.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFB400]">
              What does MAC stand for?
            </h2>
            <p className="mt-2 font-display text-base sm:text-lg italic text-neutral-800 dark:text-neutral-200">
              MAC — Marvelam Apparel & Clothing
            </p>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              It signifies our dual commitment: crafting exceptional apparel through tailored made-to-measure services, while supplying fine raw clothing textiles to designers, fashion houses, and individual shoppers.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFB400]">
              Where are Marvelam products tailored and shipped from?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Our tailoring atelier and central fabric fulfilment hub are based in Ibadan, Nigeria. All raw textiles and finished garments undergo meticulous quality control inspections before dispatching through trusted nationwide courier partners (GIG Logistics, DHL, and local express couriers).
            </p>
          </div>

          {/* Marvelam's Strengths Bullet List (Like Temu's strengths) */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 p-6 sm:p-8 bg-white dark:bg-[#141414] text-left max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-bold text-[#FFB400] text-center mb-4">
              Marvelam's Key Strengths
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFB400] mt-2 shrink-0" />
                <span>
                  <strong>Full Bespoke Tailoring Integration:</strong> Unlike ordinary retail sites, our platform handles custom necklines, sleeve preferences, and exact body measurements.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFB400] mt-2 shrink-0" />
                <span>
                  <strong>Direct Textile Sourcing:</strong> Genuine luxury fabrics sourced directly from weavers and established textile importers with transparent pricing.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFB400] mt-2 shrink-0" />
                <span>
                  <strong>Digital Fit Profile:</strong> Once measured, your profile is permanently stored, eliminating repetitive sizing friction for all future orders.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: History / Milestones Timeline (Modeled after Jumia History card) */}
        <section id="history" className="mt-16 sm:mt-20 max-w-5xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] p-6 sm:p-12 shadow-sm">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFB400]/20 text-[#FFB400] mb-3">
                <Building size={22} />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                Our History & Journey
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                The evolution of Marvelam Apparel & Clothing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed">
              <div className="space-y-5">
                <div className="border-l-2 border-[#FFB400] pl-4">
                  <span className="text-[#FFB400] font-bold text-xs uppercase tracking-wider block">Founding Phase</span>
                  <p className="text-neutral-700 dark:text-neutral-300 mt-1">
                    Marvelam was established in Ibadan, Nigeria, identifying the critical pain point where customers struggled with tailor unreliability, poor garment finishing, and fabric sourcing delays.
                  </p>
                </div>

                <div className="border-l-2 border-[#FFB400] pl-4">
                  <span className="text-[#FFB400] font-bold text-xs uppercase tracking-wider block">Textile Catalog Expansion</span>
                  <p className="text-neutral-700 dark:text-neutral-300 mt-1">
                    Onboarded authentic direct textile suppliers, curating premium French lace, Italian silks, and authentic Ankara fabrics available for direct yard purchase.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="border-l-2 border-[#FFB400] pl-4">
                  <span className="text-[#FFB400] font-bold text-xs uppercase tracking-wider block">Digital Atelier Launch</span>
                  <p className="text-neutral-700 dark:text-neutral-300 mt-1">
                    Introduced the digital tailoring workflow, enabling shoppers anywhere in Nigeria and abroad to order custom-fitted garments using guided measurement profiles.
                  </p>
                </div>

                <div className="border-l-2 border-[#FFB400] pl-4">
                  <span className="text-[#FFB400] font-bold text-xs uppercase tracking-wider block">Nationwide Fulfilment</span>
                  <p className="text-neutral-700 dark:text-neutral-300 mt-1">
                    Expanded logistics partnerships to ensure transparent order tracking, standard delivery timelines, and international diaspora shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Our Core Values (Modeled after Temu's 4 Value cards with clean line icons) */}
        <section id="values" className="mt-16 sm:mt-20 max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFB400]">
              Our Values
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              The guiding principles behind every stitch and fabric cut
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Empowerment & Inclusion</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Every body silhouette deserves garments that flatter naturally. We celebrate size diversity with bespoke cuts made to your true measurements.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] shrink-0">
                <HeartHandshake size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Artisanal Integrity</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Honest fabric descriptions, transparent yardage counts, and uncompromised seam construction on every single piece.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] shrink-0">
                <Award size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Heritage & Modern Luxury</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Preserving traditional African modest wear aesthetics (Abayas, Boubous, Kaftans) while infusing contemporary silhouettes.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#141414] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB400]/15 flex items-center justify-center text-[#FFB400] shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Customer Trust</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Clear delivery timelines, secure payments, and dedicated customer support to ensure your shopping journey is completely reliable.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
