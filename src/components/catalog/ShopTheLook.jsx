import React, { useState } from "react";
import { Sparkles, Eye, ShoppingBag, ChevronRight, ChevronLeft, Plus, Check } from "lucide-react";
import formatNaira from "../../utils/formatNaira";
import { useCart } from "../../context/CartContext";

const LOOKS = [
  {
    id: "look-1",
    title: "The Royal Velvet Boubou Ensemble",
    subtitle: "Festive & Ceremonial Elegance",
    tag: "Featured Look",
    image: "https://picsum.photos/seed/mac-lookbook-1/800/1000",
    items: [
      {
        id: 101,
        name: "Royal Gold Embroidery Velvet Boubou",
        price: 65000,
        discounted_price: 58500,
        percent_discount: 10,
        category: "Dress",
        pry_image: "https://picsum.photos/seed/mac-look1-item1/400/500",
        quality_category: "Premium",
        avg_rating: 5,
        review_count: 18,
        pin: { top: "35%", left: "48%" },
      },
      {
        id: 102,
        name: "Hand-Woven Gold Silk Headwrap",
        price: 18000,
        category: "Accessory",
        pry_image: "https://picsum.photos/seed/mac-look1-item2/400/500",
        quality_category: "Luxury",
        avg_rating: 4.9,
        review_count: 12,
        pin: { top: "15%", left: "52%" },
      },
      {
        id: 103,
        name: "Crystal Embellished Evening Clutch",
        price: 25000,
        category: "Accessory",
        pry_image: "https://picsum.photos/seed/mac-look1-item3/400/500",
        quality_category: "Exclusive",
        avg_rating: 5,
        review_count: 9,
        pin: { top: "68%", left: "32%" },
      },
    ],
  },
  {
    id: "look-2",
    title: "Emerald Silk Abaya & Inner Set",
    subtitle: "Modern Modest Luxury",
    tag: "Eid Collection",
    image: "https://picsum.photos/seed/mac-lookbook-2/800/1000",
    items: [
      {
        id: 104,
        name: "Emerald Green Chiffon Layered Abaya",
        price: 52000,
        discounted_price: 46800,
        percent_discount: 10,
        category: "Abaya",
        pry_image: "https://picsum.photos/seed/mac-look2-item1/400/500",
        quality_category: "Luxury",
        avg_rating: 4.8,
        review_count: 24,
        pin: { top: "38%", left: "55%" },
      },
      {
        id: 105,
        name: "Pure Satin Inner Slip Dress",
        price: 22000,
        category: "Dress",
        pry_image: "https://picsum.photos/seed/mac-look2-item2/400/500",
        quality_category: "Essential",
        avg_rating: 4.9,
        review_count: 15,
        pin: { top: "52%", left: "45%" },
      },
      {
        id: 106,
        name: "Pearl Embellished Matching Hijab",
        price: 15000,
        category: "Accessory",
        pry_image: "https://picsum.photos/seed/mac-look2-item3/400/500",
        quality_category: "Premium",
        avg_rating: 5,
        review_count: 8,
        pin: { top: "18%", left: "50%" },
      },
    ],
  },
  {
    id: "look-3",
    title: "Aso-Ebi Royalty Lace & Gele",
    subtitle: "Bespoke Event Couture",
    tag: "Wedding Special",
    image: "https://picsum.photos/seed/mac-lookbook-3/800/1000",
    items: [
      {
        id: 107,
        name: "Hand-Beaded French Velvet Lace (5 Yds)",
        price: 95000,
        discounted_price: 85500,
        percent_discount: 10,
        category: "Fabric",
        pry_image: "https://picsum.photos/seed/mac-look3-item1/400/500",
        quality_category: "VVIP",
        avg_rating: 5,
        review_count: 31,
        pin: { top: "45%", left: "50%" },
      },
      {
        id: 108,
        name: "Auto-Gele Crown Headpiece",
        price: 28000,
        category: "Headwear",
        pry_image: "https://picsum.photos/seed/mac-look3-item2/400/500",
        quality_category: "Luxury",
        avg_rating: 4.9,
        review_count: 19,
        pin: { top: "14%", left: "52%" },
      },
    ],
  },
];

