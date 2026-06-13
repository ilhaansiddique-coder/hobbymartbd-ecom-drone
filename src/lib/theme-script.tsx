"use client";

import Script from "next/script";

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem("theme");
      if (!theme) {
        theme = "light";
        localStorage.setItem("theme", theme);
      }
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    } catch (e) {}
  })();
`;

export function ThemeScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
