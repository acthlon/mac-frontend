import { useState } from "react";
import {
  Heart,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Lock,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headset,
  Star,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";
import PaymentBadges from "../components/common/PaymentBadges";
import { isAuthenticated } from "../api/client";

/**
 * MAC — Marvelam Apparel & Clothing
 * Shopping Cart Page
 *
 * Brand tokens
 * ------------
 * Gold      #FFB400
 * Off-white #F9FAFB
 * Ink/Black #0F0F0F
 * Display   Cormorant (headings)
 * Body      Montserrat (everything else)
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;1,500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
 *
 * tailwind.config.js
 * fontFamily: {
 *   display: ['Cormorant', 'serif'],
 *   sans: ['Montserrat', 'sans-serif'],
 * }
 */


const DISCOUNT = 10000;

const RELATED_PRODUCTS = [
  { name: "Ivory Bloom Abaya", price: 57000, rating: 5, reviews: 31, seed: "rel-1" },
  { name: "Mocha Luxury Kaftan", price: 49000, rating: 5, reviews: 19, seed: "rel-2" },
  { name: "Black Orchid Dress", price: 47000, rating: 4, reviews: 28, seed: "rel-3" },
  { name: "Olive Green Abaya", price: 45000, rating: 4, reviews: 17, seed: "rel-4" },
  { name: "Blush Pink Kaftan", price: 46000, rating: 4, reviews: 16, seed: "rel-5" },
  { name: "Golden Haze Boubou", price: 50000, rating: 4, reviews: 20, seed: "rel-6" },
];

const FEATURES = [
  { icon: ShieldCheck, title: "Premium Quality", copy: "Finest fabrics & exceptional finish" },
  { icon: Truck, title: "Nationwide Delivery", copy: "Fast, reliable & secure delivery" },
  { icon: ShieldCheck, title: "Secure Payment", copy: "100% secure & trusted checkout" },
  { icon: RotateCcw, title: "Easy Returns", copy: "Hassle-free returns within 7 days" },
  { icon: Headset, title: "Dedicated Support", copy: "We are here to help you always" },
];


function formatNaira(amount) {
  return `\u20A6${amount.toLocaleString("en-NG")}`;
}

function Stars({ rating, size = 11 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-[#FFB400] text-[#FFB400]" : "fill-transparent text-white/25"}
        />
      ))}
    </div>
  );
}

/* ---------------------------------- Header --------------------------------- */



/* -------------------------------- Cart item row ------------------------------ */

