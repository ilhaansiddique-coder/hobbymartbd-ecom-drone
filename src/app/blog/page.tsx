import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog - Hobby Mart",
  description: "Read the latest news, guides, and reviews about drones and hobbies.",
};

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Drones for Beginners in 2026",
    excerpt: "Starting your drone journey? We've compiled the ultimate list of the best beginner-friendly drones that balance features, durability, and price.",
    category: "Guides",
    date: "May 20, 2026",
    author: "Alex Morgan",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "How to Maintain Your Drone Batteries",
    excerpt: "Maximize the lifespan and performance of your LiPo batteries with these essential storage and charging tips.",
    category: "Maintenance",
    date: "May 15, 2026",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "DJI Mavic 3 Pro: In-Depth Review",
    excerpt: "Is the triple-camera setup worth the upgrade? We take the DJI Mavic 3 Pro for a spin to test its cinematic capabilities.",
    category: "Reviews",
    date: "May 10, 2026",
    author: "David Ross",
    image: "https://images.unsplash.com/photo-1579820010410-c10411aaaa88?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Understanding Drone Regulations",
    excerpt: "Before you fly, make sure you know the local laws. A comprehensive guide to registration and no-fly zones.",
    category: "News",
    date: "May 5, 2026",
    author: "Emily White",
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "FPV Racing: How to Get Started",
    excerpt: "Experience the thrill of First-Person View drone racing. Here's exactly what gear you need to build your first quadcopter.",
    category: "Guides",
    date: "April 28, 2026",
    author: "Marcus Vance",
    image: "https://images.unsplash.com/photo-1581458852373-3c9902bd21e5?q=80&w=800&auto=format&fit=crop",
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
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
        {/* Featured Post */}
        <div className="mb-16">
          <Link href={`/blog/${featuredPost.id}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md border border-gray-100">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="mb-6 text-lg text-gray-500 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {featuredPost.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {featuredPost.date}</span>
                  </div>
                  <span className="flex items-center gap-1 font-semibold text-blue-600">
                    Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Regular Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md border border-gray-100">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center text-xs font-semibold text-blue-600">
                    {post.category}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-6 text-gray-500 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
