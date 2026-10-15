import React, { useState, useEffect, useRef } from "react";
import { History, ChevronLeft, ChevronRight, Eye, Star, Trash2 } from "lucide-react";
import formatNaira from "../../utils/formatNaira";
import { useNavigate } from "react-router-dom";

const DEMO_RECENT_ITEMS = [
  {
    id: 401,
    name: "Royal Gold Embroidery Velvet Boubou",
    price: 60000,
    discounted_price: 48000,
    percent_discount: 20,
    pry_image: "https://picsum.photos/seed/mac-look1-item1/400/500",
    avg_rating: 5,
    review_count: 18,
    slug: "royal-gold-embroidery-velvet-boubou",
  },
  {
    id: 402,
    name: "Emerald Green Chiffon Layered Abaya",
    price: 52000,
    discounted_price: 46800,
    percent_discount: 10,
    pry_image: "https://picsum.photos/seed/mac-look2-item1/400/500",
    avg_rating: 4.8,
    review_count: 24,
    slug: "emerald-green-chiffon-layered-abaya",
  },
  {
    id: 403,
    name: "Hand-Beaded French Velvet Lace (5 Yds)",
    price: 95000,
    discounted_price: 85500,
    percent_discount: 10,
    pry_image: "https://picsum.photos/seed/mac-look3-item1/400/500",
    avg_rating: 5,
    review_count: 31,
    slug: "hand-beaded-french-velvet-lace",
  },
  {
    id: 404,
    name: "Elegance Satin Abaya",
    price: 42000,
    pry_image: "https://picsum.photos/seed/new-1/400/500",
    avg_rating: 4.9,
    review_count: 14,
    slug: "elegance-satin-abaya",
  },
  {
    id: 405,
    name: "Prestige Organza Boubou",
    price: 58000,
    pry_image: "https://picsum.photos/seed/new-2/400/500",
    avg_rating: 5,
    review_count: 11,
    slug: "prestige-organza-boubou",
  },
];

export const addRecentlyViewed = (item) => {
  if (!item || !item.id) return;
  try {
    const existing = JSON.parse(localStorage.getItem("marvelam_recently_viewed") || "[]");
    const filtered = existing.filter((p) => p.id !== item.id);
    const updated = [item, ...filtered].slice(0, 10);
    localStorage.setItem("marvelam_recently_viewed", JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update recently viewed items:", err);
  }
};

export default function RecentlyViewed({ isDark, onQuickView }) {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("marvelam_recently_viewed") || "[]");
      if (stored && stored.length > 0) {
        setItems(stored);
      } else {
        setItems(DEMO_RECENT_ITEMS);
      }
    } catch (e) {
      setItems(DEMO_RECENT_ITEMS);
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("marvelam_recently_viewed");
    setItems(DEMO_RECENT_ITEMS);
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b pb-4 border-white/10">
        <div>
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
            <History size={14} /> Resume Shopping
          </span>
          <h2 className={`font-display text-2xl sm:text-3xl font-semibold mt-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
            Recently Viewed Products
          </h2>
        </div>

        <button
          type="button"
          onClick={handleClearHistory}
          className={`flex items-center gap-1.5 font-sans text-xs font-semibold transition-colors hover:text-red-500 ${
            isDark ? "text-white/50" : "text-neutral-500"
          }`}
          title="Reset recently viewed items"
        >
          <Trash2 size={13} /> Clear History
        </button>
      </div>

      {/* Carousel Track */}
      <div className="relative mt-6 group">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth py-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const currentPrice = item.discounted_price || item.price;
            const originalPrice = item.price;
            const productSlug = item.slug || item.name?.toLowerCase().replace(/\s+/g, "-") || "product";

            return (
              <div
                key={item.id}
                className={`group/card flex w-48 shrink-0 flex-col overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 sm:w-56 ${
                  isDark
                    ? "border-white/10 bg-[#151515] hover:border-[#FFB400]/50 hover:shadow-lg"
                    : "border-[#EAE6DF] bg-white shadow-sm hover:border-[#FFB400] hover:shadow-md"
                }`}
              >
                {/* Image Box */}
                <div
                  onClick={() => navigate(`/product/${productSlug}/${item.id}`)}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800"
                >
                  {item.percent_discount && (
                    <span className="absolute left-2.5 top-2.5 z-10 rounded bg-red-600 px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow">
                      -{item.percent_discount}%
                    </span>
                  )}
                  <img
                    src={item.pry_image || `https://picsum.photos/seed/${item.id}/300/400`}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      onClick={() => navigate(`/product/${productSlug}/${item.id}`)}
                      className={`font-sans text-xs font-semibold leading-snug line-clamp-1 transition-colors group-hover/card:text-[#FFB400] ${
                        isDark ? "text-white/90" : "text-[#141414]"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-sans text-xs font-bold text-[#FFB400]">
                        {formatNaira(currentPrice)}
                      </span>
                      {item.discounted_price && (
                        <span className={`font-sans text-[10px] line-through ${isDark ? "text-white/40" : "text-neutral-400"}`}>
                          {formatNaira(originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={
                            i < (item.avg_rating || 5)
                              ? "fill-[#FFB400] text-[#FFB400]"
                              : "text-white/20"
                          }
                        />
                      ))}
                      <span className={`font-sans text-[9px] ${isDark ? "text-white/40" : "text-neutral-400"}`}>
                        ({item.review_count || 12})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onQuickView && onQuickView(item)}
                    className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-[#FFB400] py-2 font-sans text-[11px] font-bold text-[#0F0F0F] transition-transform hover:scale-[1.02]"
                  >
                    <Eye size={13} /> Quick View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
