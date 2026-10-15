import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import PaymentBadges from "../common/PaymentBadges";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      "Ready-Made Collection",
      "Fabrics",
      "New Arrivals",
      "Best Sellers",
      "Sale",
      "Accessories",
    ],
  },
  {
    title: "Customer Care",
    links: [
      "Track Order",
      "Shipping & Delivery",
      "Returns & Exchanges",
      "Size Guide",
      "FAQ",
      "Contact Us",
    ],
  },
  {
    title: "Information",
    links: ["About Us", "Our Stores", "Privacy Policy", "Terms & Conditions"],
  },
];

function InstagramIcon({ size = 18, className = "" }) {
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

function FacebookIcon({ size = 18, className = "" }) {
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

function TikTokIcon({ size = 18, className = "" }) {
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

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`mt-4 pb-8 pt-12 transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#F0ECE1] text-[#1A1A1A]"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <span className="block font-display text-2xl text-[#FFB400]">
            MAC
          </span>
          <span
            className={`block font-sans text-[10px] tracking-[0.2em] ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            MARVELAM
          </span>
          <p
            className={`mt-4 max-w-xs font-sans text-xs leading-relaxed ${
              isDark ? "text-white/50" : "text-neutral-600"
            }`}
          >
            Luxury ready-made dresses and premium fabrics for the modern, modest
            and confident woman.
          </p>
          <div
            className={`mt-5 flex items-center gap-4 ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            <a href="#" aria-label="Instagram" className="hover:text-[#FFB400]">
              <InstagramIcon size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-[#FFB400]">
              <FacebookIcon size={18} />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-[#FFB400]">
              <TikTokIcon size={18} />
            </a>
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h5 className="font-sans text-xs font-semibold uppercase tracking-wide text-[#FFB400]">
              {col.title}
            </h5>
            <ul
              className={`mt-4 space-y-2.5 font-sans text-xs ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              {col.links.map((link) => {
                let targetPath = null;
                if (link === "Track Order") targetPath = "/track";
                else if (link === "Ready-Made Collection" || link === "New Arrivals" || link === "Best Sellers" || link === "Sale") targetPath = "/products";
                else if (link === "Fabrics") targetPath = "/fabrics";
                else if (link === "About Us") targetPath = "/about";

                return (
                  <li key={link}>
                    {targetPath ? (
                      <Link to={targetPath} className="hover:text-[#FFB400] transition-colors">
                        {link}
                      </Link>
                    ) : (
                      <a href="#" className="hover:text-[#FFB400] transition-colors">
                        {link}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div>
          <h5 className="font-sans text-xs font-semibold uppercase tracking-wide text-[#FFB400]">
            Newsletter
          </h5>
          <p
            className={`mt-4 font-sans text-xs ${
              isDark ? "text-white/50" : "text-neutral-600"
            }`}
          >
            Subscribe to get updates on new arrivals, exclusive offers and more.
          </p>
          <form className="mt-3 flex" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              className={`w-full rounded-l-md border px-3 py-2.5 font-sans text-xs focus:border-[#FFB400] focus:outline-none ${
                isDark
                  ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
                  : "border-neutral-300 bg-white text-[#1A1A1A] placeholder:text-neutral-400"
              }`}
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex items-center justify-center rounded-r-md bg-[#FFB400] px-3 text-[#0F0F0F] transition-colors duration-200 hover:bg-[#FFB400]/90"
            >
              <ChevronRight size={16} />
            </button>
          </form>
          <p
            className={`mt-2 font-sans text-[10px] ${
              isDark ? "text-white/35" : "text-neutral-500"
            }`}
          >
            We respect your privacy.
          </p>
        </div>
      </div>

      <div
        className={`mx-auto mt-10 flex max-w-7xl flex-col-reverse items-center gap-4 border-t px-4 pt-6 sm:flex-row sm:justify-between sm:px-8 ${
          isDark ? "border-white/10" : "border-neutral-300"
        }`}
      >
        <p
          className={`font-sans text-[11px] ${
            isDark ? "text-white/40" : "text-neutral-500"
          }`}
        >
          © 2026 Marvelam Apparel &amp; Clothing (MAC). All Rights Reserved.
        </p>
        <div className="flex items-center gap-2">
          <PaymentBadges badgeClassName="h-5 w-auto" />
        </div>
      </div>
    </footer>
  );
}
