import { cache } from "react";
import { prisma } from "./prisma";
import type { SiteSettings } from "./site-config";

export type { SiteSettings } from "./site-config";

const DEFAULTS: SiteSettings = {
  id: "singleton",
  companyName: "HobbyMart",
  logoUrl: null,
  email: "",
  phone: "",
  address: "",
  whatsappNumber: "",
  whatsappText: "Hello! I have a question about your products.",
  primaryColor: "#2563eb",
  fontFamily: "sans",
  footerTagline: "",
  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
};

// Loads the single site-settings row (creating it with defaults on first run).
// `cache` dedupes the query within a single request (header + footer + layout).
// Falls back to defaults if the DB is briefly unreachable so it never breaks a render.
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" },
      });
    }
    return settings;
  } catch {
    return DEFAULTS;
  }
});
