import Link from "next/link";

const categoryIcons: Record<string, string> = {
  dji: "🚁",
  "professional-drone": "🎯",
  "beginner-drone": "✈️",
  "drone-accessories": "🔧",
  camera: "📷",
  fimi: "🛸",
  potensic: "🪁",
  sony: "📸",
};

const colors = [
  { bg: "#2563eb", light: "#3b82f6" },
  { bg: "#059669", light: "#10b981" },
  { bg: "#ea580c", light: "#f97316" },
  { bg: "#7c3aed", light: "#a855f7" },
  { bg: "#e11d48", light: "#f43f5e" },
  { bg: "#0891b2", light: "#06b6d4" },
  { bg: "#d97706", light: "#f59e0b" },
  { bg: "#0d9488", light: "#14b8a6" },
];

interface CategoryGridProps {
  categories: {
    name: string;
    slug: string;
    image: string | null;
    _count: { products: number };
  }[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
        <p className="mt-2 text-gray-500">Find exactly what you need</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((cat, i) => {
          const c = colors[i % colors.length];
          return (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex w-[180px] flex-col items-center rounded-xl p-6 text-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${c.bg}, ${c.light})`,
              }}
            >
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-inner"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                {categoryIcons[cat.slug] || "📦"}
              </div>
              <h3 className="text-center text-base font-semibold">{cat.name}</h3>
              <p className="mt-1 text-center text-sm text-white/75">{cat._count.products} Products</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
