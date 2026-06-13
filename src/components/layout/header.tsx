"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronDown, GitCompare, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCompare } from "@/lib/hooks/use-compare";
import { useTheme } from "@/components/theme-provider";

const categories = [
  { name: "DJI", slug: "dji" },
  { name: "Professional Drone", slug: "professional-drone" },
  { name: "Beginner Drone", slug: "beginner-drone" },
  { name: "Drone Accessories", slug: "drone-accessories" },
  { name: "Camera", slug: "camera" },
];

export function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session, status } = useSession();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { items: compareItems } = useCompare();
  const { theme, setTheme } = useTheme();

  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      {/* Top bar */}
      <div className="hidden lg:flex h-9 items-center justify-between bg-gray-900 px-6 text-xs text-gray-300">
        <div className="flex items-center gap-4">
          <span>📞 +880 170 771 9909</span>
          <span>✉️ droneplace32@gmail.com</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/track-order" className="hover:text-white">Track Order</Link>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Hobby Mart Logo" width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold text-gray-900">Hobby <span className="text-blue-600">Mart</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Home</Link>
          <Link href="/products" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Shop</Link>
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Categories <ChevDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute top-full left-0 z-50 mt-1 w-56 rounded-xl border bg-white p-2 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/blog" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Blog</Link>
          <Link href="/contact" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Contact</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="mr-2 h-8 w-16 animate-pulse rounded-lg bg-gray-100"></div>
          ) : session?.user ? (
            <div className="flex items-center gap-2 mr-2">
              <Link href={(session.user as any).role === "ADMIN" || (session.user as any).role === "STAFF" ? "/admin/dashboard" : "/"} className="rounded-lg bg-blue-50 p-2 sm:px-3 sm:py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 flex items-center">
                <span className="hidden sm:inline">Dashboard</span>
                <User className="h-4 w-4 sm:hidden" />
              </Link>
              <button onClick={() => signOut()} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hidden sm:block">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center mr-2">
              <Link href="/login" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Login
              </Link>
            </div>
          )}
          
          <button onClick={() => setSearchOpen(!searchOpen)} className="rounded-lg p-2 hover:bg-gray-100">
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link href="/compare" className="relative rounded-lg p-2 hover:bg-gray-100 max-lg:hidden">
            <GitCompare className="h-5 w-5" />
            {compareItems.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px]">{compareItems.length}</Badge>
            )}
          </Link>
          <Link href="/wishlist" className="relative rounded-lg p-2 hover:bg-gray-100 max-lg:hidden">
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px]">{wishlistItems.length}</Badge>
            )}
          </Link>
          <Link href="/cart" className="relative rounded-lg p-2 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px]">{cartCount}</Badge>
            )}
          </Link>
          <button onClick={() => setMobileMenu(true)} className="rounded-lg p-2 hover:bg-gray-100 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t bg-white px-4 py-4">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setMobileMenu(false)} className="rounded-lg p-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">Home</Link>
              <Link href="/products" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">Shop</Link>
              <div className="px-3 py-2 text-sm font-medium text-gray-500">Categories</div>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="my-2 border-t" />
              <Link href="/wishlist" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">Wishlist</Link>
              <Link href="/compare" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-100">Compare</Link>
              {!session?.user ? (
                <Link href="/login" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50">Login</Link>
              ) : (
                <>
                  <Link href={(session.user as any).role === "ADMIN" || (session.user as any).role === "STAFF" ? "/admin/dashboard" : "/"} onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50">Dashboard</Link>
                  <button onClick={() => { signOut(); setMobileMenu(false); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">Logout</button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function ChevDown(props: any) {
  return <ChevronDown {...props} />;
}
