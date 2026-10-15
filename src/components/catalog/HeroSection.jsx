import React from "react";
import { ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function PageHero({ 
  title = "Ready-Made Collection", 
  description = "Timeless designs, ready for you. Discover our premium collection of ready-made dresses crafted for elegance, comfort and confidence.",
  breadcrumb = "Ready-Made Collection"
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
      <nav
        aria-label="Breadcrumb"
        className={`mb-5 font-sans text-xs ${
          isDark ? "text-white/50" : "text-neutral-500"
        }`}
      >
        <ol className="flex items-center gap-2">
          <li>
            <a href="#" className="hover:text-[#FFB400]">
              Home
            </a>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} />
          </li>
          <li className="text-[#FFB400]">{breadcrumb}</li>
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h1
            className={`font-display text-4xl sm:text-5xl ${
              isDark ? "text-[#F9FAFB]" : "text-[#1A1A1A]"
            }`}
          >
            {title}
          </h1>
          <p
            className={`mt-3 max-w-md font-sans text-sm leading-relaxed ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
