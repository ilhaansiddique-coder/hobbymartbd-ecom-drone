import { cache } from "react";
import { prisma } from "./prisma";

export type NavCategory = { id: string; name: string; slug: string };

// Categories for nav/menus, read fresh from the DB so newly-added categories
// appear everywhere immediately. `cache` dedupes the query within a request.
export const getNavCategories = cache(async (): Promise<NavCategory[]> => {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
  } catch {
    return [];
  }
});
