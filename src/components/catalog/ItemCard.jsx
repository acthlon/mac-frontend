import formatNaira from "../../utils/formatNaira";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";

function StarRating({ rating = 0, reviews = 0, isDark = true }) {
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
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
      <span
        className={`font-sans text-[11px] ${
          isDark ? "text-white/45" : "text-neutral-500"
        }`}
      >
        ({reviews})
      </span>
    </div>
  );
}

export default function ItemCard({ item, view = "grid", onQuickView, onSelectProduct }) {
  const [saved, setSaved] = useState(false);
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const discountVal = Number(item.discounted_price ?? item.discount_price);
  const originalVal = Number(item.price) || 0;
  const hasDiscount = Boolean(discountVal && discountVal > 0 && discountVal < originalVal);
  const currentPrice = hasDiscount ? discountVal : originalVal;
  const discountPercent = item.percent_discount
    ? Math.round(Number(item.percent_discount))
    : item.discount_percent
    ? Math.round(Number(item.discount_percent))
    : (hasDiscount && originalVal > 0 ? Math.round(((originalVal - discountVal) / originalVal) * 100) : 0);

  const fallbackImg = `https://picsum.photos/seed/${item.id || item.name || "marvelam"}/480/600`;
  const [imgSrc, setImgSrc] = useState(item.pry_image || item.image || fallbackImg);

  useEffect(() => {
    setImgSrc(item.pry_image || item.image || fallbackImg);
  }, [item.pry_image, item.image, fallbackImg]);

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(item);
    } else {
      let slug = item.slug;
      let isMaterial = item.model_type === "materials";
      if (!slug && item.item_detail_url) {
        const parts = item.item_detail_url.split("/").filter(Boolean);
        const idx = parts.findIndex((p) => p === "products" || p === "materials");
        if (idx !== -1) {
          if (parts[idx] === "materials") isMaterial = true;
          if (parts[idx + 1]) slug = parts[idx + 1];
        }
      }
      if (!slug && item.name) {
        slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      const basePath = isMaterial ? "/fabrics" : "/products";
      navigate(`${basePath}/${slug || "item"}/${item.id}`);
    }
  };

  // 💡 Horizontal List View Layout
  if (view === "list") {
    return (
      <article
        className={`group flex flex-col gap-4 rounded-xl border p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between ${
          isDark
            ? "border-white/10 bg-[#151515] hover:border-[#FFB400]/40"
            : "border-neutral-200/80 bg-white shadow-sm hover:border-[#FFB400] hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleCardClick}>
          {/* Thumbnail */}
          <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-[#1A1A1A] sm:w-32">
            {hasDiscount && (
              <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-1.5 py-0.5 font-sans text-[9px] font-bold text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {item.is_new_arrival && (
              <span className={`absolute ${hasDiscount ? "left-12" : "left-2"} top-2 z-10 rounded bg-[#FFB400] px-1.5 py-0.5 font-sans text-[9px] font-semibold text-[#0F0F0F]`}>
                NEW
              </span>
            )}
            <img
              src={imgSrc}
              alt={item.name}
              onError={() => setImgSrc(fallbackImg)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div>
            <h3
              className={`font-display text-base font-medium transition-colors group-hover:text-[#FFB400] ${
                isDark ? "text-[#F9FAFB]" : "text-[#1A1A1A]"
              }`}
            >
              {item.name}
            </h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-sans text-sm font-bold text-[#FFB400]">
                {formatNaira(currentPrice)}
              </span>
              {hasDiscount && (
                <span className={`font-sans text-xs line-through ${isDark ? "text-white/40" : "text-neutral-400"}`}>
                  {formatNaira(originalVal)}
                </span>
              )}
            </div>
            <StarRating
              rating={item.avg_rating}
              reviews={item.review_count}
              isDark={isDark}
            />
            {item.quality_category && (
              <span
                className={`mt-2 inline-block rounded px-2 py-0.5 font-sans text-[11px] ${
                  isDark
                    ? "bg-white/5 text-white/60"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                Quality: {item.quality_category}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <button
            type="button"
            onClick={() => onQuickView && onQuickView(item)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 font-sans text-xs transition-colors ${
              isDark
                ? "border-white/15 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
                : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
            }`}
          >
            <Eye size={15} />
            Quick View
          </button>

          
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 font-sans text-xs transition-colors ${
              saved
                ? "border-[#FFB400] text-[#FFB400]"
                : isDark
                ? "border-white/15 text-white/70 hover:border-white/40"
                : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
            }`}
          >
            <Heart
              size={15}
              className={saved ? "fill-current text-[#FFB400]" : ""}
            />
            {saved ? "Saved" : "Wishlist"}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#1A1A1A]">
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-red-600 px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {item.is_new_arrival && (
          <span className={`absolute ${hasDiscount ? "left-16" : "left-3"} top-3 z-10 rounded-md bg-[#FFB400] px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#0F0F0F]`}>
            New
          </span>
        )}

        <img
          src={imgSrc}
          alt={item.name}
          loading="lazy"
          onError={() => setImgSrc(fallbackImg)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0F0F0F]/70 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[#FFB400] hover:text-[#0F0F0F]"
        >
          <Heart size={16} className={saved ? "fill-current" : ""} />
        </button>
        

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView && onQuickView(item);
          }}
          aria-label="Quick View"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0F0F0F]/70 text-white backdrop-blur-sm transition-colors hover:bg-[#FFB400] hover:text-[#0F0F0F]"
        >
          <Eye size={16} />
        </button>
      </div>

      <h3
        className={`mt-3 font-display text-[17px] leading-snug transition-colors group-hover:text-[#FFB400] ${
          isDark ? "text-[#F9FAFB]" : "text-[#1A1A1A]"
        }`}
      >
        {item.name}
      </h3>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="font-sans text-sm font-bold text-[#FFB400]">
          {formatNaira(currentPrice)}
        </span>
        {hasDiscount && (
          <span className={`font-sans text-xs line-through ${isDark ? "text-white/40" : "text-neutral-400"}`}>
            {formatNaira(originalVal)}
          </span>
        )}
      </div>
      <StarRating
        rating={item.avg_rating}
        reviews={item.review_count}
        isDark={isDark}
      />
    </article>
  );
}
