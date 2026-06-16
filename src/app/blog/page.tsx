import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: cached, refreshed every 60s

export const metadata = {
  title: "Blog - Hobby Mart",
  description: "Read the latest news, guides, and reviews about drones and hobbies.",
};

export default async function BlogPage() {
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            The Hobby Mart <span className="text-blue-600">Blog</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Expert insights, reviews, and guides to help you elevate your drone experience.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
        {featuredPost && (
          <div className="mb-16">
            <Link href={`/blog/${featuredPost.id}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md border border-gray-100">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  {featuredPost.image && (
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="mb-6 text-lg text-gray-500 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {featuredPost.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {featuredPost.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md border border-gray-100">
              <div className="relative aspect-video overflow-hidden">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-6 text-gray-500 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