export default function ShopTheLook({ isDark, onQuickView }) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activePinId, setActivePinId] = useState(null);
  const [addedAll, setAddedAll] = useState(false);
  const { addToCart } = useCart();

  const activeLook = LOOKS[activeLookIndex];

  const handleNextLook = () => {
    setActiveLookIndex((prev) => (prev + 1) % LOOKS.length);
    setActivePinId(null);
  };

  const handlePrevLook = () => {
    setActiveLookIndex((prev) => (prev - 1 + LOOKS.length) % LOOKS.length);
    setActivePinId(null);
  };

  const calculateTotalOutfitPrice = () => {
    return activeLook.items.reduce((total, item) => {
      const price = item.discounted_price || item.price;
      return total + price;
    }, 0);
  };

  const handleAddAllToCart = () => {
    activeLook.items.forEach((item) => {
      addToCart(item, { size: "M", quantity: 1 });
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
            <Sparkles size={14} /> Shop the Look
          </span>
          <h2 className={`font-display text-3xl font-semibold mt-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
            Curated Outfit Styling
          </h2>
        </div>
        <p className={`font-sans text-xs max-w-md ${isDark ? "text-white/55" : "text-neutral-600"}`}>
          Hover or click on the hotspot pins to reveal individual items, or shop the complete ensemble with one click.
        </p>
      </div>

      {/* Main Lookbook Container */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
        {/* Left Column: Interactive Image Canvas */}
        <div
          className={`relative overflow-hidden rounded-2xl border shadow-xl transition-all duration-300 min-h-[480px] sm:min-h-[560px] group ${
            isDark ? "border-white/10 bg-[#151515]" : "border-[#EAE6DF] bg-white"
          }`}
        >
          {/* Main Lookbook Image */}
          <img
            src={activeLook.image}
            alt={activeLook.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

          {/* Top Tag & Look Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <span className="rounded-full border border-[#FFB400]/40 bg-black/60 px-3 py-1 font-sans text-[11px] font-semibold text-[#FFB400] backdrop-blur-md uppercase tracking-wider">
              {activeLook.tag}
            </span>

            {/* Slider Dots/Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevLook}
                aria-label="Previous look"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F]"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-sans text-xs font-semibold text-white/90 px-1">
                {activeLookIndex + 1} / {LOOKS.length}
              </span>
              <button
                type="button"
                onClick={handleNextLook}
                aria-label="Next look"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Hotspot Pins Overlay */}
          {activeLook.items.map((item) => {
            const isSelected = activePinId === item.id;
            const currentPrice = item.discounted_price || item.price;

            return (
              <div
                key={item.id}
                style={{ top: item.pin.top, left: item.pin.left }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
              >
                {/* Hotspot Pulsing Pin Button */}
                <button
                  type="button"
                  onClick={() => setActivePinId(isSelected ? null : item.id)}
                  onMouseEnter={() => setActivePinId(item.id)}
                  aria-label={`View ${item.name}`}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 shadow-lg ${
                    isSelected ? "bg-[#FFB400] text-[#0F0F0F] ring-4 ring-[#FFB400]/40" : "bg-black/70 text-white backdrop-blur-sm border border-white/40"
                  }`}
                >
                  <Plus size={16} className={`transition-transform duration-300 ${isSelected ? "rotate-45" : ""}`} />
                  <span className="absolute -inset-1.5 animate-ping rounded-full bg-[#FFB400]/30 opacity-75" />
                </button>

                {/* Popover Card on Pin Hover/Click */}
                {isSelected && (
                  <div className="absolute left-1/2 bottom-10 z-40 w-56 -translate-x-1/2 rounded-xl border border-white/20 bg-[#0F0F0F]/95 p-3 text-white shadow-2xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex gap-2.5">
                      <img
                        src={item.pry_image}
                        alt={item.name}
                        className="h-14 w-14 rounded-lg object-cover bg-neutral-800 shrink-0"
                      />
                      <div className="flex flex-col justify-between overflow-hidden">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#FFB400]">
                            {item.category}
                          </span>
                          <h4 className="font-sans text-xs font-semibold text-white/90 line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <span className="font-sans text-xs font-bold text-[#FFB400]">
                          {formatNaira(currentPrice)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onQuickView && onQuickView(item)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FFB400] py-1.5 font-sans text-[11px] font-semibold text-[#0F0F0F] transition-transform hover:scale-[1.02]"
                    >
                      <Eye size={13} /> Quick View
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Title Bar Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-1 rounded-xl bg-black/60 p-4 backdrop-blur-md border border-white/10">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#FFB400]">
              {activeLook.subtitle}
            </span>
            <h3 className="font-display text-xl font-semibold text-white">
              {activeLook.title}
            </h3>
          </div>
        </div>

        {/* Right Column: Breakdown Sidebar of Tagged Items in Outfit */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
            isDark ? "border-white/10 bg-[#151515]" : "border-[#EAE6DF] bg-white shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b pb-4 border-white/10">
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#FFB400]">
                  Outfit Breakdown
                </span>
                <h3 className={`font-display text-2xl font-semibold mt-0.5 ${isDark ? "text-white" : "text-[#141414]"}`}>
                  Items in this Look ({activeLook.items.length})
                </h3>
              </div>
            </div>

            {/* List of tagged items */}
            <div className="mt-4 flex flex-col gap-3.5">
              {activeLook.items.map((item) => {
                const isHovered = activePinId === item.id;
                const currentPrice = item.discounted_price || item.price;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActivePinId(item.id)}
                    onMouseLeave={() => setActivePinId(null)}
                    className={`flex items-center justify-between rounded-xl border p-3 transition-all duration-200 ${
                      isHovered
                        ? "border-[#FFB400] bg-[#FFB400]/10 shadow-md"
                        : isDark
                        ? "border-white/10 bg-[#1A1A1A]"
                        : "border-neutral-200 bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.pry_image}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover bg-neutral-800"
                      />
                      <div>
                        <h4 className={`font-sans text-xs font-semibold line-clamp-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
                          {item.name}
                        </h4>
                        <div className="mt-0.5 flex items-baseline gap-2">
                          <span className="font-sans text-xs font-bold text-[#FFB400]">
                            {formatNaira(currentPrice)}
                          </span>
                          {item.discounted_price && (
                            <span className={`font-sans text-[10px] line-through ${isDark ? "text-white/40" : "text-neutral-400"}`}>
                              {formatNaira(item.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onQuickView && onQuickView(item)}
                      className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 font-sans text-[11px] font-semibold transition-colors ${
                        isDark
                          ? "border-white/20 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
                          : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
                      }`}
                    >
                      <Eye size={12} /> View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Card Summary & Add All to Cart */}
          <div className="mt-6 border-t pt-4 border-white/10">
            <div className="flex items-center justify-between font-sans">
              <div>
                <span className={`text-xs font-medium ${isDark ? "text-white/60" : "text-neutral-500"}`}>
                  Total Look Value:
                </span>
                <p className="text-xl font-bold text-[#FFB400]">
                  {formatNaira(calculateTotalOutfitPrice())}
                </p>
              </div>
              <span className="rounded-md bg-[#FFB400]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFB400]">
                Complete Ensemble
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddAllToCart}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB400] py-3.5 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-[1.01] shadow-lg shadow-[#FFB400]/20"
            >
              {addedAll ? <Check size={16} /> : <ShoppingBag size={16} />}
              {addedAll ? "Complete Look Added to Bag!" : "Shop Complete Outfit"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