function CartRow({ item, onQtyChange, onRemove, onMoveToWishlist }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const originalPrice = Number(item.actual_price || item.originalPrice || item.price) || 0;
  const effectivePrice = Number(item.discounted_price || item.price) || originalPrice;
  const hasDiscount = originalPrice > effectivePrice;
  const discountPercent =
    item.percent_discount && Number(item.percent_discount) > 0
      ? Math.round(Number(item.percent_discount))
      : hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
      : 0;

  const attributes = [];
  if (item.color_display || item.color) attributes.push(`Color: ${item.color_display || item.color}`);
  if (item.size) attributes.push(`Size: ${item.size}`);
  if (item.model_name === "materialvariant") attributes.push("Fabric / Material");
  else if (item.model_name === "productvariantsize") attributes.push("Ready-to-Wear");

  const itemTotal = Number(item.item_subtotal_price || effectivePrice * (item.qty || item.quantity));

  return (
    <div className={`grid grid-cols-[auto_1fr] gap-4 border-b py-6 last:border-none sm:grid-cols-[80px_1fr_auto_auto_auto] sm:items-center sm:gap-6 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
      <img
        src={item.image || `https://picsum.photos/seed/${item.id || item.seed || '1'}/160/200`}
        alt={item.name}
        className="h-24 w-20 rounded-lg object-cover sm:h-24 sm:w-20 bg-neutral-200 shadow-sm"
      />

      <div className="min-w-0">
        <h3 className={`font-sans text-sm font-medium sm:text-base ${isDark ? "text-[#F9FAFB]" : "text-[#141414]"}`}>{item.name}</h3>
        {attributes.length > 0 && (
          <p className={`mt-1 font-sans text-xs ${isDark ? "text-white/50" : "text-[#141414]/50"}`}>
            {attributes.join(" | ")}
          </p>
        )}
        <button
          type="button"
          onClick={() => onMoveToWishlist(item.uniqueId || item.id)}
          className="mt-2 flex items-center gap-1.5 font-sans text-xs text-[#FFB400] hover:underline"
        >
          <Heart size={13} /> Move to Wishlist
        </button>

        {/* Mobile-only price/qty row */}
        <div className="mt-3 flex items-center justify-between sm:hidden">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold text-[#FFB400]">{formatNaira(effectivePrice)}</span>
              {hasDiscount && (
                <span className="rounded bg-red-600/10 px-1.5 py-0.5 text-[9px] font-bold text-red-600">-{discountPercent}%</span>
              )}
            </div>
            {hasDiscount && (
              <span className={`font-sans text-xs line-through mt-0.5 ${isDark ? "text-white/40" : "text-black/40"}`}>
                {formatNaira(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center rounded-md border ${isDark ? "border-white/15" : "border-neutral-200"}`}>
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => onQtyChange(item.uniqueId || item.id, (item.qty || item.quantity) - 1)}
                className={`flex h-8 w-8 items-center justify-center hover:text-[#FFB400] ${isDark ? "text-white/70" : "text-neutral-500"}`}
              >
                <Minus size={12} />
              </button>
              <span className={`w-6 text-center font-sans text-xs ${isDark ? "text-white" : "text-[#141414]"}`}>{item.qty || item.quantity}</span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => onQtyChange(item.uniqueId || item.id, (item.qty || item.quantity) + 1)}
                className={`flex h-8 w-8 items-center justify-center hover:text-[#FFB400] ${isDark ? "text-white/70" : "text-neutral-500"}`}
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              type="button"
              aria-label={`Remove ${item.name}`}
              onClick={() => onRemove(item.uniqueId || item.id)}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden flex-col sm:flex">
        <p className={`font-sans text-sm font-semibold ${isDark ? "text-white/80" : "text-black/80"}`}>{formatNaira(effectivePrice)}</p>
        {hasDiscount && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`font-sans text-xs line-through ${isDark ? "text-white/40" : "text-black/40"}`}>{formatNaira(originalPrice)}</span>
            <span className="rounded bg-red-600/10 px-1.5 py-0.5 text-[9px] font-bold text-red-600">-{discountPercent}%</span>
          </div>
        )}
      </div>

      <div className={`hidden items-center rounded-md border sm:flex ${isDark ? "border-white/15" : "border-neutral-200"}`}>
        <button
          type="button"
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => onQtyChange(item.uniqueId || item.id, (item.qty || item.quantity) - 1)}
          className={`flex h-9 w-9 items-center justify-center hover:text-[#FFB400] ${isDark ? "text-white/70" : "text-neutral-500"}`}
        >
          <Minus size={13} />
        </button>
        <span className={`w-7 text-center font-sans text-sm ${isDark ? "text-white" : "text-[#141414]"}`}>{item.qty || item.quantity}</span>
        <button
          type="button"
          aria-label={`Increase quantity of ${item.name}`}
          onClick={() => onQtyChange(item.uniqueId || item.id, (item.qty || item.quantity) + 1)}
          className={`flex h-9 w-9 items-center justify-center hover:text-[#FFB400] ${isDark ? "text-white/70" : "text-neutral-500"}`}
        >
          <Plus size={13} />
        </button>
      </div>

      <div className="hidden items-center gap-4 sm:flex">
        <p className={`font-sans text-sm font-semibold ${isDark ? "text-[#F9FAFB]" : "text-[#141414]"}`}>{formatNaira(itemTotal)}</p>
        <button
          type="button"
          aria-label={`Remove ${item.name}`}
          onClick={() => onRemove(item.uniqueId || item.id)}
          className="text-red-400 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Order summary -------------------------------- */

function OrderSummary({ subtotal, itemCount, totalDiscount, total }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  return (
    <div className={`rounded-xl border p-6 ${isDark ? "border-white/10 bg-[#151515]" : "border-neutral-200 bg-white"}`}>
      <h2 className="font-display text-lg text-[#FFB400]">Order Summary</h2>

      <div className={`mt-4 space-y-3 font-sans text-sm ${isDark ? "text-white/70" : "text-[#141414]/70"}`}>
        <div className="flex items-center justify-between">
          <span>Subtotal ({itemCount} items)</span>
          <span className={`${isDark ? "text-white/90" : "text-[#141414]/90"}`}>{formatNaira(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping Fee</span>
          <span className={`${isDark ? "text-white/90" : "text-[#141414]/90"}`}>Calculated at Checkout</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="text-red-500 font-semibold">-{formatNaira(totalDiscount)}</span>
          </div>
        )}
      </div>

      <div className={`mt-4 flex items-center justify-between border-t pt-4 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
        <span className={`font-sans text-sm font-semibold ${isDark ? "text-white" : "text-[#141414]"}`}>Total</span>
        <span className={`font-display text-2xl ${isDark ? "text-[#F9FAFB]" : "text-[#141414]"}`}>{formatNaira(total)}</span>
      </div>

      {totalDiscount > 0 && (
        <div className="mt-4 rounded-md border border-[#FFB400]/30 bg-[#FFB400]/10 px-4 py-2.5 text-center font-sans text-xs text-[#FFB400]">
          You're saving {formatNaira(totalDiscount)} on this order!
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!isAuthenticated()) {
            navigate("/login", { state: { from: { pathname: "/checkout" } } });
          } else {
            navigate("/checkout");
          }
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#FFB400] py-3.5 font-sans text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:scale-[1.01] hover:bg-[#FFB400]/90 cursor-pointer"
      >
        Proceed to Checkout <ChevronRight size={16} />
      </button>

      {!isAuthenticated() && (
        <p className="mt-2 text-center font-sans text-[11px] text-white/50">
          Sign in or register at checkout to secure your order
        </p>
      )}

      <p className="mt-3 flex items-center justify-center gap-1.5 font-sans text-[11px] text-white/45">
        <Lock size={11} /> Secure Checkout
      </p>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="font-sans text-[11px] text-white/40">We accept</p>
        <div className="mt-2 flex items-center gap-2">
          <PaymentBadges badgeClassName="h-5 w-auto" />
        </div>
      </div>
    </div>
  );
}

function TrustPanel() {
  const items = [
    { icon: Truck, title: "Free Delivery", copy: "On orders above " + formatNaira(50000) },
    { icon: RotateCcw, title: "Easy Returns", copy: "Return within 7 days" },
    { icon: ShieldCheck, title: "Secure Payment", copy: "100% secure payment" },
    { icon: Headset, title: "Need Help?", copy: "Chat with us or 0803 123 4567" },
  ];

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-[#151515] p-6">
      <ul className="space-y-4">
        {items.map(({ icon: Icon, title, copy }) => (
          <li key={title} className="flex items-start gap-3">
            <Icon size={18} className="mt-0.5 shrink-0 text-[#FFB400]" />
            <div>
              <p className="font-sans text-xs font-semibold text-white">{title}</p>
              <p className="font-sans text-[11px] text-white/50">{copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- Related products ------------------------------ */

function RelatedCard({ product }) {
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const price = Number(product.discounted_price || product.price) || 0;
  const originalPrice = Number(product.price) || 0;
  const image =
    product.pry_image ||
    product.image ||
    `https://picsum.photos/seed/${product.id || product.name || "item"}/320/400`;

  const handleClick = () => {
    let slug = product.slug;
    if (!slug && product.item_detail_url) {
      const parts = product.item_detail_url.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "products" || p === "materials");
      if (idx !== -1 && parts[idx + 1]) slug = parts[idx + 1];
    }
    if (!slug && product.name) {
      slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    navigate(`/products/${slug || "item"}/${product.id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="group flex w-40 shrink-0 cursor-pointer flex-col sm:w-auto"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#1A1A1A]">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {originalPrice > price && (
          <span className="absolute left-2.5 top-2.5 rounded bg-red-600 px-1.5 py-0.5 font-sans text-[10px] font-bold text-white shadow-sm">
            SALE
          </span>
        )}
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
      <h3 className="mt-2.5 font-sans text-sm line-clamp-1 text-[#F9FAFB] group-hover:text-[#FFB400] transition-colors">{product.name}</h3>
      <p className="mt-0.5 font-sans text-sm font-semibold text-[#FFB400]">{formatNaira(price)}</p>
      <Stars rating={Number(product.avg_rating) || 5} />
      <span className="mt-0.5 font-sans text-[11px] text-white/40">({product.review_count || 0})</span>
    </article>
  );
}

function RelatedProducts({ items = [] }) {
  const displayItems = items.length > 0 ? items : RELATED_PRODUCTS;
  return (
    <section className="mt-14">
      <div className="flex items-center justify-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <h2 className="whitespace-nowrap font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
          You May Also Like
        </h2>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="relative mt-6">
        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
          {displayItems.map((p, idx) => (
            <RelatedCard key={p.id || p.name || idx} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Features bar -------------------------------- */

function FeaturesBar() {
  return (
    <section className="mt-14 border-y border-white/10 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 sm:px-8 lg:grid-cols-5">
        {FEATURES.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <Icon size={22} className="text-[#FFB400]" />
            <p className="font-sans text-xs font-semibold text-white">{title}</p>
            <p className="font-sans text-[11px] text-white/50">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------ Footer ------------------------------------ */



/* --------------------------------------- Page ---------------------------------------- */

export default function ShoppingCartPage() {
  const navigate = useNavigate();
  const {
    cartCode,
    cartItems: cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalOriginalPrice,
    totalDiscount: contextDiscount,
    cartCount: itemCount,
    similarItems,
    refreshCart,
    loadingCart,
    isGuestCart,
  } = useCart();
  const [wishlistCount, setWishlistCount] = useState(2);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleQtyChange = (id, qty) => {
    updateQuantity(id, qty);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleMoveToWishlist = (id) => {
    removeFromCart(id);
    setWishlistCount((c) => c + 1);
  };

  const totalDiscount =
    contextDiscount > 0
      ? contextDiscount
      : totalOriginalPrice > subtotal
      ? totalOriginalPrice - subtotal
      : 0;

  return (
    <div className={`min-h-screen font-sans antialiased ${isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"}`}>
      <Header cartCount={itemCount} wishlistCount={wishlistCount} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8 min-h-[60vh]">
        <nav aria-label="Breadcrumb" className={`mb-5 flex items-center gap-2 font-sans text-xs ${isDark ? "text-white/50" : "text-[#141414]/50"}`}>
          <Link to="/" className="hover:text-[#FFB400]">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[#FFB400]">Shopping Cart</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`font-display text-3xl sm:text-4xl ${isDark ? "text-[#F9FAFB]" : "text-[#141414]"}`}>
                Your Shopping Cart ({itemCount})
              </h1>
              {cartCode ? (
                <span className="rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-3 py-1 font-mono text-xs font-semibold text-[#FFB400]">
                  #{cartCode}
                </span>
              ) : isGuestCart ? (
                <span className={`rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${isDark ? "border-white/10 bg-white/5 text-white/50" : "border-neutral-200 bg-neutral-100 text-neutral-500"}`}>
                  Guest Mode
                </span>
              ) : null}
            </div>
            <p className={`mt-1 font-sans text-sm ${isDark ? "text-white/50" : "text-[#141414]/50"}`}>
              Review your items and proceed to checkout
            </p>
          </div>
          {loadingCart && (
            <span className="text-xs font-medium text-[#FFB400] animate-pulse">
              Syncing with Marvelam...
            </span>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {cart.length > 0 ? (
              <>
                <div className="hidden grid-cols-[80px_1fr_auto_auto_auto] gap-6 border-b border-white/10 pb-3 font-sans text-xs font-semibold uppercase tracking-wide text-white/45 sm:grid">
                  <span />
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>

                <div>
                  {cart.map((item) => (
                    <CartRow
                      key={item.uniqueId || item.id}
                      item={item}
                      onQtyChange={handleQtyChange}
                      onRemove={handleRemove}
                      onMoveToWishlist={handleMoveToWishlist}
                    />
                  ))}
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className={`flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-sans text-sm transition-colors duration-200 ${
                      isDark
                        ? "border-white/15 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
                        : "border-neutral-300 text-neutral-800 hover:border-[#FFB400] hover:text-[#FFB400]"
                    }`}
                  >
                    <ArrowLeft size={15} /> Continue Shopping
                  </button>
                  <button
                    type="button"
                    onClick={() => refreshCart()}
                    disabled={loadingCart}
                    className={`flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-sans text-sm transition-colors duration-200 ${
                      isDark
                        ? "border-white/15 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
                        : "border-neutral-300 text-neutral-800 hover:border-[#FFB400] hover:text-[#FFB400]"
                    }`}
                  >
                    <RefreshCw size={14} className={loadingCart ? "animate-spin text-[#FFB400]" : ""} />{" "}
                    {loadingCart ? "Updating..." : "Update Cart"}
                  </button>
                </div>
              </>
            ) : (
              <div className={`rounded-xl border p-10 text-center ${isDark ? "border-white/10 bg-[#151515]" : "border-neutral-200 bg-white"}`}>
                <p className={`font-sans text-sm ${isDark ? "text-white/60" : "text-neutral-500"}`}>Your cart is currently empty.</p>
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#FFB400] px-5 py-2.5 font-sans text-xs font-semibold text-[#0F0F0F] hover:bg-[#FFB400]/90 transition-colors"
                >
                  Explore Products
                </button>
              </div>
            )}
          </div>

          <div>
            <OrderSummary
              subtotal={totalOriginalPrice}
              itemCount={itemCount}
              totalDiscount={totalDiscount}
              total={subtotal}
            />
            <TrustPanel />
          </div>
        </div>

        <RelatedProducts items={similarItems} />
      </main>

      <FeaturesBar />
      <Footer />
    </div>
  );
}
