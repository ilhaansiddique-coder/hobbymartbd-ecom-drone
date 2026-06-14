import { type SiteSettings, FONT_STACKS, darken } from "@/lib/site-config";

// Injects a <style> tag that applies the configured brand color and font
// site-wide by overriding the brand "blue" utilities and the body font.
// Unlayered + !important so it wins over Tailwind utilities and dark-mode rules.
export function BrandStyle({ settings }: { settings: SiteSettings }) {
  const brand = settings.primaryColor?.trim() || "#2563eb";
  const brandDark = darken(brand, 0.85);
  const font = FONT_STACKS[settings.fontFamily] || FONT_STACKS.sans;

  const css = `
    :root { --brand: ${brand}; --brand-dark: ${brandDark}; }
    body { font-family: ${font}; }
    .bg-blue-600 { background-color: var(--brand) !important; }
    .hover\\:bg-blue-700:hover { background-color: var(--brand-dark) !important; }
    .text-blue-600 { color: var(--brand) !important; }
    .text-blue-400 { color: var(--brand) !important; }
    .hover\\:text-blue-700:hover { color: var(--brand-dark) !important; }
    .border-blue-500 { border-color: var(--brand) !important; }
    .border-blue-600 { border-color: var(--brand) !important; }
    .focus\\:border-blue-500:focus { border-color: var(--brand) !important; }
    .focus\\:ring-blue-500:focus { --tw-ring-color: var(--brand) !important; }
    .ring-blue-500 { --tw-ring-color: var(--brand) !important; }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
