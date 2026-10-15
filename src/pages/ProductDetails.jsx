import React, { useState, useEffect } from "react";
import apiClient, { ENDPOINTS, API_BASE_URL } from "../api/client";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FeaturesBar from "../components/layout/FeaturesBar";
import ItemCard from "../components/catalog/ItemCard";
import formatNaira from "../utils/formatNaira";
import toTitleCase from "../utils/textFormatter";
import formatMaterialName from "../utils/materialNames";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import {
  Star,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Ruler,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  ChevronRight,
  ChevronLeft,
  Check,
  Scissors,
  UserCheck,
  Play,
  User,
  ZoomIn,
  Minus,
  Plus,
  Share2,
  ThumbsUp,
  MessageCircle,
  Camera,
} from "lucide-react";

const formatImageUrl = (url) => {
  if (!url) return "";
  if (typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `https://marvelam.onrender.com${url}`;
  return `https://marvelam.onrender.com/${url}`;
};

/* ─────────────────────── Color Hex Mapping Helper ─────────────────────── */

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

/* ─────────────────────── Reusable Stars component ─────────────────────── */

function Stars({ rating, size = 13, isDark = true }) {
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

/* ─────────────────────── Feature Strip (under product) ─────────────────── */

const FEATURE_STRIP = [
  { icon: Truck, title: "Free Delivery", copy: "On orders above ₦50,000" },
  { icon: RotateCcw, title: "Easy Returns", copy: "Return within 7 days" },
  { icon: ShieldCheck, title: "Secure Payment", copy: "100% secure checkout" },
  { icon: Headset, title: "Dedicated Support", copy: "24/7 Customer support" },
];

/* ─────────────────────── Accordion Sections ─────────────────────────── */

const ACCORDION_SECTIONS = ["Details", "Fabric & Care", "Shipping & Returns"];
const TABS = ["Description", "Details", "Fabric & Care", "Shipping & Returns"];

/* ═══════════════════════════════════════════════════════════════════════════
   Gallery Component — Resets thumbnail to 0 whenever color/images change
   ═══════════════════════════════════════════════════════════════════════════ */

function Gallery({ images, videos, productName, isNewArrival, percentDiscount }) {
  const [active, setActive] = useState(0);
  const [zoomProps, setZoomProps] = useState({ isZoomed: false, x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const totalMedia = images.length + videos.length;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomProps({ isZoomed: true, x, y });
  };

  const handleMouseLeave = () => {
    setZoomProps({ isZoomed: false, x: 0, y: 0 });
  };

  useEffect(() => {
    setActive(0);
  }, [images]);

  return (
    <div className="flex gap-3">
      {/* Vertical Thumbnails (hidden on mobile) */}
      <div className="hidden flex-col gap-3 sm:flex">
        {images.map((imgUrl, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-pressed={active === i}
            className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-150 ${
              isDark ? "bg-[#1A1A1A]" : "bg-neutral-100"
            } ${
              active === i
                ? "border-[#FFB400]"
                : isDark
                ? "border-white/10 hover:border-white/30"
                : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            <img src={imgUrl} alt="" className="h-full w-full object-cover" />
          </button>
        ))}

        {/* Video thumbnails */}
        {videos.map((vid, i) => (
          <button
            key={`vid-${vid.id}`}
            type="button"
            onClick={() => setActive(images.length + i)}
            aria-label={`View video ${i + 1}`}
            className={`relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 transition-colors duration-150 ${
              isDark ? "bg-[#1A1A1A]" : "bg-neutral-100"
            } ${
              active === images.length + i
                ? "border-[#FFB400]"
                : isDark
                ? "border-white/10 hover:border-white/30"
                : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            <Play size={18} className="text-[#FFB400]" />
            <span
              className={`absolute bottom-1 text-[8px] ${
                isDark ? "text-white/50" : "text-neutral-500"
              }`}
            >
              Video
            </span>
          </button>
        ))}
      </div>

      {/* Main Image / Video */}
      <div
        className={`relative flex-1 overflow-hidden rounded-xl cursor-crosshair ${
          isDark ? "bg-[#1A1A1A]" : "bg-neutral-100"
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badges */}
        {isNewArrival && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-[#FFB400] px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#0F0F0F]">
            New Arrival
          </span>
        )}
        {percentDiscount > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-md bg-red-600 px-2.5 py-1 font-sans text-[10px] font-bold text-white shadow-md">
            {Math.round(percentDiscount)}% OFF
          </span>
        )}

        {active < images.length ? (
          <img
            src={images[active]}
            alt={productName}
            className="aspect-[3/4] w-full object-cover transition-transform duration-200 ease-out"
            style={{
              transformOrigin: `${zoomProps.x}% ${zoomProps.y}%`,
              transform: zoomProps.isZoomed ? "scale(2.5)" : "scale(1)",
            }}
          />
        ) : (
          <video
            src={videos[active - images.length]?.video}
            controls
            className="aspect-[3/4] w-full object-cover bg-black"
          />
        )}

        {/* Prev / Next arrows */}
        {totalMedia > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActive((a) => (a - 1 + totalMedia) % totalMedia)
              }
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/70 text-white backdrop-blur-sm transition-colors hover:bg-[#FFB400] hover:text-[#0F0F0F]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % totalMedia)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/70 text-white backdrop-blur-sm transition-colors hover:bg-[#FFB400] hover:text-[#0F0F0F]"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-[#0F0F0F]/70 px-2.5 py-1 font-sans text-[11px] text-white/70 backdrop-blur-sm">
          <ZoomIn size={13} /> Hover to zoom
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Product Info — Controlled Color, filtered Sizes, Custom Fit & CTAs
   ═══════════════════════════════════════════════════════════════════════════ */

function ProductInfoPanel({
  productInfo,
  variantDetails,
  groupedVariantSizes,
  addToCartUrl,
  selectedColor,
  onColorChange,
  galleryImages = [],
}) {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const isDark = theme === "dark";

  // Derive available colors from variantDetails (new structure) or fallback
  const availableColors = React.useMemo(() => {
    if (Array.isArray(variantDetails) && variantDetails.length > 0) {
      const hasNewStructure = variantDetails.some(
        (v) => Array.isArray(v.sizes) || v.color_display
      );
      if (hasNewStructure) {
        return variantDetails
          .filter((v) => !v.status || v.status === "ACTIVE")
          .map((v) => ({
            color: v.color,
            color_display: v.color_display || v.color,
          }));
      }
      // Legacy flat variantDetails
      const map = new Map();
      variantDetails.forEach((v) => {
        if (v.color && !map.has(v.color)) {
          map.set(v.color, {
            color: v.color,
            color_display: v.color_display || v.color,
          });
        }
      });
      return Array.from(map.values());
    }

    if (groupedVariantSizes) {
      return Object.keys(groupedVariantSizes)
        .filter((k) => k !== "null")
        .map((k) => ({
          color: k,
          color_display: k,
        }));
    }

    return [];
  }, [variantDetails, groupedVariantSizes]);

  const currentColorGroup = React.useMemo(() => {
    if (!selectedColor || !Array.isArray(variantDetails)) return null;
    return variantDetails.find((v) => v.color === selectedColor);
  }, [variantDetails, selectedColor]);

  const sizesForColor = React.useMemo(() => {
    if (!selectedColor) return [];

    // New backend structure: currentColorGroup.sizes array
    if (currentColorGroup && Array.isArray(currentColorGroup.sizes)) {
      return currentColorGroup.sizes.filter(
        (s) => !s.status || s.status === "ACTIVE"
      );
    }

    // Legacy flat variantDetails array
    if (Array.isArray(variantDetails) && variantDetails.length > 0) {
      const flat = variantDetails.filter((v) => v.color === selectedColor);
      if (flat.length > 0) {
        return flat.map((s) => ({
          id: s.id,
          size: s.size,
          size_display: s.size_display || s.size,
          stock: s.stock ?? 0,
          stock_status:
            s.stock_status || (s.stock > 0 ? "In stock" : "Out of stock"),
          sku: s.sku,
          price_adjustment: s.price_adjustment || "0.00",
        }));
      }
    }

    // Fallback to groupedVariantSizes
    if (groupedVariantSizes && groupedVariantSizes[selectedColor]) {
      return (groupedVariantSizes[selectedColor] || []).filter(
        (s) => s.size !== null
      );
    }

    return [];
  }, [selectedColor, currentColorGroup, variantDetails, groupedVariantSizes]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [isCustomFit, setIsCustomFit] = useState(false);
  const [customMeasurements, setCustomMeasurements] = useState({
    bust: "",
    waist: "",
    hips: "",
    length: "",
  });

  const getColorDisplay = (colorCode) => {
    const found = availableColors.find((c) => c.color === colorCode);
    return found?.color_display || colorCode;
  };

  const selectedSizeObj = React.useMemo(() => {
    if (!selectedSize || !sizesForColor) return null;
    return sizesForColor.find((s) => s.size === selectedSize);
  }, [sizesForColor, selectedSize]);

  const basePrice = Number(productInfo.price) || 0;
  const discountedPrice = Number(productInfo.discounted_price) || basePrice;
  const priceAdjustment = selectedSizeObj
    ? Number(selectedSizeObj.price_adjustment) || 0
    : 0;
  const finalPrice = discountedPrice + priceAdjustment;
  const hasDiscount = Number(productInfo.percent_discount) > 0;

  const currentSku =
    selectedSizeObj?.sku || currentColorGroup?.sizes?.[0]?.sku || "";

  const currentStock = selectedSizeObj
    ? Number(selectedSizeObj.stock) || 0
    : sizesForColor.length > 0
    ? sizesForColor.reduce((acc, s) => acc + (Number(s.stock) || 0), 0)
    : Number(productInfo.total_stock) || 0;

  const stockStatus = selectedSizeObj
    ? selectedSizeObj.stock_status ||
      (currentStock > 0 ? "In stock" : "Out of stock")
    : currentStock > 0
    ? "In stock"
    : "Out of stock";

  const handleColorClick = (colorCode) => {
    onColorChange(colorCode);
    setSelectedSize(null);
  };

  const handleSizeSelect = (sizeCode) => {
    if (sizeCode === "CUSTOM") {
      setIsCustomFit(true);
      setSelectedSize(null);
    } else {
      setIsCustomFit(false);
      setSelectedSize(sizeCode);
    }
  };

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    const primaryImg =
      currentColorGroup?.images?.find((img) => img.is_primary)?.image ||
      currentColorGroup?.images?.[0]?.image ||
      galleryImages?.[0] ||
      productInfo.pry_image;

    // Pick active size object (user selected, or fallback to first in-stock variant)
    const activeSizeObj =
      selectedSizeObj ||
      (sizesForColor && sizesForColor.length > 0
        ? sizesForColor.find((s) => Number(s.stock) > 0) || sizesForColor[0]
        : null);

    const productVarSizeId = activeSizeObj?.id ? Number(activeSizeObj.id) : null;
    const finalSizeCode = isCustomFit
      ? "Custom"
      : selectedSize || activeSizeObj?.size || null;
    const finalSizeDisplay = isCustomFit
      ? "Custom Fit"
      : selectedSizeObj?.size_display || activeSizeObj?.size_display || finalSizeCode;

    addToCart(
      {
        id: productInfo.id || "product",
        name: productInfo.name,
        price: basePrice,
        discounted_price: discountedPrice,
        price_adjustment: priceAdjustment,
        pry_image: primaryImg,
        sku: currentSku || activeSizeObj?.sku || "",
        product_var_size_id: productVarSizeId,
        model_name: "productvariantsize",
      },
      {
        product_var_size_id: productVarSizeId,
        color: selectedColor,
        colorDisplay: getColorDisplay(selectedColor),
        size: finalSizeCode,
        sizeDisplay: finalSizeDisplay,
        quantity: qty,
        customMeasurements: isCustomFit ? customMeasurements : null,
        addToCartUrl,
      }
    );
  };

  return (
    <div>
      {/* Badges */}
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-[#FFB400]/40 bg-[#FFB400]/10 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#FFB400]">
          {toTitleCase(productInfo.quality_category || "Premium")} Quality
        </span>
        {productInfo.is_new_arrival && (
          <span className="rounded-md border border-[#FFB400]/40 bg-[#FFB400]/10 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#FFB400]">
            New Arrival
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        className={`mt-4 font-display text-3xl leading-tight sm:text-4xl ${
          isDark ? "text-[#F9FAFB]" : "text-[#1A1A1A]"
        }`}
      >
        {productInfo.name}
      </h1>

      {/* Rating + SKU */}
      <div className="mt-2 flex flex-wrap items-center gap-3 font-sans text-sm">
        <div className="flex items-center gap-1.5">
          <Stars rating={productInfo.average_rating} isDark={isDark} />
          <a
            href="#reviews"
            className={`${
              isDark ? "text-white/60" : "text-neutral-600"
            } hover:text-[#FFB400]`}
          >
            ({productInfo.review_count} Reviews)
          </a>
        </div>
        {currentSku && (
          <>
            <span className={isDark ? "text-white/30" : "text-neutral-300"}>
              |
            </span>
            <span className={isDark ? "text-white/45" : "text-neutral-500"}>
              SKU: {currentSku}
            </span>
          </>
        )}
      </div>

      {/* Price */}
      <div className="mt-5">
        <p className="font-display text-3xl text-[#FFB400]">
          {formatNaira(finalPrice)}
        </p>
        {hasDiscount && (
          <div className="mt-1 flex items-center gap-3">
            <span
              className={`font-sans text-sm line-through ${
                isDark ? "text-white/40" : "text-neutral-400"
              }`}
            >
              {formatNaira(basePrice + priceAdjustment)}
            </span>
            <span className="font-sans text-xs font-semibold text-emerald-500">
              Save {formatNaira(basePrice - discountedPrice)} (
              {Math.round(productInfo.percent_discount)}% off)
            </span>
          </div>
        )}
        {priceAdjustment > 0 && (
          <p
            className={`mt-1 font-sans text-[11px] ${
              isDark ? "text-white/50" : "text-neutral-500"
            }`}
          >
            +{formatNaira(priceAdjustment)} price adjustment for this variant
          </p>
        )}
      </div>

      {/* Color Swatch Selector */}
      {availableColors.length > 0 && (
        <div className="mt-6">
          <p
            className={`font-sans text-xs font-semibold uppercase tracking-wide ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            Color:{" "}
            <span
              className={`font-normal normal-case ${
                isDark ? "text-white/80" : "text-neutral-800"
              }`}
            >
              {selectedColor ? getColorDisplay(selectedColor) : "—"}
            </span>
          </p>
          <div className="mt-2.5 flex items-center gap-3 flex-wrap">
            {availableColors.map((colorObj) => {
              const colorCode = colorObj.color;
              const colorDisplay = colorObj.color_display;
              const isSelected = selectedColor === colorCode;
              const hex =
                COLOR_HEX_MAP[colorCode?.toUpperCase()] ||
                COLOR_HEX_MAP[colorDisplay?.toUpperCase()] ||
                "#333333";

              return (
                <button
                  key={colorCode}
                  type="button"
                  onClick={() => handleColorClick(colorCode)}
                  aria-label={colorDisplay}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-sans text-xs font-semibold transition-all duration-150 ${
                    isSelected
                      ? "border-[#FFB400] bg-[#FFB400]/15 text-[#FFB400] ring-2 ring-[#FFB400]/30"
                      : isDark
                      ? "border-white/15 text-white/70 hover:border-white/40"
                      : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{colorDisplay}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector (Ready-To-Wear Only) */}
      {sizesForColor.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p
              className={`font-sans text-xs font-semibold uppercase tracking-wide ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              Size:{" "}
              <span
                className={`font-normal normal-case ${
                  isDark ? "text-white/80" : "text-neutral-800"
                }`}
              >
                {selectedSizeObj?.size_display ||
                  selectedSize ||
                  (isCustomFit ? "Custom" : "—")}
              </span>
            </p>
            <button
              type="button"
              className="flex items-center gap-1.5 font-sans text-xs text-[#FFB400] hover:underline"
            >
              <Ruler size={13} /> Size Guide
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {sizesForColor.map((sizeObj) => {
              const sizeCode = sizeObj.size;
              const sizeDisplay = sizeObj.size_display || sizeCode;
              const isOutOfStock = Number(sizeObj.stock) === 0;
              return (
                <button
                  key={sizeObj.id || sizeCode}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleSizeSelect(sizeCode)}
                  aria-pressed={selectedSize === sizeCode}
                  title={sizeDisplay}
                  className={`flex h-10 min-w-[3rem] px-3 items-center justify-center rounded-md border font-sans text-sm transition-colors duration-150 ${
                    selectedSize === sizeCode
                      ? "border-[#FFB400] bg-[#FFB400]/10 text-[#FFB400] font-semibold"
                      : isOutOfStock
                      ? "cursor-not-allowed border-neutral-300 opacity-30 line-through"
                      : isDark
                      ? "border-white/15 text-white/70 hover:border-white/40"
                      : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {sizeCode}
                </button>
              );
            })}

            {/* Custom Fit Option */}
            <button
              type="button"
              onClick={() => handleSizeSelect("CUSTOM")}
              aria-pressed={isCustomFit}
              className={`flex items-center gap-1.5 rounded-md border px-3 font-sans text-xs font-semibold transition-colors duration-150 ${
                isCustomFit
                  ? "border-[#FFB400] bg-[#FFB400]/10 text-[#FFB400]"
                  : isDark
                  ? "border-white/15 text-white/70 hover:border-white/40"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
              }`}
            >
              <Scissors size={13} /> Custom Fit
            </button>
          </div>
        </div>
      )}

      {/* Custom Tailoring Inputs */}
      {isCustomFit && (
        <div className="mt-4 rounded-xl border border-[#FFB400]/40 bg-[#FFB400]/5 p-4">
          <div className="flex items-center gap-2 font-sans text-xs font-semibold text-[#FFB400]">
            <Scissors size={16} />
            <span>Custom Tailoring Measurements (Inches)</span>
          </div>
          <p
            className={`mt-1 font-sans text-[11px] ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            Our master tailors will craft this item to your exact measurements.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["bust", "waist", "hips", "length"].map((field) => (
              <div key={field}>
                <label
                  className={`block font-sans text-[10px] uppercase ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  {field}
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${field === "length" ? '58"' : '36"'}`}
                  value={customMeasurements[field]}
                  onChange={(e) =>
                    setCustomMeasurements({
                      ...customMeasurements,
                      [field]: e.target.value,
                    })
                  }
                  className={`mt-1 w-full rounded-md border px-2.5 py-1.5 font-sans text-xs focus:border-[#FFB400] focus:outline-none ${
                    isDark
                      ? "border-white/15 bg-[#1A1A1A] text-white"
                      : "border-neutral-300 bg-white text-neutral-800"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock urgency */}
      {currentStock > 0 && currentStock <= 10 && (
        <p className="mt-4 font-sans text-xs text-[#FFB400]/90">
          &#9679; Only {currentStock} left in stock
        </p>
      )}
      {currentStock > 10 && (
        <p className="mt-4 font-sans text-xs text-emerald-500">
          ✓ {stockStatus} ({currentStock} available)
        </p>
      )}
      {currentStock === 0 && (
        <p className="mt-4 font-sans text-xs text-red-500">✕ Out of Stock</p>
      )}

      {/* Quantity */}
      <div className="mt-4 flex items-center gap-4">
        <div
          className={`flex items-center rounded-md border ${
            isDark ? "border-white/15 bg-[#1A1A1A]" : "border-neutral-300 bg-white"
          }`}
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center opacity-70 hover:text-[#FFB400] hover:opacity-100"
          >
            <Minus size={14} />
          </button>
          <span
            className={`w-8 text-center font-sans text-sm ${
              isDark ? "text-white" : "text-neutral-800"
            }`}
          >
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center opacity-70 hover:text-[#FFB400] hover:opacity-100"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={currentStock === 0}
          className={`flex items-center justify-center gap-2 rounded-md py-3.5 font-sans text-sm font-semibold transition-all duration-200 hover:scale-[1.01] ${
            currentStock > 0
              ? "bg-[#FFB400] text-[#0F0F0F] hover:bg-[#FFB400]/90"
              : "cursor-not-allowed bg-neutral-300 text-neutral-500"
          }`}
        >
          {added ? (
            <>
              Added to Cart! <Check size={16} />
            </>
          ) : (
            <>
              Add to Cart <ShoppingCart size={16} />
            </>
          )}
        </button>
        <button
          type="button"
          className="rounded-md border border-[#FFB400] py-3.5 font-sans text-sm font-semibold text-[#FFB400] transition-colors duration-200 hover:bg-[#FFB400]/10"
        >
          Buy Now
        </button>
      </div>

      {/* Wishlist + Share */}
      <div
        className={`mt-4 flex items-center gap-6 font-sans text-xs ${
          isDark ? "text-white/60" : "text-neutral-600"
        }`}
      >
        <button
          type="button"
          onClick={() => setWishlisted((w) => !w)}
          className="flex items-center gap-1.5 hover:text-[#FFB400]"
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-[#FFB400] text-[#FFB400]" : ""}
          />
          {wishlisted ? "Added to Wishlist" : "Add to Wishlist"}
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-[#FFB400]"
        >
          <Share2 size={15} /> Share
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Feature Strip — Under gallery & product info
   ═══════════════════════════════════════════════════════════════════════════ */

function FeatureStrip() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`mt-10 grid grid-cols-2 gap-6 border-y py-6 sm:grid-cols-4 ${
        isDark ? "border-white/10" : "border-neutral-200"
      }`}
    >
      {FEATURE_STRIP.map(({ icon: Icon, title, copy }) => (
        <div key={title} className="flex items-center gap-3">
          <Icon size={22} className="shrink-0 text-[#FFB400]" />
          <div>
            <p
              className={`font-sans text-xs font-semibold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {title}
            </p>
            <p
              className={`font-sans text-[11px] ${
                isDark ? "text-white/50" : "text-neutral-500"
              }`}
            >
              {copy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Description Tab — Accordion with Details, Fabric & Care, Shipping
   ═══════════════════════════════════════════════════════════════════════════ */

function DescriptionTab({ description, details, fabricCare }) {
  const [open, setOpen] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <p
        className={`font-sans text-sm leading-relaxed ${
          isDark ? "text-white/60" : "text-neutral-600"
        }`}
      >
        {description || "No description available."}
      </p>

      <div
        className={`mt-5 divide-y border-t ${
          isDark
            ? "divide-white/10 border-white/10"
            : "divide-neutral-200 border-neutral-200"
        }`}
      >
        {ACCORDION_SECTIONS.map((section) => {
          let content = null;
          if (section === "Details") {
            content = details || "Product details have not been added yet.";
          } else if (section === "Fabric & Care") {
            content = fabricCare || "Fabric care instructions have not been added yet.";
          } else if (section === "Shipping & Returns") {
            content =
              "Ships within 2–4 business days nationwide. Eligible for return or exchange within 7 days of delivery, unworn and with tags attached.";
          }

          return (
            <div key={section}>
              <button
                type="button"
                onClick={() => setOpen((o) => (o === section ? null : section))}
                aria-expanded={open === section}
                className="flex w-full items-center justify-between py-4 font-sans text-xs font-semibold uppercase tracking-wide text-[#FFB400]"
              >
                {section}
                <span className="text-lg leading-none">
                  {open === section ? "\u2212" : "+"}
                </span>
              </button>
              {open === section && (
                <p
                  className={`pb-4 font-sans text-sm leading-relaxed whitespace-pre-line ${
                    isDark ? "text-white/55" : "text-neutral-600"
                  }`}
                >
                  {content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Reviews Tab — Write review form + review list
   ═══════════════════════════════════════════════════════════════════════════ */

function ReviewsTab({ reviewsData }) {
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const reviewsList = reviewsData?.items?.review || [];
  const reviewCount = reviewsData?.review_count || 0;
  const averageRating = reviewsData?.average_rating || 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      {/* Write a review form */}
      <div
        className={`rounded-xl border p-6 ${
          isDark
            ? "border-white/10 bg-[#151515]"
            : "border-neutral-200 bg-[#FAF8F5]"
        }`}
      >
        <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-[#FFB400]">
          Your Review
        </h4>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB400]/15 font-sans text-sm font-semibold text-[#FFB400]">
            <User size={16} />
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setReviewRating(i + 1)}
                aria-label={`Rate ${i + 1} star`}
              >
                <Star
                  size={18}
                  className={
                    i < reviewRating
                      ? "fill-[#FFB400] text-[#FFB400]"
                      : isDark
                      ? "fill-transparent text-white/25"
                      : "fill-transparent text-neutral-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={3}
          placeholder="Share your experience about this product..."
          className={`mt-4 w-full resize-none rounded-md border p-3 font-sans text-sm focus:border-[#FFB400] focus:outline-none ${
            isDark
              ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
              : "border-neutral-300 bg-white text-[#1A1A1A] placeholder:text-neutral-400"
          }`}
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 font-sans text-xs ${
              isDark
                ? "border-white/15 text-white/60 hover:border-[#FFB400] hover:text-[#FFB400]"
                : "border-neutral-300 text-neutral-600 hover:border-[#FFB400] hover:text-[#FFB400]"
            }`}
          >
            <Camera size={14} /> Add Photos
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`font-sans text-xs ${
                isDark
                  ? "text-white/50 hover:text-white/80"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-[#FFB400] px-4 py-2 font-sans text-xs font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p
              className={`font-sans text-sm ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              {reviewCount} Reviews
            </p>
            <Stars rating={averageRating} isDark={isDark} />
            <span
              className={`font-sans text-sm font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {averageRating}
            </span>
          </div>
          <select
            className={`rounded-md border px-3 py-1.5 font-sans text-xs focus:border-[#FFB400] focus:outline-none ${
              isDark
                ? "border-white/15 bg-[#1A1A1A] text-white"
                : "border-neutral-300 bg-white text-neutral-800"
            }`}
          >
            <option>Most Recent</option>
            <option>Highest Rated</option>
            <option>Lowest Rated</option>
          </select>
        </div>

        {reviewsList.length === 0 ? (
          <p
            className={`mt-6 font-sans text-sm italic ${
              isDark ? "text-white/50" : "text-neutral-500"
            }`}
          >
            No customer reviews yet. Be the first to review!
          </p>
        ) : (
          <ul
            className={`mt-4 divide-y ${
              isDark ? "divide-white/10" : "divide-neutral-200"
            }`}
          >
            {reviewsList.map((r) => (
              <li key={r.id} className="py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {r.profile_image ? (
                      <img
                        src={r.profile_image}
                        alt={r.username}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFB400]/15 font-sans text-sm font-semibold text-[#FFB400]">
                        {r.username?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`font-sans text-sm font-medium ${
                            isDark ? "text-white" : "text-neutral-800"
                          }`}
                        >
                          {r.username}
                        </p>
                        {r.purchase_verified && (
                          <span className="rounded-md border border-[#FFB400]/40 bg-[#FFB400]/10 px-1.5 py-0.5 font-sans text-[9px] font-semibold uppercase text-[#FFB400]">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Stars rating={r.rating} size={12} isDark={isDark} />
                        <span className="font-sans text-[11px] text-[#FFB400]">
                          {r.rating_display}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 font-sans text-[11px] ${
                      isDark ? "text-white/35" : "text-neutral-400"
                    }`}
                  >
                    {r.date_created}
                  </span>
                </div>

                <p
                  className={`mt-3 font-sans text-sm leading-relaxed ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  {r.comment}
                </p>

                <div
                  className={`mt-3 flex items-center gap-5 font-sans text-[11px] ${
                    isDark ? "text-white/45" : "text-neutral-500"
                  }`}
                >
                  <span>Was this helpful?</span>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-[#FFB400]"
                  >
                    <ThumbsUp size={12} /> 0
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-[#FFB400]"
                  >
                    <MessageCircle size={12} /> 0
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tabs Section — Description + Reviews
   ═══════════════════════════════════════════════════════════════════════════ */

function TabsSection({ description, details, fabricCare, reviewsData }) {
  const reviewCount = reviewsData?.review_count || 0;
  const allTabs = [...TABS, `Reviews (${reviewCount})`];
  const [active, setActive] = useState(allTabs[0]);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="reviews"
      className={`mt-10 rounded-xl border p-6 sm:p-8 ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-neutral-200 bg-white shadow-sm"
      }`}
    >
      <div
        className={`flex flex-wrap gap-x-8 gap-y-3 border-b pb-4 ${
          isDark ? "border-white/10" : "border-neutral-200"
        }`}
      >
        {allTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`font-sans text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
              active === tab
                ? "border-b-2 border-[#FFB400] pb-4 -mb-4 text-[#FFB400]"
                : isDark
                ? "text-white/50 hover:text-white/80"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {active.startsWith("Reviews") ? (
          <ReviewsTab reviewsData={reviewsData} />
        ) : (
          <DescriptionTab
            description={description}
            details={details}
            fabricCare={fabricCare}
          />
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Related Products — Horizontal Carousel Slider
   ═══════════════════════════════════════════════════════════════════════════ */

function RelatedCard({ product, onSelectProduct }) {
  const [saved, setSaved] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fallbackImg = `https://picsum.photos/seed/${product.id || "related"}/320/400`;
  const [imgSrc, setImgSrc] = useState(product.pry_image || fallbackImg);

  useEffect(() => {
    setImgSrc(product.pry_image || fallbackImg);
  }, [product.pry_image, fallbackImg]);

  return (
    <article
      className="group flex w-full cursor-pointer flex-col"
      onClick={() => onSelectProduct && onSelectProduct(product)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#1A1A1A]">
        <img
          src={imgSrc}
          alt={product.name}
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
          aria-label="Add to wishlist"
          aria-pressed={saved}
          className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F0F0F]/70 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[#FFB400] hover:text-[#0F0F0F]"
        >
          <Heart size={13} className={saved ? "fill-current" : ""} />
        </button>
      </div>
      <h3
        className={`mt-2.5 font-sans text-sm font-medium line-clamp-1 ${
          isDark ? "text-[#F9FAFB]" : "text-[#1A1A1A]"
        }`}
      >
        {product.name}
      </h3>
      <div className="mt-0.5 flex items-center gap-2">
        <p className="font-sans text-sm font-semibold text-[#FFB400]">
          {formatNaira(Number(product.discounted_price || product.price) || 0)}
        </p>
        {product.discounted_price &&
          product.price &&
          Number(product.discounted_price) < Number(product.price) && (
            <span
              className={`font-sans text-xs line-through ${
                isDark ? "text-white/40" : "text-neutral-400"
              }`}
            >
              {formatNaira(Number(product.price))}
            </span>
          )}
      </div>
      <div className="mt-0.5 flex items-center gap-1">
        <Stars rating={product.avg_rating} size={11} isDark={isDark} />
        <span
          className={`font-sans text-[11px] ${
            isDark ? "text-white/45" : "text-neutral-500"
          }`}
        >
          ({product.review_count})
        </span>
      </div>
    </article>
  );
}

function RelatedProducts({ similarProducts, onSelectProduct }) {
  const scrollRef = React.useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!similarProducts || similarProducts.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mt-14">
      {/* Title Bar */}
      <div className="flex items-center gap-4">
        <span
          className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-neutral-200"}`}
        />
        <h2 className="whitespace-nowrap font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
          You May Also Like
        </h2>
        <span
          className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-neutral-200"}`}
        />
      </div>

      {/* Carousel Container with Centered Left/Right Navigation Buttons */}
      <div className="relative mt-6">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Previous products"
          className={`absolute -left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:border-[#FFB400] hover:bg-[#FFB400] hover:text-[#0F0F0F] ${
            isDark
              ? "border-white/25 bg-[#0F0F0F]/90 text-white"
              : "border-neutral-300 bg-white/90 text-neutral-800"
          }`}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Carousel Slider Track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth px-2 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {similarProducts.map((p) => (
            <div key={p.id} className="w-48 sm:w-56 shrink-0">
              <RelatedCard
                product={p}
                onSelectProduct={onSelectProduct}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Next products"
          className={`absolute -right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:border-[#FFB400] hover:bg-[#FFB400] hover:text-[#0F0F0F] ${
            isDark
              ? "border-white/25 bg-[#0F0F0F]/90 text-white"
              : "border-neutral-300 bg-white/90 text-neutral-800"
          }`}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Page Component — Manages Selected Color state & Filters Gallery Images
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ProductDetails({
  product,
  onBackToCatalog,
  onSelectProduct,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isFabric =
    window.location.pathname.includes("/fabrics") ||
    window.location.pathname.includes("/materials") ||
    product?.model_type === "materials";

  // Fetch full product details from Django API
  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      if (!product || (!product.id && !product.item_detail_url)) return;
      setLoading(true);
      try {
        let endpoint = product.item_detail_url;
        if (!endpoint) {
          const basePath = isFabric ? "/materials" : "/products";
          const itemSlug = product.slug || "item";
          if (product.id) {
            endpoint = `${basePath}/${itemSlug}/${product.id}/`;
          }
        }

        let response;
        try {
          response = await apiClient.get(endpoint);
        } catch (firstErr) {
          // If first attempt gave 404, try the alternate endpoint (/materials vs /products)
          if (firstErr.response?.status === 404 && product.id) {
            const altPath = isFabric ? "/products" : "/materials";
            const altSlug = product.slug || "item";
            const altEndpoint = `${altPath}/${altSlug}/${product.id}/`;
            response = await apiClient.get(altEndpoint);
          } else {
            throw firstErr;
          }
        }

        if (response?.data && isMounted) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, [product, isFabric]);

  // Derived data with fallback if API response is loading or offline
  const productInfo =
    data?.product_info ||
    data?.material_info ||
    (data?.id || data?.name ? data : null) || {
      id: product?.id,
      name: product?.name || (isFabric ? "Luxury Fabric Material" : "Luxury Apparel Item"),
      price: product?.price || 45000,
      discounted_price: product?.discounted_price || product?.price || 45000,
      total_stock: product?.total_stock || product?.stock || 50,
      percent_discount: product?.percent_discount || 0,
      quality_category: product?.quality_category || "PREMIUM",
      category: product?.category || (isFabric ? "FABRICS" : "DRESSES"),
      is_new_arrival: product?.is_new_arrival || false,
      average_rating: product?.avg_rating || product?.average_rating || 5.0,
      review_count: product?.review_count || 0,
    };
  const variantDetails = data?.variant_details || [];
  const groupedVariantSizes = data?.grouped_variant_sizes || {
    BLK: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 },
    ],
  };
  const videos = data?.videos || [];
  const reviewsData = data?.reviews_data || {};
  const similarProducts = data?.similar_products || data?.similar_materials || [];
  const addToCartUrl = data?.add_to_cart_url || `${API_BASE_URL}/cart/add/`;
  const productDetails = data?.details || null;
  const fabricCare = data?.fabric_care || null;

  // Extract color codes from variantDetails (new structure) or groupedVariantSizes
  const colorKeys = React.useMemo(() => {
    if (Array.isArray(variantDetails) && variantDetails.length > 0) {
      return variantDetails
        .filter((v) => !v.status || v.status === "ACTIVE")
        .map((v) => v.color)
        .filter(Boolean);
    }
    if (groupedVariantSizes) {
      return Object.keys(groupedVariantSizes).filter((k) => k !== "null");
    }
    return [];
  }, [variantDetails, groupedVariantSizes]);

  useEffect(() => {
    if (
      colorKeys.length > 0 &&
      (!selectedColor || !colorKeys.includes(selectedColor))
    ) {
      setSelectedColor(colorKeys[0]);
    }
  }, [colorKeys, selectedColor]);

  // Filter gallery images according to new or legacy variant_details structure
  const galleryImages = React.useMemo(() => {
    const list = [];
    let foundImages = false;

    if (selectedColor && Array.isArray(variantDetails)) {
      // New structure: variantDetails items are color groups with an .images array
      const colorGroup = variantDetails.find(
        (v) => v.color?.toUpperCase() === selectedColor?.toUpperCase()
      );
      if (colorGroup && Array.isArray(colorGroup.images) && colorGroup.images.length > 0) {
        foundImages = true;
        const sorted = [...colorGroup.images].sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.display_order ?? 0) - (b.display_order ?? 0);
        });
        sorted.forEach((imgObj) => {
          const rawUrl = typeof imgObj === "string" ? imgObj : imgObj?.image;
          const formatted = formatImageUrl(rawUrl);
          if (formatted && !list.includes(formatted)) list.push(formatted);
        });
      }

      // Legacy structure or fallback: filter flat variants by color
      if (!foundImages) {
        const colorVariants = variantDetails.filter(
          (v) => v.color?.toUpperCase() === selectedColor?.toUpperCase()
        );
        colorVariants.forEach((v) => {
          if (v.images && v.images.length > 0) foundImages = true;
          (v.images || [])
            .sort((a, b) => {
              if (a.is_primary && !b.is_primary) return -1;
              if (!a.is_primary && b.is_primary) return 1;
              return (a.display_order ?? 0) - (b.display_order ?? 0);
            })
            .forEach((imgObj) => {
              const rawUrl = typeof imgObj === "string" ? imgObj : imgObj?.image;
              const formatted = formatImageUrl(rawUrl);
              if (formatted && !list.includes(formatted)) list.push(formatted);
            });
        });
      }

      // If variant has absolutely NO images, generate 5 dummy placeholders for testing!
      if (!foundImages) {
        for (let i = 0; i < 5; i++) {
          const fallbackSeed = `${productInfo?.id || "product"}-${selectedColor}-${i}`;
          list.push(`https://picsum.photos/seed/${fallbackSeed}/480/600`);
        }
      }

    } else {
      // No variant selected. Fallback to product primary image
      const mainImg = formatImageUrl(
        productInfo?.pry_image || product?.pry_image || product?.image
      );
      if (mainImg) {
        list.push(mainImg);
      }
  
      // Final placeholder fallback
      if (list.length === 0) {
        list.push(
          `https://picsum.photos/seed/${productInfo?.id || "product"}/700/900`
        );
      }
    }

    return list;
  }, [selectedColor, variantDetails, productInfo, product]);

  if (loading && !productInfo.name) {
    return (
      <div
        className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
          isDark ? "bg-[#0F0F0F] text-[#F9FAFB]" : "bg-[#FAF8F5] text-[#141414]"
        }`}
      >
        <Header />
        <div className="flex items-center justify-center py-32 opacity-60">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#FFB400] border-t-transparent" />
            <p>Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
          isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FAF8F5] text-[#1A1A1A]"
        }`}
      >
        <Header />
        <div className="py-32 text-center opacity-60">
          <p className="text-lg">Product not found.</p>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="mt-4 font-sans text-[#FFB400] underline hover:opacity-80"
          >
            ← Back to Catalog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FAF8F5] text-[#1A1A1A]"
      }`}
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`mb-5 flex flex-wrap items-center gap-2 font-sans text-xs ${
            isDark ? "text-white/50" : "text-neutral-500"
          }`}
        >
          <button
            type="button"
            onClick={onBackToCatalog}
            className="hover:text-[#FFB400]"
          >
            Home
          </button>
          <ChevronRight size={12} aria-hidden="true" />
          <button
            type="button"
            onClick={onBackToCatalog}
            className="hover:text-[#FFB400]"
          >
            {isFabric ? "Fabrics & Textiles" : "Ready-Made Collection"}
          </button>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="hover:text-[#FFB400]">
            {isFabric
              ? toTitleCase(formatMaterialName(productInfo.category))
              : toTitleCase(productInfo.category || "")}
          </span>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[#FFB400]">{productInfo.name}</span>
        </nav>

        {/* Gallery + Product Info */}
        <div className="grid gap-10 lg:grid-cols-2">
          <Gallery
            images={galleryImages}
            videos={videos}
            productName={productInfo.name}
            isNewArrival={productInfo.is_new_arrival}
            percentDiscount={productInfo.percent_discount}
          />
          <ProductInfoPanel
            productInfo={productInfo}
            variantDetails={variantDetails}
            groupedVariantSizes={groupedVariantSizes}
            addToCartUrl={addToCartUrl}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            galleryImages={galleryImages}
          />
        </div>

        <FeatureStrip />

        <TabsSection
          description={productInfo.description}
          details={productDetails}
          fabricCare={fabricCare}
          reviewsData={reviewsData}
        />

        <RelatedProducts
          similarProducts={similarProducts}
          onSelectProduct={onSelectProduct}
        />
      </main>

      <FeaturesBar />
      <Footer />
    </div>
  );
}
