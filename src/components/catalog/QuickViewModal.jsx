import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../api/client";
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Ruler,
} from "lucide-react";
import formatNaira from "../../utils/formatNaira";
import toTitleCase from "../../utils/textFormatter";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";

const safeUpper = (val) => (val ? String(val).toUpperCase() : "");

const COLOR_HEX_MAP = {
  BLK: "#0F0F0F",
  BLACK: "#0F0F0F",
  GLD: "#FFB400",
  GOLD: "#FFB400",
  CHM: "#C9A45C",
  CHAMPAGNE: "#C9A45C",
  EMR: "#1F3D2C",
  EMERALD: "#1F3D2C",
  RED: "#991B1B",
  WHT: "#FFFFFF",
  WHITE: "#FFFFFF",
  BLU: "#1E40AF",
  BLUE: "#1E40AF",
  GRN: "#166534",
  GREEN: "#166534",
  PNK: "#EC4899",
  PINK: "#EC4899",
  SLV: "#C0C0C0",
  SILVER: "#C0C0C0",
  BRN: "#78350F",
  BROWN: "#78350F",
};

const formatImageUrl = (url) => {
  if (!url) return "";
  if (typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `https://marvelam.onrender.com${url}`;
  return `https://marvelam.onrender.com/${url}`;
};

export default function QuickViewModal({
  item,
  onClose,
  onViewFullDetails,
  apiEndpoint,
}) {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const isDark = theme === "dark";

  const [fullProduct, setFullProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // User selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoomProps, setZoomProps] = useState({ isZoomed: false, x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomProps({ isZoomed: true, x, y });
  };

  const handleMouseLeave = () => {
    setZoomProps({ isZoomed: false, x: 0, y: 0 });
  };

  // Fetch full data on mount or item change
  useEffect(() => {
    let active = true;
    if (!item?.id) {
      setFullProduct(null);
      return;
    }

    // Reset state for new item
    setFullProduct(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setImgIndex(0);
    setQuantity(1);
    setAdded(false);

    const loadData = async () => {
      setLoadingDetails(true);
      try {
        let url = item.item_detail_url;
        if (!url) {
          const base = apiEndpoint || "products/";
          const itemSlug = item.slug || "item";
          url = `${base}${itemSlug}/${item.id}/`;
        }
        const res = await apiClient.get(url);
        if (active && res.data) {
          setFullProduct(res.data);
        }
      } catch (e) {
        console.error("QuickView API Error:", e);
      } finally {
        if (active) setLoadingDetails(false);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [item?.id, item?.slug, item?.item_detail_url]);

  // Resolve data sources safely. Fallback to 'item' while fullProduct is loading.
  const productInfo = fullProduct?.product_info || fullProduct || item || {};
  const variantDetails = Array.isArray(fullProduct?.variant_details)
    ? fullProduct.variant_details
    : Array.isArray(item?.variant_details)
      ? item.variant_details
      : [];

  // Compute available colors
  const availableColors = useMemo(() => {
    const colors = [];
    variantDetails.forEach((v) => {
      if (
        v?.color &&
        !colors.some((c) => safeUpper(c.color) === safeUpper(v.color))
      ) {
        colors.push({
          color: v.color,
          color_display: v.color_display || v.color,
        });
      }
    });
    return colors;
  }, [variantDetails]);

  // Determine active color explicitly
  const activeColor = selectedColor || availableColors[0]?.color || null;
  const activeColorGroup =
    variantDetails.find(
      (v) => safeUpper(v?.color) === safeUpper(activeColor),
    ) || null;

  // Compute available sizes for active color
  const sizesForColor = useMemo(() => {
    if (activeColorGroup?.sizes && Array.isArray(activeColorGroup.sizes)) {
      return activeColorGroup.sizes;
    }
    return [];
  }, [activeColorGroup]);

  // Compute gallery images for active color
  const galleryImages = useMemo(() => {
    let imgs = [];

    if (activeColorGroup) {
      if (
        activeColorGroup.images &&
        Array.isArray(activeColorGroup.images) &&
        activeColorGroup.images.length > 0
      ) {
        // Use EXACTLY the images from the backend for this variant
        const sorted = [...activeColorGroup.images].sort((a, b) => {
          if (a?.is_primary && !b?.is_primary) return -1;
          if (!a?.is_primary && b?.is_primary) return 1;
          return (a?.display_order || 0) - (b?.display_order || 0);
        });
        imgs = sorted.map((i) => formatImageUrl(i?.image)).filter(Boolean);
      } else {
        // Variant exists but has NO images yet. Generate 5 testing placeholders!
        // We purposefully don't use the product's global pry_image here so the image strictly changes.
        for (let i = 0; i < 5; i++) {
          const fallbackSeed = `${item?.id || "item"}-${activeColorGroup.color || "var"}-${i}`;
          imgs.push(`https://picsum.photos/seed/${fallbackSeed}/480/600`);
        }
      }
    } else {
      // No variant selected (e.g., product has no variants). Use global product image.
      const mainImg = formatImageUrl(
        productInfo?.pry_image ||
          productInfo?.image ||
          item?.pry_image ||
          item?.image,
      );
      if (mainImg) imgs.push(mainImg);
      if (imgs.length === 0) {
        imgs.push(`https://picsum.photos/seed/${item?.id || "main"}/480/600`);
      }
    }

    return imgs;
  }, [activeColorGroup, productInfo, item]);

  // Safe Image Index bounds check
  const safeImgIndex =
    imgIndex >= 0 && imgIndex < galleryImages.length ? imgIndex : 0;
  const currentImage = galleryImages[safeImgIndex];

  // Active Size Object bounds check
  const activeSizeObj =
    sizesForColor.find((s) => safeUpper(s?.size) === safeUpper(selectedSize)) ||
    sizesForColor[0] ||
    null;

  // Pricing Logic
  const basePrice = Number(productInfo?.price || item?.price) || 0;
  const discountVal =
    Number(
      productInfo?.discounted_price ||
        productInfo?.discount_price ||
        item?.discounted_price ||
        item?.discount_price,
    ) || 0;
  const hasDiscount = discountVal > 0 && discountVal < basePrice;
  const priceAdjustment = Number(activeSizeObj?.price_adjustment) || 0;
  const currentPrice =
    (hasDiscount ? discountVal : basePrice) + priceAdjustment;

  // Stock Logic
  const stock = Number(
    activeSizeObj?.stock ??
      productInfo?.total_stock ??
      item?.stock ??
      item?.total_stock ??
      0,
  );
  const stockStatus =
    activeSizeObj?.stock_status || (stock > 0 ? "In stock" : "Out of stock");
  const isOutOfStock = stock <= 0;

  // Rating Logic
  const avgRating = Math.round(
    Number(
      productInfo?.avg_rating ||
        productInfo?.average_rating ||
        item?.avg_rating ||
        0,
    ),
  );

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    addToCart(
      {
        id: productInfo?.id || item?.id,
        name: productInfo?.name || item?.name,
        price: basePrice,
        discounted_price: discountVal || basePrice,
        price_adjustment: priceAdjustment,
        pry_image: currentImage,
        sku: activeSizeObj?.sku || "",
      },
      {
        color: activeColor,
        colorDisplay: activeColorGroup?.color_display || activeColor,
        size: activeSizeObj?.size || "Standard",
        sizeDisplay:
          activeSizeObj?.size_display || activeSizeObj?.size || "Standard",
        quantity,
      },
    );
  };

  const safeToTitleCase = (str) => {
    try {
      return str ? toTitleCase(String(str)) : "";
    } catch {
      return String(str || "");
    }
  };

  // MUST BE PLACED AFTER ALL HOOKS
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-10 flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border shadow-2xl md:flex-row transition-colors duration-300 ${
          isDark
            ? "border-white/15 bg-[#151515] text-white"
            : "border-neutral-200 bg-white text-[#1A1A1A]"
        }`}
      >
        {/* Close Btn */}
        <button
          onClick={onClose}
          className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-[#FFB400] hover:text-[#0F0F0F] ${
            isDark
              ? "bg-[#0F0F0F]/80 text-white/70"
              : "bg-neutral-100/80 text-neutral-600 shadow-sm"
          }`}
        >
          <X size={18} />
        </button>

        {/* Left: Images */}
        <div className="relative flex flex-col w-full md:w-[45%] shrink-0">
          <div
            className={`relative flex-1 min-h-[300px] md:min-h-[450px] w-full overflow-hidden ${isDark ? "bg-[#1A1A1A]" : "bg-neutral-100"}`}
          >
            {loadingDetails && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <div className="flex items-center gap-2 rounded-full bg-[#0F0F0F]/80 px-4 py-2 font-sans text-xs text-white backdrop-blur-md">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFB400] border-t-transparent" />
                  <span>Loading product details...</span>
                </div>
              </div>
            )}

            {productInfo?.is_new_arrival && (
              <span className="absolute left-3 top-3 z-10 rounded-md bg-[#FFB400] px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#0F0F0F] shadow-sm">
                New Arrival
              </span>
            )}
            {hasDiscount && (
              <span className="absolute right-3 top-3 z-10 rounded-md bg-red-600 px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow-sm">
                -{Math.round(((basePrice - discountVal) / basePrice) * 100)}%
              </span>
            )}

            <img
              src={currentImage}
              alt={productInfo?.name || "Product"}
              className="h-full w-full object-cover transition-transform duration-200 ease-out cursor-crosshair"
              style={{
                transformOrigin: `${zoomProps.x}% ${zoomProps.y}%`,
                transform: zoomProps.isZoomed ? "scale(2.5)" : "scale(1)",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />

            {/* Image Nav */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setImgIndex((prev) =>
                      prev === 0 ? galleryImages.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/50 text-white backdrop-blur-sm hover:bg-[#FFB400] hover:text-[#0F0F0F] transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setImgIndex((prev) =>
                      prev === galleryImages.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/50 text-white backdrop-blur-sm hover:bg-[#FFB400] hover:text-[#0F0F0F] transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails List (Spaced Down) */}
          <div className="mt-4 px-2 pb-4">
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`aspect-[3/4] w-full overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      safeImgIndex === i
                        ? "border-[#FFB400] opacity-100 ring-2 ring-[#FFB400]/30 ring-offset-1"
                        : isDark
                          ? "border-transparent opacity-50 hover:opacity-100 hover:border-white/30"
                          : "border-transparent opacity-60 hover:opacity-100 hover:border-neutral-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-1 flex-col p-5 overflow-y-auto max-h-[60vh] md:max-h-[90vh] sm:p-6 lg:p-8 custom-scrollbar">
          <div>
            {productInfo?.quality_category && (
              <span className="inline-block rounded-md bg-[#FFB400]/10 border border-[#FFB400]/30 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#FFB400]">
                {safeToTitleCase(productInfo.quality_category)} Quality
              </span>
            )}

            <h2
              className={`mt-2 font-display text-2xl font-medium sm:text-3xl ${isDark ? "text-white" : "text-[#1A1A1A]"}`}
            >
              {productInfo?.name || item?.name || "Product Name"}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-end gap-3">
              <span className="font-sans text-2xl font-bold text-[#FFB400]">
                {formatNaira(currentPrice)}
              </span>
              {hasDiscount && (
                <span
                  className={`font-sans text-base line-through pb-0.5 ${isDark ? "text-white/40" : "text-neutral-400"}`}
                >
                  {formatNaira(basePrice + priceAdjustment)}
                </span>
              )}
            </div>

            {/* Reviews & SKU */}
            <div className="mt-4 flex flex-wrap items-center gap-4 font-sans text-sm">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < avgRating
                          ? "fill-[#FFB400] text-[#FFB400]"
                          : isDark
                            ? "fill-transparent text-white/20"
                            : "fill-transparent text-neutral-300"
                      }
                    />
                  ))}
                </div>
                <span className={isDark ? "text-white/50" : "text-neutral-500"}>
                  ({productInfo?.review_count || item?.review_count || 0}{" "}
                  reviews)
                </span>
              </div>
              {activeSizeObj?.sku && (
                <>
                  <span
                    className={isDark ? "text-white/20" : "text-neutral-300"}
                  >
                    |
                  </span>
                  <span
                    className={isDark ? "text-white/50" : "text-neutral-500"}
                  >
                    SKU: {activeSizeObj.sku}
                  </span>
                </>
              )}
            </div>

            <div
              className={`mt-6 h-px w-full ${isDark ? "bg-white/10" : "bg-neutral-200"}`}
            />

            {/* Colors */}
            {availableColors.length > 0 && (
              <div className="mt-6">
                <label
                  className={`block font-sans text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/70" : "text-neutral-600"}`}
                >
                  Color:{" "}
                  <span
                    className={`font-normal normal-case ml-1 ${isDark ? "text-white" : "text-black"}`}
                  >
                    {activeColorGroup?.color_display || activeColor}
                  </span>
                </label>
                <div className="mt-3 flex flex-wrap gap-3">
                  {availableColors.map((c, i) => {
                    const isSel = safeUpper(c.color) === safeUpper(activeColor);
                    const hex =
                      COLOR_HEX_MAP[safeUpper(c.color)] ||
                      COLOR_HEX_MAP[safeUpper(c.color_display)] ||
                      "#888";
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedColor(c.color);
                          setSelectedSize(null);
                          setImgIndex(0);
                        }}
                        className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-sans text-sm transition-all ${
                          isSel
                            ? "border-[#FFB400] bg-[#FFB400]/10 text-[#FFB400] ring-1 ring-[#FFB400]"
                            : isDark
                              ? "border-white/20 text-white hover:border-white/50"
                              : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        {c.color_display}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizesForColor.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label
                    className={`block font-sans text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/70" : "text-neutral-600"}`}
                  >
                    Size:{" "}
                    <span
                      className={`font-normal normal-case ml-1 ${isDark ? "text-white" : "text-black"}`}
                    >
                      {activeSizeObj?.size_display ||
                        activeSizeObj?.size ||
                        "—"}
                    </span>
                  </label>
                  <button className="flex items-center gap-1 font-sans text-xs text-[#FFB400] hover:underline">
                    <Ruler size={14} /> Size Guide
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {sizesForColor.map((s, i) => {
                    const isSel =
                      safeUpper(s.size) === safeUpper(selectedSize) ||
                      (!selectedSize && activeSizeObj?.size === s.size);
                    const isOut = Number(s.stock) <= 0;
                    return (
                      <button
                        key={i}
                        disabled={isOut}
                        onClick={() => setSelectedSize(s.size)}
                        className={`rounded-lg border px-4 py-2 font-sans text-sm transition-all ${
                          isSel
                            ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F] font-bold shadow-md"
                            : isOut
                              ? "border-neutral-200 opacity-40 line-through cursor-not-allowed"
                              : isDark
                                ? "border-white/20 bg-[#222] text-white hover:border-white/50"
                                : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500 hover:bg-neutral-50"
                        }`}
                      >
                        {s.size || s.size_display}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status & Quantity */}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                {stock > 0 && stock <= 5 ? (
                  <p className="font-sans text-sm font-medium text-[#FFB400]">
                    Only {stock} left in stock!
                  </p>
                ) : stock > 5 ? (
                  <p className="font-sans text-sm font-medium text-emerald-500">
                    {stockStatus}
                  </p>
                ) : (
                  <p className="font-sans text-sm font-medium text-red-500">
                    Out of Stock
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label
                  className={`font-sans text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/70" : "text-neutral-600"}`}
                >
                  Qty:
                </label>
                <div
                  className={`flex items-center rounded-lg border ${isDark ? "border-white/20 bg-[#1A1A1A]" : "border-neutral-300 bg-neutral-50"}`}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-lg hover:text-[#FFB400] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-sans font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= stock}
                    className={`px-3.5 py-1.5 text-lg transition-colors ${quantity >= stock ? "opacity-50 cursor-not-allowed" : "hover:text-[#FFB400]"}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-8 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-sans text-sm font-bold tracking-wide transition-all ${
                  isOutOfStock
                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                    : "bg-[#FFB400] text-[#0F0F0F] hover:scale-[1.02] hover:shadow-lg shadow-[#FFB400]/20"
                }`}
              >
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                {added ? "Added to Cart!" : "Add to Bag"}
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-2 transition-all ${
                  saved
                    ? "border-[#FFB400] bg-[#FFB400]/10 text-[#FFB400]"
                    : isDark
                      ? "border-white/20 text-white hover:border-white/50"
                      : "border-neutral-300 text-neutral-600 hover:border-neutral-500"
                }`}
              >
                <Heart size={22} className={saved ? "fill-current" : ""} />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onViewFullDetails) onViewFullDetails(item);
              }}
              className={`flex items-center justify-center gap-2 w-full rounded-xl border-2 py-3 font-sans text-sm font-semibold transition-colors ${
                isDark
                  ? "border-white/20 text-white hover:bg-white hover:text-black"
                  : "border-[#0F0F0F] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white"
              }`}
            >
              <span>View Full Details</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollbar styling specifically for modal */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.5); }
      `,
        }}
      />
    </div>
  );
}
