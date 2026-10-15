import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function FilterGroup({ title, children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`border-b py-5 first:pt-0 last:border-none ${
        isDark ? "border-white/10" : "border-neutral-200"
      }`}
    >
      <h4
        className={`font-sans text-xs font-semibold uppercase tracking-wide ${
          isDark ? "text-white/60" : "text-neutral-500"
        }`}
      >
        {title}
      </h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}
