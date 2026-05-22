import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const sort = params.sort || "newest";
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: any = { published: true };

  if (category) {
    where.categories = { some: { category: { slug: category } } };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "name" ? { name: "asc" } :
    { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        categories: { include: { category: { select: { name: true, slug: true } } } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const mapped = products.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    categories: p.categories.map((c) => c.category),
    rating: p.reviews.length
      ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length
      : null,
    reviewCount: p.reviews.length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {category ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "All Products"}
        </h1>
        <p className="mt-1 text-gray-500">{total} products found</p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <aside className="hidden lg:block">
          <ProductFilters categories={categories} currentCategory={category} />
        </aside>
        <div className="lg:col-span-3">
          <ProductGrid products={mapped} />
          {total > limit && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
                <a
                  key={i}
                  href={`/products?page=${i + 1}${category ? `&category=${category}` : ""}`}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "border bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
