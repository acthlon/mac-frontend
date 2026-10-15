import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("mac_theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("mac_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={
          theme === "dark"
            ? "min-h-screen bg-[#0F0F0F] text-white antialiased transition-colors duration-300 selection:bg-[#FFB400] selection:text-[#0F0F0F]"
            : "min-h-screen bg-[#FBF9F5] text-[#141414] antialiased transition-colors duration-300 selection:bg-[#FFB400] selection:text-[#0F0F0F]"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: "dark", toggleTheme: () => {} };
  }
  return context;
}
