import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import formatNaira from "../../utils/formatNaira";
import { isAuthenticated } from "../../api/client";

export default function CartDrawer() {
  const {
    cartItems,
    cartCount,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  if (!isCartOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 50000;
  const isFreeDeliveryEligible = subtotal >= FREE_DELIVERY_THRESHOLD;
  const amountNeededForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`relative z-10 flex h-full w-full max-w-md flex-col shadow-2xl transition-transform duration-300 ${
          isDark
            ? "border-l border-white/10 bg-[#141414] text-white"
            : "border-l border-[#EAE6DF] bg-[#FBF9F5] text-[#141414]"
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`flex items-center justify-between border-b px-6 py-4 ${
            isDark ? "border-white/10" : "border-[#EAE6DF]"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#FFB400]" />
            <h2 className="font-display text-lg font-semibold">
              Shopping Bag ({cartCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className={`rounded-full p-1.5 transition-colors ${
              isDark
                ? "text-white/60 hover:bg-white/10 hover:text-white"
                : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800"
            }`}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div
          className={`px-6 py-3 text-xs border-b ${
            isDark
              ? "bg-[#1C1C1C] border-white/10 text-white/70"
              : "bg-[#F2ECE1] border-[#EAE6DF] text-[#554E45]"
          }`}
        >
          {isFreeDeliveryEligible ? (
            <p className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <ShieldCheck size={14} /> You've unlocked **Free Delivery** nationwide! 🎉
            </p>
          ) : (
            <p>
              Add <span className="font-semibold text-[#FFB400]">{formatNaira(amountNeededForFreeDelivery)}</span> more to qualify for **Free Nationwide Delivery**.
            </p>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full mb-4 ${
                  isDark ? "bg-white/5 text-white/30" : "bg-neutral-200/60 text-neutral-400"
                }`}
              >
                <ShoppingBag size={32} />
              </div>
              <p
                className={`font-display text-lg font-medium ${
                  isDark ? "text-white/80" : "text-neutral-700"
                }`}
              >
                Your bag is empty
              </p>
              <p
                className={`mt-1 font-sans text-xs max-w-xs ${
                  isDark ? "text-white/40" : "text-neutral-500"
                }`}
              >
                Discover our latest luxury abayas, gowns, and fabrics to fill your bag.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate("/products");
                }}
                className="mt-6 rounded-xl bg-[#FFB400] px-6 py-2.5 font-sans text-xs font-semibold text-[#0F0F0F] transition-transform hover:scale-105"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const unitPrice = item.price + (item.price_adjustment || 0);
              const itemTotal = unitPrice * item.quantity;

              return (
                <div
                  key={item.uniqueId}
                  className={`flex gap-4 rounded-xl border p-3.5 transition-all ${
                    isDark
                      ? "border-white/10 bg-[#1A1A1A]"
                      : "border-[#EAE6DF] bg-white shadow-sm"
                  }`}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 shrink-0 rounded-lg object-cover bg-neutral-200"
                  />

                  {/* Item Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`font-display text-sm font-medium line-clamp-1 ${
                            isDark ? "text-white" : "text-[#141414]"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.uniqueId)}
                          className="text-red-400 opacity-60 hover:opacity-100 transition-opacity"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Variant badges */}
                      <div className="mt-1 flex flex-wrap items-center gap-2 font-sans text-[11px]">
                        {item.color && (
                          <span
                            className={`rounded px-2 py-0.5 ${
                              isDark
                                ? "bg-white/10 text-white/70"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            Color: {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span
                            className={`rounded px-2 py-0.5 ${
                              isDark
                                ? "bg-white/10 text-white/70"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            Size: {item.size}
                          </span>
                        )}
                        {item.customMeasurements && (
                          <span className="rounded bg-[#FFB400]/15 px-2 py-0.5 text-[#FFB400] font-semibold">
                            Custom Tailored
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity Stepper */}
                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-sans text-sm font-bold text-[#FFB400]">
                        {formatNaira(itemTotal)}
                      </p>

                      <div
                        className={`flex items-center rounded-lg border ${
                          isDark
                            ? "border-white/15 bg-[#141414]"
                            : "border-neutral-300 bg-neutral-100"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.uniqueId, -1)}
                          className="px-2 py-1 text-xs opacity-70 hover:opacity-100 hover:text-[#FFB400]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.uniqueId, 1)}
                          className="px-2 py-1 text-xs opacity-70 hover:opacity-100 hover:text-[#FFB400]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout Summary */}
        {cartItems.length > 0 && (
          <div
            className={`border-t p-6 space-y-4 ${
              isDark
                ? "border-white/10 bg-[#161616]"
                : "border-[#EAE6DF] bg-white shadow-md"
            }`}
          >
            <div className="flex items-center justify-between font-sans text-sm">
              <span className={isDark ? "text-white/60" : "text-neutral-600"}>
                Subtotal
              </span>
              <span className="font-display text-xl font-bold text-[#FFB400]">
                {formatNaira(subtotal)}
              </span>
            </div>

            <p
              className={`font-sans text-[11px] ${
                isDark ? "text-white/40" : "text-neutral-500"
              }`}
            >
              Taxes &amp; shipping calculated at checkout.
            </p>

            <button
              type="button"
              onClick={() => {
                closeCart();
                if (!isAuthenticated()) {
                  navigate("/login", { state: { from: { pathname: "/checkout" } } });
                } else {
                  navigate("/checkout");
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB400] py-3.5 font-sans text-sm font-semibold text-[#0F0F0F] transition-transform hover:scale-[1.01] shadow-lg shadow-[#FFB400]/20 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={clearCart}
                className="text-red-400 opacity-60 hover:opacity-100 hover:underline"
              >
                Clear Bag
              </button>
              <button
                type="button"
                onClick={closeCart}
                className={isDark ? "text-white/50 hover:text-white" : "text-neutral-500 hover:text-neutral-800"}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
