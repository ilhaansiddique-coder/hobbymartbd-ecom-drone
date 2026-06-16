import { prisma } from "@/lib/prisma";
import { HomeHero } from "@/components/home/home-hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductGrid } from "@/components/product/product-grid";
import { HomeReviews } from "@/components/home/home-reviews";

export const revalidate = 60; // ISR: cached, refreshed every 60s

export default async function HomePage() {
  const [categories, featuredProducts, newProducts, recentReviews] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        categories: { include: { category: { select: { name: true, slug: true } } } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        categories: { include: { category: { select: { name: true, slug: true } } } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.review.findMany({
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const mapProducts = (products: any[]) =>
    products.map((p) => ({
      ...p,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      categories: p.categories.map((c: any) => c.category),
      rating: p.reviews.length
        ? p.reviews.reduce((a: number, r: any) => a + r.rating, 0) / p.reviews.length
        : null,
      reviewCount: p.reviews.length,
    }));

  return (
    <div>
      <HomeHero />
      <CategoryGrid categories={categories} />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-1 text-gray-500">Top picks from our collection</p>
          </div>
          <a href="/products?featured=true" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All &rarr;
          </a>
        </div>
        <ProductGrid products={mapProducts(featuredProducts)} />
      </section>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="mt-1 text-gray-500">Latest drones and accessories</p>
            </div>
            <a href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All &rarr;
            </a>
          </div>
          <ProductGrid products={mapProducts(newProducts)} />
        </div>
      </section>
      <HomeReviews reviews={recentReviews} />
    </div>
  );
}
