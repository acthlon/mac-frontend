import { ShieldCheck, Truck, RotateCcw, Headset } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    copy: "Finest fabrics & exceptional finish",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    copy: "Fast, reliable & live tracking",
    link: "/track",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    copy: "100% secure & trusted checkout",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    copy: "Hassle-free returns within 7 days",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    copy: "We are here to help you always",
  },
];

export default function FeaturesBar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`mt-14 border-y py-8 transition-colors duration-300 ${
        isDark ? "border-white/10" : "border-neutral-200"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 sm:px-8 lg:grid-cols-5">
        {FEATURES.map(({ icon: Icon, title, copy, link }, index) => {
          const itemContent = (
            <div
              className={`flex flex-col items-center gap-2 text-center transition-all ${
                link ? "group cursor-pointer hover:scale-105" : ""
              }`}
            >
              <Icon size={22} className="text-[#FFB400] transition-transform group-hover:scale-110" />
              <p
                className={`font-sans text-xs font-semibold ${
                  isDark ? "text-white" : "text-neutral-800"
                } ${link ? "group-hover:text-[#FFB400]" : ""}`}
              >
                {title}
              </p>
              <p
                className={`font-sans text-[11px] ${
                  isDark ? "text-white/50" : "text-neutral-500"
                }`}
              >
                {link ? "Track Package Live &rarr;" : copy}
              </p>
            </div>
          );

          return link ? (
            <Link key={`${title}-${index}`} to={link} className="block">
              {itemContent}
            </Link>
          ) : (
            <div key={`${title}-${index}`}>{itemContent}</div>
          );
        })}
      </div>
    </section>
  );
}
