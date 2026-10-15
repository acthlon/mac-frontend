import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Check,
  Truck,
  Zap,
  CreditCard,
  Banknote,
  Lock,
  ShieldCheck,
  Tag,
  MapPin,
} from "lucide-react";
import Header from "../components/layout/Header";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import formatNaira from "../utils/formatNaira";
import { isAuthenticated } from "../api/client";
import PaymentBadges, {
  VisaBadge,
  MastercardBadge,
  VerveBadge,
  PaystackBadge,
} from "../components/common/PaymentBadges";

/**
 * MAC — Marvelam Apparel & Clothing
 * Checkout Page
 *
 * Single-page checkout (delivery details → payment) with sticky order summary
 * and confirmation view. Brand tokens:
 * Gold      #FFB400
 * Off-white #F9FAFB
 * Ink/Black #0F0F0F
 * Display   Cormorant (headings)
 * Body      Montserrat (everything else)
 */

const CHECKOUT_STEPS = ["Cart", "Checkout", "Confirmation"];

const FALLBACK_CART_ITEMS = [
  { name: "Royal Gold Embroidered Abaya", color: "Black & Gold", size: "M", qty: 1, price: 48000, seed: "co-1" },
  { name: "Champagne Silk Kaftan", color: "Champagne", size: "L", qty: 1, price: 42500, seed: "co-2" },
  { name: "Premium Satin Fabric", color: "Champagne", length: "5 Yards", qty: 2, price: 12000, seed: "co-3" },
];

const ADDRESS_TYPES = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

const NIGERIAN_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Oyo",
  "Kano",
  "Enugu",
  "Ogun",
  "Delta",
  "Edo",
  "Kaduna",
  "Anambra",
  "Akwa Ibom",
  "Imo",
  "Ondo",
  "Osun",
  "Kwara",
];

const DELIVERY_METHODS = [
  { id: "standard", label: "Standard Delivery", eta: "3 – 5 business days", fee: 0 },
  { id: "express", label: "Express Delivery", eta: "1 – 2 business days", fee: 4500 },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Pay with Card", icon: CreditCard, copy: "Secured by Paystack" },
  { id: "pod", label: "Pay on Delivery", icon: Banknote, copy: "Available in select cities" },
];

function InstagramIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

/* ------------------------------- Checkout Steps ------------------------------ */

function CheckoutSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {CHECKOUT_STEPS.map((label, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;
        const isLast = i === CHECKOUT_STEPS.length - 1;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 font-sans text-xs font-bold transition-colors ${
                  isComplete || isCurrent
                    ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F]"
                    : "border-white/15 bg-[#1A1A1A] text-white/40"
                }`}
              >
                {isComplete ? <Check size={14} /> : i + 1}
              </span>
              <span
                className={`font-sans text-xs font-semibold sm:text-sm transition-colors ${
                  isComplete || isCurrent ? "text-white" : "text-white/40"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && <span className="h-px w-6 bg-white/15 sm:w-10" />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- Field ---------------------------------- */

function Field({ label, required = false, children, isDark = true }) {
  return (
    <div>
      <label
        className={`font-sans text-xs font-semibold uppercase tracking-wide ${
          isDark ? "text-white/60" : "text-[#5A5247]"
        }`}
      >
        {label} {required && <span className="text-[#FFB400]">*</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* ------------------------------ Delivery Section ----------------------------- */

function DeliverySection({
  details,
  onDetailsChange,
  method,
  onMethodChange,
  isDark = true,
  errors = {},
}) {
  const update = (field) => (e) =>
    onDetailsChange({ ...details, [field]: e.target.value });

  const inputClasses = `w-full rounded-md border px-4 py-2.5 font-sans text-sm transition-colors focus:border-[#FFB400] focus:outline-none ${
    isDark
      ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
      : "border-[#E2DDCF] bg-white text-[#141414] placeholder:text-neutral-400"
  }`;

  return (
    <section
      className={`rounded-xl border p-6 transition-colors ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-sm"
      }`}
    >
      <h2
        className={`flex items-center gap-2 font-display text-xl ${
          isDark ? "text-[#F9FAFB]" : "text-[#141414]"
        }`}
      >
        <MapPin size={18} className="text-[#FFB400]" /> Delivery Details
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Field label="First Name" required isDark={isDark}>
            <input
              type="text"
              name="first_name"
              required
              value={details.first_name}
              onChange={update("first_name")}
              placeholder="First name"
              autoComplete="given-name"
              className={`${inputClasses} ${
                errors.first_name ? "border-red-500" : ""
              }`}
            />
          </Field>
          {errors.first_name && (
            <p className="mt-1 font-sans text-[11px] text-red-400">First name is required</p>
          )}
        </div>

        <div>
          <Field label="Last Name" required isDark={isDark}>
            <input
              type="text"
              name="last_name"
              required
              value={details.last_name}
              onChange={update("last_name")}
              placeholder="Last name"
              autoComplete="family-name"
              className={`${inputClasses} ${
                errors.last_name ? "border-red-500" : ""
              }`}
            />
          </Field>
          {errors.last_name && (
            <p className="mt-1 font-sans text-[11px] text-red-400">Last name is required</p>
          )}
        </div>

        <div>
          <Field label="Phone Number" required isDark={isDark}>
            <input
              type="tel"
              name="phone_number"
              required
              value={details.phone_number}
              onChange={update("phone_number")}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
              className={`${inputClasses} ${
                errors.phone_number ? "border-red-500" : ""
              }`}
            />
          </Field>
          {errors.phone_number && (
            <p className="mt-1 font-sans text-[11px] text-red-400">Phone number is required</p>
          )}
        </div>

        <Field label="Alternative Phone Number (Optional)" isDark={isDark}>
          <input
            type="tel"
            name="alternative_phone_number"
            value={details.alternative_phone_number}
            onChange={update("alternative_phone_number")}
            placeholder="+234 800 000 0000"
            className={inputClasses}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Email Address" required isDark={isDark}>
            <input
              type="email"
              name="email"
              required
              value={details.email}
              onChange={update("email")}
              placeholder="you@email.com"
              autoComplete="email"
              className={`${inputClasses} ${
                errors.email ? "border-red-500" : ""
              }`}
            />
          </Field>
          {errors.email && (
            <p className="mt-1 font-sans text-[11px] text-red-400">Valid email is required</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <Field label="Delivery Address" required isDark={isDark}>
            <input
              type="text"
              name="delivery_address"
              required
              value={details.delivery_address}
              onChange={update("delivery_address")}
              placeholder="House number and street name"
              autoComplete="street-address"
              className={`${inputClasses} ${
                errors.delivery_address ? "border-red-500" : ""
              }`}
            />
          </Field>
          {errors.delivery_address && (
            <p className="mt-1 font-sans text-[11px] text-red-400">Delivery address is required</p>
          )}
        </div>

        <div>
          <Field label="City" required isDark={isDark}>
            <input
              type="text"
              name="city"
              required
              value={details.city}
              onChange={update("city")}
              placeholder="City"
              className={`${inputClasses} ${
                errors.city ? "border-red-500" : ""
              }`}
            />
          </Field>
          {errors.city && (
            <p className="mt-1 font-sans text-[11px] text-red-400">City is required</p>
          )}
        </div>

        <div>
          <Field label="State" required isDark={isDark}>
            <select
              name="state"
              required
              value={details.state}
              onChange={update("state")}
              className={`${inputClasses} ${
                errors.state ? "border-red-500" : ""
              }`}
            >
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((state) => (
                <option
                  key={state}
                  value={state}
                  className={isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}
                >
                  {state}
                </option>
              ))}
            </select>
          </Field>
          {errors.state && (
            <p className="mt-1 font-sans text-[11px] text-red-400">State is required</p>
          )}
        </div>

        <Field label="Country" isDark={isDark}>
          <input
            type="text"
            name="country"
            value={details.country}
            onChange={update("country")}
            placeholder="Country"
            autoComplete="country-name"
            className={inputClasses}
          />
        </Field>

        <Field label="Address Type" isDark={isDark}>
          <select
            name="address_type"
            value={details.address_type}
            onChange={update("address_type")}
            className={inputClasses}
          >
            {ADDRESS_TYPES.map((type) => (
              <option
                key={type.value}
                value={type.value}
                className={isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"}
              >
                {type.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Additional Info (Optional)" isDark={isDark}>
            <textarea
              name="additional_info"
              value={details.additional_info}
              onChange={update("additional_info")}
              rows={3}
              placeholder="Landmark, delivery instructions, gate code..."
              className={`${inputClasses} resize-none`}
            />
          </Field>
        </div>
      </div>

      <label
        className={`mt-4 flex cursor-pointer items-center gap-2 font-sans text-xs ${
          isDark ? "text-white/60" : "text-[#5A5247]"
        }`}
      >
        <input
          type="checkbox"
          checked={details.save_details}
          onChange={(e) =>
            onDetailsChange({ ...details, save_details: e.target.checked })
          }
          className="h-4 w-4 rounded border-white/30 bg-transparent accent-[#FFB400]"
        />
        Save these details for next time
      </label>

      <div
        className={`mt-6 border-t pt-5 ${
          isDark ? "border-white/10" : "border-[#EAE6DF]"
        }`}
      >
        <h3
          className={`font-sans text-xs font-semibold uppercase tracking-wide ${
            isDark ? "text-white/60" : "text-[#5A5247]"
          }`}
        >
          Delivery Method
        </h3>
        <div className="mt-3 space-y-2">
          {DELIVERY_METHODS.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 transition-colors duration-150 ${
                method === option.id
                  ? "border-[#FFB400] bg-[#FFB400]/10"
                  : isDark
                  ? "border-white/15 hover:border-white/30"
                  : "border-[#E2DDCF] bg-white hover:border-[#D5CFBF]"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery-method"
                  checked={method === option.id}
                  onChange={() => onMethodChange(option.id)}
                  className="h-4 w-4 accent-[#FFB400]"
                />
                <span>
                  {option.id === "express" ? (
                    <Zap size={14} className="mb-0.5 mr-1.5 inline text-[#FFB400]" />
                  ) : (
                    <Truck size={14} className="mb-0.5 mr-1.5 inline text-[#FFB400]" />
                  )}
                  <span
                    className={`font-sans text-sm font-medium ${
                      isDark ? "text-white" : "text-[#141414]"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span
                    className={`ml-2 font-sans text-xs ${
                      isDark ? "text-white/45" : "text-[#8C8375]"
                    }`}
                  >
                    {option.eta}
                  </span>
                </span>
              </span>
              <span className="font-sans text-sm font-semibold text-[#FFB400]">
                {option.fee === 0 ? "Free" : formatNaira(option.fee)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Payment Section ------------------------------ */

function PaymentSection({ method, onMethodChange, isDark = true }) {
  return (
    <section
      className={`rounded-xl border p-6 transition-colors ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-sm"
      }`}
    >
      <h2
        className={`font-display text-xl ${
          isDark ? "text-[#F9FAFB]" : "text-[#141414]"
        }`}
      >
        Payment Method
      </h2>

      <div className="mt-4 space-y-2">
        {PAYMENT_METHODS.map((option) => {
          const Icon = option.icon;
          const isActive = method === option.id;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 transition-colors duration-150 ${
                isActive
                  ? "border-[#FFB400] bg-[#FFB400]/10"
                  : isDark
                  ? "border-white/15 hover:border-white/30"
                  : "border-[#E2DDCF] bg-white hover:border-[#D5CFBF]"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment-method"
                  checked={isActive}
                  onChange={() => onMethodChange(option.id)}
                  className="h-4 w-4 accent-[#FFB400]"
                />
                <Icon size={16} className="text-[#FFB400]" />
                <span>
                  <span
                    className={`block font-sans text-sm font-medium ${
                      isDark ? "text-white" : "text-[#141414]"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span
                    className={`block font-sans text-xs ${
                      isDark ? "text-white/45" : "text-[#8C8375]"
                    }`}
                  >
                    {option.copy}
                  </span>
                </span>
              </span>

              {option.id === "card" && (
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <VisaBadge className="h-5 w-auto" />
                  <MastercardBadge className="h-5 w-auto" />
                  <VerveBadge className="h-5 w-auto" />
                  <PaystackBadge className="h-5 w-auto" />
                </div>
              )}
            </label>
          );
        })}
      </div>

      {method === "card" && (
        <div
          className={`mt-5 rounded-md border px-4 py-3 font-sans text-xs ${
            isDark
              ? "border-white/10 bg-[#1A1A1A] text-white/60"
              : "border-[#E2DDCF] bg-[#F7F4EE] text-[#5A5247]"
          }`}
        >
          You'll be redirected to Paystack's secure page to enter your card details and complete payment.
        </div>
      )}

      {method === "pod" && (
        <div
          className={`mt-5 rounded-md border px-4 py-3 font-sans text-xs ${
            isDark
              ? "border-white/10 bg-[#1A1A1A] text-white/60"
              : "border-[#E2DDCF] bg-[#F7F4EE] text-[#5A5247]"
          }`}
        >
          Pay in cash or by card when your order arrives. Available in select cities only.
        </div>
      )}
    </section>
  );
}

/* --------------------------------- Order Summary ------------------------------- */

function OrderSummaryCard({
  items,
  subtotal,
  deliveryFee,
  discount,
  total,
  promoCode,
  onPromoChange,
  onApplyPromo,
  promoMessage,
  onPlaceOrder,
  isDark = true,
  isSubmitting = false,
}) {
  return (
    <div
      className={`rounded-xl border p-6 transition-colors ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-sm"
      }`}
    >
      <h2 className="font-display text-lg text-[#FFB400]">Order Summary</h2>

      <ul
        className={`mt-4 max-h-72 space-y-4 overflow-y-auto pr-1 ${
          items.length === 0 ? "py-4 text-center" : ""
        }`}
      >
        {items.length === 0 ? (
          <p
            className={`font-sans text-xs ${
              isDark ? "text-white/50" : "text-[#8C8375]"
            }`}
          >
            No items in summary.
          </p>
        ) : (
          items.map((item) => (
            <li key={item.uniqueId} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={
                    item.image ||
                    `https://picsum.photos/seed/${item.uniqueId}/100/125`
                  }
                  alt={item.name}
                  className="h-14 w-11 rounded-md object-cover bg-neutral-800"
                />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFB400] font-sans text-[10px] font-bold text-[#0F0F0F]">
                  {item.qty}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-sans text-xs font-medium line-clamp-1 ${
                    isDark ? "text-white/85" : "text-[#141414]"
                  }`}
                >
                  {item.name}
                </p>
                <p
                  className={`mt-0.5 font-sans text-[11px] ${
                    isDark ? "text-white/45" : "text-[#8C8375]"
                  }`}
                >
                  {item.color}
                  {item.length
                    ? ` · ${item.length}`
                    : item.size
                    ? ` · Size ${item.size}`
                    : ""}
                </p>
              </div>
              <p className="font-sans text-xs font-semibold text-[#FFB400] shrink-0">
                {formatNaira(item.price * item.qty)}
              </p>
            </li>
          ))
        )}
      </ul>

      {/* Promo Code Box */}
      <div
        className={`mt-5 flex gap-2 border-t pt-5 ${
          isDark ? "border-white/10" : "border-[#EAE6DF]"
        }`}
      >
        <div className="relative flex-1">
          <Tag
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? "text-white/40" : "text-[#8C8375]"
            }`}
          />
          <input
            type="text"
            value={promoCode}
            onChange={(e) => onPromoChange(e.target.value)}
            placeholder="Promo code"
            className={`w-full rounded-md border py-2.5 pl-9 pr-3 font-sans text-xs transition-colors focus:border-[#FFB400] focus:outline-none ${
              isDark
                ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
                : "border-[#E2DDCF] bg-white text-[#141414] placeholder:text-neutral-400"
            }`}
          />
        </div>
        <button
          type="button"
          onClick={onApplyPromo}
          className={`rounded-md border px-4 font-sans text-xs font-semibold transition-colors duration-200 hover:border-[#FFB400] hover:text-[#FFB400] ${
            isDark
              ? "border-white/15 text-white/75"
              : "border-[#E2DDCF] text-[#4A453E]"
          }`}
        >
          Apply
        </button>
      </div>
      {promoMessage && (
        <p className="mt-2 font-sans text-[11px] text-[#FFB400]">{promoMessage}</p>
      )}

      {/* Totals Calculation */}
      <div
        className={`mt-4 space-y-3 border-t pt-4 font-sans text-sm ${
          isDark ? "border-white/10" : "border-[#EAE6DF]"
        }`}
      >
        <div
          className={`flex items-center justify-between ${
            isDark ? "text-white/70" : "text-[#5A5247]"
          }`}
        >
          <span>Subtotal</span>
          <span className={isDark ? "text-white/90" : "text-[#141414]"}>
            {formatNaira(subtotal)}
          </span>
        </div>
        <div
          className={`flex items-center justify-between ${
            isDark ? "text-white/70" : "text-[#5A5247]"
          }`}
        >
          <span>Delivery Fee</span>
          <span className={isDark ? "text-white/90" : "text-[#141414]"}>
            {deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}
          </span>
        </div>
        {discount > 0 && (
          <div
            className={`flex items-center justify-between ${
              isDark ? "text-white/70" : "text-[#5A5247]"
            }`}
          >
            <span>Discount</span>
            <span className="text-[#FFB400]">-{formatNaira(discount)}</span>
          </div>
        )}
      </div>

      <div
        className={`mt-4 flex items-center justify-between border-t pt-4 ${
          isDark ? "border-white/10" : "border-[#EAE6DF]"
        }`}
      >
        <span
          className={`font-sans text-sm font-semibold ${
            isDark ? "text-white" : "text-[#141414]"
          }`}
        >
          Total
        </span>
        <span
          className={`font-display text-2xl font-bold ${
            isDark ? "text-[#F9FAFB]" : "text-[#141414]"
          }`}
        >
          {formatNaira(total)}
        </span>
      </div>

      <button
        type="button"
        disabled={isSubmitting || items.length === 0}
        onClick={onPlaceOrder}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#FFB400] py-3.5 font-sans text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:scale-[1.01] hover:bg-[#FFB400]/90 shadow-lg shadow-[#FFB400]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : "Place Order"} <ChevronRight size={16} />
      </button>

      <p
        className={`mt-3 flex items-center justify-center gap-1.5 font-sans text-[11px] ${
          isDark ? "text-white/45" : "text-[#8C8375]"
        }`}
      >
        <Lock size={11} /> Secure Checkout · SSL Encrypted
      </p>

      <div className="mt-4 flex items-center justify-center">
        <PaymentBadges badgeClassName="h-6 w-auto shadow-sm transition-transform hover:scale-105" />
      </div>
    </div>
  );
}

/* ------------------------------------ Footer Mini ------------------------------------ */

function CheckoutFooter({ isDark = true }) {
  return (
    <footer
      className={`mt-16 border-t py-8 transition-colors ${
        isDark ? "border-white/10 bg-[#0A0A0A]" : "border-[#EAE6DF] bg-[#F7F4EE]"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-8">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl text-[#FFB400]">MAC</span>
          <span
            className={`font-sans text-[10px] tracking-[0.2em] ${
              isDark ? "text-white/50" : "text-[#8C8375]"
            }`}
          >
            MARVELAM
          </span>
        </div>
        <div
          className={`flex flex-wrap items-center justify-center gap-4 font-sans text-xs ${
            isDark ? "text-white/50" : "text-[#5A5247]"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#FFB400]" /> Secure Payment
          </span>
          <span className="flex items-center gap-1.5">
            <Truck size={13} className="text-[#FFB400]" /> Nationwide Delivery
          </span>
          <Link to="/" className="hover:text-[#FFB400] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/" className="hover:text-[#FFB400] transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link to="/" className="hover:text-[#FFB400] transition-colors">
            Contact Us
          </Link>
        </div>
        <div
          className={`flex items-center gap-4 ${
            isDark ? "text-white/40" : "text-[#8C8375]"
          }`}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-[#FFB400] transition-colors"
          >
            <InstagramIcon size={16} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-[#FFB400] transition-colors"
          >
            <FacebookIcon size={16} />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="hover:text-[#FFB400] transition-colors"
          >
            <TikTokIcon size={16} />
          </a>
        </div>
        <p
          className={`font-sans text-[11px] ${
            isDark ? "text-white/35" : "text-[#8C8375]"
          }`}
        >
          © 2026 Marvelam Apparel &amp; Clothing (MAC). All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

/* -------------------------------- Confirmation View ------------------------------ */

function ConfirmationView({ orderResult, onReturnToCatalog, isDark = true }) {
  return (
    <div
      className={`mx-auto max-w-2xl rounded-2xl border p-8 sm:p-10 text-center shadow-2xl transition-colors ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-sm"
      }`}
    >
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFB400] text-[#0F0F0F] shadow-lg shadow-[#FFB400]/30">
        <Check size={40} className="stroke-[3]" />
      </div>

      <span className="inline-block rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-4 py-1 font-sans text-xs font-semibold text-[#FFB400] mb-3">
        Order #{orderResult.orderId}
      </span>

      <h2
        className={`font-display text-3xl sm:text-4xl font-semibold ${
          isDark ? "text-[#F9FAFB]" : "text-[#141414]"
        }`}
      >
        Thank You for Your Order!
      </h2>

      <p
        className={`mx-auto mt-3 max-w-md font-sans text-sm ${
          isDark ? "text-white/70" : "text-[#5A5247]"
        }`}
      >
        We've received your order and sent a confirmation receipt to{" "}
        <strong className="text-[#FFB400]">{orderResult.email}</strong>. Our team is
        already preparing your luxury pieces.
      </p>

      {/* Order Summary Recap Card */}
      <div
        className={`mt-8 rounded-xl border p-6 text-left ${
          isDark
            ? "border-white/10 bg-[#1A1A1A]"
            : "border-[#E2DDCF] bg-[#FAF8F5]"
        }`}
      >
        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <span
              className={`font-sans uppercase tracking-wider ${
                isDark ? "text-white/40" : "text-[#8C8375]"
              }`}
            >
              Shipping To
            </span>
            <p className="mt-1 font-semibold text-sm">
              {orderResult.first_name} {orderResult.last_name}
            </p>
            <p className={isDark ? "text-white/70" : "text-[#5A5247]"}>
              {orderResult.delivery_address}, {orderResult.city},{" "}
              {orderResult.state}
            </p>
            <p className={isDark ? "text-white/70" : "text-[#5A5247]"}>
              {orderResult.phone_number}
            </p>
          </div>

          <div>
            <span
              className={`font-sans uppercase tracking-wider ${
                isDark ? "text-white/40" : "text-[#8C8375]"
              }`}
            >
              Delivery &amp; Payment
            </span>
            <p className="mt-1 font-semibold text-sm">
              {orderResult.deliveryMethodLabel}
            </p>
            <p className={isDark ? "text-white/70" : "text-[#5A5247]"}>
              Payment: {orderResult.paymentMethodLabel}
            </p>
            <p className="mt-2 font-display text-base font-bold text-[#FFB400]">
              Total Paid: {formatNaira(orderResult.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to={`/track/${orderResult.orderId}`}
          className="w-full sm:w-auto rounded-xl bg-[#FFB400] px-8 py-3.5 font-sans text-sm font-semibold text-[#0F0F0F] transition-all hover:scale-105 shadow-md shadow-[#FFB400]/20 flex items-center justify-center gap-2"
        >
          <Truck size={16} /> Track Order
        </Link>

        <button
          type="button"
          onClick={onReturnToCatalog}
          className={`w-full sm:w-auto rounded-xl border px-8 py-3.5 font-sans text-sm font-semibold transition-colors ${
            isDark
              ? "border-white/15 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
              : "border-[#E2DDCF] text-[#4A453E] hover:border-[#FFB400] hover:text-[#FFB400]"
          }`}
        >
          Continue Shopping
        </button>

        <Link
          to="/account/orders"
          className={`w-full sm:w-auto rounded-xl border px-8 py-3.5 font-sans text-sm font-semibold transition-colors ${
            isDark
              ? "border-white/15 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
              : "border-[#E2DDCF] text-[#4A453E] hover:border-[#FFB400] hover:text-[#FFB400]"
          }`}
        >
          Order History
        </Link>
      </div>
    </div>
  );
}

/* --------------------------------------- Page ---------------------------------------- */

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { cartItems, clearCart } = useCart();
  const isDark = theme === "dark";

  // Redirect unauthenticated visitors to login
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    }
  }, [navigate]);

  // Form Details
  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    alternative_phone_number: "",
    email: localStorage.getItem("mac_user_email") || "",
    delivery_address: "",
    city: "",
    state: "Lagos",
    country: "Nigeria",
    additional_info: "",
    address_type: "home",
    save_details: true,
  });

  const [deliveryMethodId, setDeliveryMethodId] = useState("standard");
  const [paymentMethodId, setPaymentMethodId] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // Map real cart items or fallback
  const displayItems = useMemo(() => {
    if (cartItems && cartItems.length > 0) {
      return cartItems.map((item) => ({
        uniqueId: item.uniqueId || item.id,
        name: item.name,
        color: item.color,
        size: item.size,
        length: item.length,
        qty: item.quantity || item.qty || 1,
        price:
          Number(item.discounted_price || item.price) +
          Number(item.price_adjustment || 0),
        image:
          item.image ||
          item.pry_image ||
          `https://picsum.photos/seed/${item.id || item.uniqueId}/100/125`,
      }));
    }
    return FALLBACK_CART_ITEMS.map((item) => ({
      ...item,
      uniqueId: item.seed,
      image: `https://picsum.photos/seed/${item.seed}/100/125`,
    }));
  }, [cartItems]);

  const subtotal = useMemo(
    () => displayItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [displayItems]
  );

  const deliveryFee =
    DELIVERY_METHODS.find((m) => m.id === deliveryMethodId)?.fee ?? 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const currentStep = orderResult ? 2 : 1; // 0: Cart, 1: Checkout, 2: Confirmation

  const handleApplyPromo = () => {
    const trimmed = promoCode.trim().toUpperCase();
    if (!trimmed) {
      setPromoMessage("Enter a promo code to apply.");
      return;
    }

    if (trimmed === "MARVELAMVIP10" || trimmed === "VIP10") {
      const discountVal = Math.round(subtotal * 0.1);
      setDiscount(discountVal);
      setPromoMessage(
        `Code "${trimmed}" applied — 10% discount (-${formatNaira(discountVal)})!`
      );
    } else if (trimmed === "FREE") {
      setDiscount(deliveryFee);
      setPromoMessage(`Code "${trimmed}" applied — Free delivery applied!`);
    } else {
      // Default flat ₦10,000 promotion
      const discountVal = Math.min(10000, subtotal);
      setDiscount(discountVal);
      setPromoMessage(
        `Code "${trimmed}" applied — you're saving ${formatNaira(discountVal)}!`
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!details.first_name.trim()) newErrors.first_name = true;
    if (!details.last_name.trim()) newErrors.last_name = true;
    if (!details.phone_number.trim()) newErrors.phone_number = true;
    if (!details.email.trim() || !details.email.includes("@"))
      newErrors.email = true;
    if (!details.delivery_address.trim()) newErrors.delivery_address = true;
    if (!details.city.trim()) newErrors.city = true;
    if (!details.state.trim()) newErrors.state = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const deliveryMethodObj = DELIVERY_METHODS.find(
        (m) => m.id === deliveryMethodId
      );
      const paymentMethodObj = PAYMENT_METHODS.find(
        (p) => p.id === paymentMethodId
      );

      const generatedId = `MAC-${Math.floor(10000 + Math.random() * 90000)}`;

      setOrderResult({
        orderId: generatedId,
        ...details,
        deliveryMethodLabel: deliveryMethodObj?.label || "Standard Delivery",
        paymentMethodLabel: paymentMethodObj?.label || "Pay with Card",
        items: displayItems,
        total,
      });

      setIsSubmitting(false);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FAF8F5] text-[#141414]"
      }`}
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`mb-5 flex items-center gap-2 font-sans text-xs ${
            isDark ? "text-white/50" : "text-[#5A5247]"
          }`}
        >
          <Link to="/" className="hover:text-[#FFB400] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/cart" className="hover:text-[#FFB400] transition-colors">
            Cart
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[#FFB400]">
            {currentStep === 2 ? "Confirmation" : "Checkout"}
          </span>
        </nav>

        {/* Stepper Header */}
        <div className="mb-8">
          <CheckoutSteps currentStep={currentStep} />
        </div>

        {orderResult ? (
          <ConfirmationView
            orderResult={orderResult}
            onReturnToCatalog={() => navigate("/catalog")}
            isDark={isDark}
          />
        ) : (
          <>
            <h1
              className={`text-center font-display text-3xl sm:text-left ${
                isDark ? "text-[#F9FAFB]" : "text-[#141414]"
              }`}
            >
              Checkout
            </h1>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              {/* Left Column: Delivery & Payment Details */}
              <div className="space-y-6">
                <DeliverySection
                  details={details}
                  onDetailsChange={setDetails}
                  method={deliveryMethodId}
                  onMethodChange={setDeliveryMethodId}
                  isDark={isDark}
                  errors={errors}
                />
                <PaymentSection
                  method={paymentMethodId}
                  onMethodChange={setPaymentMethodId}
                  isDark={isDark}
                />
              </div>

              {/* Right Column: Sticky Order Summary */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <OrderSummaryCard
                  items={displayItems}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  discount={discount}
                  total={total}
                  promoCode={promoCode}
                  onPromoChange={setPromoCode}
                  onApplyPromo={handleApplyPromo}
                  promoMessage={promoMessage}
                  onPlaceOrder={handlePlaceOrder}
                  isDark={isDark}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <CheckoutFooter isDark={isDark} />
    </div>
  );
}
