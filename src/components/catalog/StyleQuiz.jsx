import React, { useState } from "react";
import { Sparkles, ArrowRight, RotateCcw, Eye, Star, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import formatNaira from "../../utils/formatNaira";

const OCCASIONS = [
  { id: "wedding", name: "Wedding & Aso-Ebi", desc: "Statement pieces & luxury party wear", icon: "💒" },
  { id: "eid", name: "Eid & Celebrations", desc: "Festive abayas, boubous & kaftans", icon: "🌙" },
  { id: "everyday", name: "Everyday Glamour", desc: "Effortless, chic & comfortable styles", icon: "✨" },
  { id: "corporate", name: "Corporate & Modest", desc: "Elegant & professional workwear", icon: "💼" },
];

const PREFERENCES = [
  { id: "dress", name: "Ready-to-Wear Dress", desc: "Stitched & ready to rock", icon: "👗" },
  { id: "abaya", name: "Silk Abaya & Kaftan", desc: "Flowing modest silhouettes", icon: "🧕" },
  { id: "lace", name: "Luxury Lace Fabric", desc: "Unstitched premium French lace", icon: "🧵" },
  { id: "silk", name: "Pure Silk Material", desc: "Lustrous imported silks", icon: "🔮" },
];

const QUIZ_CATALOG = [
  {
    id: 301,
    name: "Royal Gold Embroidery Velvet Boubou",
    price: 60000,
    discounted_price: 48000,
    percent_discount: 20,
    occasion: "wedding",
    preference: "dress",
    pry_image: "https://picsum.photos/seed/mac-look1-item1/400/500",
    quality_category: "Premium",
    avg_rating: 5,
    review_count: 18,
    slug: "royal-gold-embroidery-velvet-boubou",
  },
  {
    id: 302,
    name: "Hand-Beaded French Velvet Lace (5 Yds)",
    price: 95000,
    discounted_price: 85500,
    percent_discount: 10,
    occasion: "wedding",
    preference: "lace",
    pry_image: "https://picsum.photos/seed/mac-look3-item1/400/500",
    quality_category: "VVIP",
    avg_rating: 5,
    review_count: 31,
    slug: "hand-beaded-french-velvet-lace",
  },
  {
    id: 303,
    name: "Emerald Green Chiffon Layered Abaya",
    price: 52000,
    discounted_price: 46800,
    percent_discount: 10,
    occasion: "eid",
    preference: "abaya",
    pry_image: "https://picsum.photos/seed/mac-look2-item1/400/500",
    quality_category: "Luxury",
    avg_rating: 4.8,
    review_count: 24,
    slug: "emerald-green-chiffon-layered-abaya",
  },
  {
    id: 304,
    name: "Pure Satin Inner Slip & Outer Kaftan",
    price: 45000,
    occasion: "eid",
    preference: "abaya",
    pry_image: "https://picsum.photos/seed/flash-1/400/500",
    quality_category: "Luxury",
    avg_rating: 4.9,
    review_count: 14,
    slug: "pure-satin-inner-slip-outer-kaftan",
  },
  {
    id: 305,
    name: "Elegance Satin Abaya",
    price: 42000,
    occasion: "everyday",
    preference: "dress",
    pry_image: "https://picsum.photos/seed/new-1/400/500",
    quality_category: "Essential",
    avg_rating: 4.9,
    review_count: 12,
    slug: "elegance-satin-abaya",
  },
  {
    id: 306,
    name: "Lustrous Printed Silk Fabric (4 Yds)",
    price: 35000,
    occasion: "everyday",
    preference: "silk",
    pry_image: "https://picsum.photos/seed/fabric-silk/400/500",
    quality_category: "Premium",
    avg_rating: 4.8,
    review_count: 16,
    slug: "lustrous-printed-silk-fabric",
  },
  {
    id: 307,
    name: "Prestige Organza Boubou",
    price: 58000,
    occasion: "corporate",
    preference: "dress",
    pry_image: "https://picsum.photos/seed/new-2/400/500",
    quality_category: "Exclusive",
    avg_rating: 5,
    review_count: 9,
    slug: "prestige-organza-boubou",
  },
  {
    id: 308,
    name: "Royal Gold Kaftan",
    price: 55000,
    discounted_price: 46750,
    percent_discount: 15,
    occasion: "wedding",
    preference: "abaya",
    pry_image: "https://picsum.photos/seed/flash-3/400/500",
    quality_category: "Luxury",
    avg_rating: 5,
    review_count: 22,
    slug: "royal-gold-kaftan",
  },
];

export default function StyleQuiz({ isDark, onQuickView }) {
  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedPreference, setSelectedPreference] = useState(null);
  const navigate = useNavigate();

  const handleSelectOccasion = (occId) => {
    setSelectedOccasion(occId);
    setStep(2);
  };

  const handleSelectPreference = (prefId) => {
    setSelectedPreference(prefId);
    setStep(3);
  };

  const resetQuiz = () => {
    setStep(1);
    setSelectedOccasion(null);
    setSelectedPreference(null);
  };

  // Filter recommendations based on quiz choices
  const getRecommendations = () => {
    let results = QUIZ_CATALOG.filter((item) => {
      const matchOcc = selectedOccasion ? item.occasion === selectedOccasion : true;
      const matchPref = selectedPreference ? item.preference === selectedPreference : true;
      return matchOcc && matchPref;
    });

    if (results.length === 0) {
      results = QUIZ_CATALOG.filter((item) => item.occasion === selectedOccasion || item.preference === selectedPreference);
    }

    if (results.length === 0) {
      results = QUIZ_CATALOG.slice(0, 3);
    }

    return results;
  };

  const recommendedItems = getRecommendations();
  const activeOccasionObj = OCCASIONS.find((o) => o.id === selectedOccasion);
  const activePrefObj = PREFERENCES.find((p) => p.id === selectedPreference);

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-8">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 transition-all duration-300 shadow-xl ${
          isDark
            ? "border-white/10 bg-[#151515] text-white"
            : "border-[#EAE6DF] bg-white text-[#141414] shadow-sm"
        }`}
      >
        {/* Header Bar with Progress Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-white/10">
          <div>
            <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
              <Sparkles size={14} /> Interactive Style Finder
            </span>
            <h2 className="font-display text-3xl font-semibold mt-1">
              Find Your Perfect Style Match
            </h2>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold transition-all ${
                  step === s
                    ? "bg-[#FFB400] text-[#0F0F0F]"
                    : step > s
                    ? "bg-green-600 text-white"
                    : isDark
                    ? "bg-white/10 text-white/40"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                <span>{s === 3 ? "Results" : `Step ${s}`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Occasion Selector */}
        {step === 1 && (
          <div className="mt-8 animate-in fade-in duration-300">
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#FFB400]">
              Step 1 of 2: What's the occasion you're dressing for?
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => handleSelectOccasion(occ.id)}
                  className={`group flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] shadow-sm ${
                    isDark
                      ? "border-white/10 bg-[#1A1A1A] hover:border-[#FFB400] hover:bg-[#FFB400]/10"
                      : "border-neutral-200 bg-neutral-50 hover:border-[#FFB400] hover:bg-[#FFB400]/10"
                  }`}
                >
                  <div>
                    <span className="text-3xl">{occ.icon}</span>
                    <h4 className="mt-3 font-sans text-sm font-bold group-hover:text-[#FFB400] transition-colors">
                      {occ.name}
                    </h4>
                    <p className={`mt-1 font-sans text-xs ${isDark ? "text-white/60" : "text-neutral-500"}`}>
                      {occ.desc}
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-1 font-sans text-xs font-semibold text-[#FFB400] group-hover:translate-x-1 transition-transform">
                    Select <ArrowRight size={13} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Preference Selector */}
        {step === 2 && (
          <div className="mt-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#FFB400]">
                Step 2 of 2: What product type do you prefer?
              </h3>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-sans text-xs font-semibold underline text-[#FFB400]"
              >
                ← Back to Step 1
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => handleSelectPreference(pref.id)}
                  className={`group flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 hover:scale-[1.02] shadow-sm ${
                    isDark
                      ? "border-white/10 bg-[#1A1A1A] hover:border-[#FFB400] hover:bg-[#FFB400]/10"
                      : "border-neutral-200 bg-neutral-50 hover:border-[#FFB400] hover:bg-[#FFB400]/10"
                  }`}
                >
                  <div>
                    <span className="text-3xl">{pref.icon}</span>
                    <h4 className="mt-3 font-sans text-sm font-bold group-hover:text-[#FFB400] transition-colors">
                      {pref.name}
                    </h4>
                    <p className={`mt-1 font-sans text-xs ${isDark ? "text-white/60" : "text-neutral-500"}`}>
                      {pref.desc}
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-1 font-sans text-xs font-semibold text-[#FFB400] group-hover:translate-x-1 transition-transform">
                    View Matches <ArrowRight size={13} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Tailored Results Display */}
        {step === 3 && (
          <div className="mt-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-white/10">
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-green-600/20 px-2.5 py-0.5 font-sans text-[11px] font-bold text-green-400 border border-green-500/30">
                  <CheckCircle2 size={12} /> Personalized Matches Found
                </span>
                <h3 className="font-display text-2xl font-semibold mt-1">
                  Recommendations for {activeOccasionObj?.name} ({activePrefObj?.name})
                </h3>
              </div>

              <button
                type="button"
                onClick={resetQuiz}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 px-3.5 py-2 font-sans text-xs font-semibold hover:border-[#FFB400] hover:text-[#FFB400] transition-colors"
              >
                <RotateCcw size={13} /> Retake Quiz
              </button>
            </div>

            {/* Results Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {recommendedItems.map((item) => {
                const currentPrice = item.discounted_price || item.price;
                return (
                  <div
                    key={item.id}
                    className={`group flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                      isDark
                        ? "border-white/10 bg-[#1A1A1A] hover:border-[#FFB400]/50"
                        : "border-neutral-200 bg-neutral-50 hover:border-[#FFB400]"
                    }`}
                  >
                    <div>
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-800">
                        {item.percent_discount && (
                          <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow">
                            -{item.percent_discount}%
                          </span>
                        )}
                        <img
                          src={item.pry_image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <span className="mt-3 inline-block font-sans text-[10px] font-bold uppercase tracking-wider text-[#FFB400]">
                        {item.quality_category}
                      </span>
                      <h4 className="font-sans text-xs font-bold line-clamp-1 group-hover:text-[#FFB400] transition-colors">
                        {item.name}
                      </h4>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-sans text-sm font-bold text-[#FFB400]">
                          {formatNaira(currentPrice)}
                        </span>
                        {item.discounted_price && (
                          <span className={`font-sans text-xs line-through ${isDark ? "text-white/40" : "text-neutral-400"}`}>
                            {formatNaira(item.price)}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={
                              i < item.avg_rating
                                ? "fill-[#FFB400] text-[#FFB400]"
                                : "text-white/20"
                            }
                          />
                        ))}
                        <span className={`font-sans text-[10px] ${isDark ? "text-white/40" : "text-neutral-500"}`}>
                          ({item.review_count})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onQuickView && onQuickView(item)}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#FFB400] py-2.5 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-[1.02] shadow-md"
                    >
                      <Eye size={14} /> Quick View Match
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/catalog")}
                className="flex items-center gap-2 font-sans text-xs font-bold text-[#FFB400] hover:underline"
              >
                Browse Full Catalog For More Matches <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
