"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronDown, GitCompare, Moon, Sun, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/hooks/use-cart";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCompare } from "@/lib/hooks/use-compare";
import { useTheme } from "@/components/theme-provider";
import type { SiteSettings } from "@/lib/site-config";

type NavCategory = { id: string; name: string; slug: string };

export function Header({ settings, categories }: { settings: SiteSettings; categories: NavCategory[] }) {
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };
  const { data: session, status } = useSession();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { items: compareItems } = useCompare();
  const { theme, setTheme } = useTheme();

  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      {/* Top bar */}
      {settings.topbarEnabled && (
        <div className="hidden lg:flex h-9 items-center justify-between bg-gray-900 px-6 text-xs text-gray-300">
          <div className="flex items-center gap-4">
            {settings.topbarShowContact && settings.phone && (
              <TopbarPhone phone={settings.phone} whatsappNumber={settings.whatsappNumber} whatsappText={settings.whatsappText} />
            )}
            {settings.topbarShowContact && settings.email && (
              <a href={`mailto:${settings.email}`} className="hover:text-white">✉️ {settings.email}</a>
            )}
          </div>
          {settings.topbarText && <span className="truncate px-4 text-center text-gray-200">{settings.topbarText}</span>}
          <div className="flex items-center gap-4">
            {settings.topbarShowTrackOrder && <Link href="/track-order" className="hover:text-white">Track Order</Link>}
          </div>
        </div>
      )}

      {/* Main header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src={settings.logoUrl || "/logo.png"} alt={`${settings.companyName} Logo`} width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold text-gray-900">{settings.companyName}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {settings.navLinks.map((link, i) => (
            <Fragment key={`${link.href}-${i}`}>
              <NavItem href={link.href} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                {link.label}
              </NavItem>
              {link.href === "/products" && <CategoriesDropdown categories={categories} />}
            </Fragment>
          ))}
          {/* Fallback: if no "Shop" (/products) link, still show the Categories menu */}
          {!settings.navLinks.some((l) => l.href === "/products") && <CategoriesDropdown categories={categories} />}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="mr-2 h-8 w-16 animate-pulse rounded-lg bg-gray-100"></div>
          ) : session?.user ? (
            <div className="flex items-center gap-2 mr-2">
              {(session.user as any).role === "ADMIN" || (session.user as any).role === "STAFF" ? (
                <Link href="/admin/dashboard" className="rounded-lg bg-blue-50 p-2 sm:px-3 sm:py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 flex items-center">
                  <span className="hidden sm:inline">Dashboard</span>
                  <User className="h-4 w-4 sm:hidden" />
                </Link>
              ) : (
                <Link href="/orders" className="rounded-lg bg-blue-50 p-2 sm:px-3 sm:py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 flex items-center">
                  <span className="hidden sm:inline">My Orders</span>
                  <User className="h-4 w-4 sm:hidden" />
                </Link>
              )}
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
          <form className="mx-auto max-w-2xl" onSubmit={submitSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products... (press Enter)"
                className="w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      </header>

      {/* Mobile menu — OUTSIDE <header> so the header's backdrop-blur doesn't
          become the containing block for this fixed overlay. */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          mobileMenu ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileMenu}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenu(false)}
        />
        {/* Sliding panel (solid background so page content can't show through) */}
        <div
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b px-5 py-4">
            <span className="text-base font-bold text-gray-900">Menu</span>
            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
            {settings.navLinks.map((link, i) => (
              <NavItem
                key={`${link.href}-${i}`}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                {link.label}
              </NavItem>
            ))}
            <div className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Categories</div>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenu(false)}
                className="rounded-lg px-5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {cat.name}
              </Link>
            ))}
            <div className="my-2 border-t" />
            <Link href="/wishlist" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">Wishlist</Link>
            <Link href="/compare" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">Compare</Link>
            <div className="my-2 border-t" />
            {!session?.user ? (
              <Link href="/login" onClick={() => setMobileMenu(false)} className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700">Login</Link>
            ) : (
              <>
                {(session.user as any).role === "ADMIN" || (session.user as any).role === "STAFF" ? (
                  <Link href="/admin/dashboard" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">Dashboard</Link>
                ) : (
                  <Link href="/orders" onClick={() => setMobileMenu(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">My Orders</Link>
                )}
                <button onClick={() => { signOut(); setMobileMenu(false); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">Logout</button>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

function ChevDown(props: any) {
  return <ChevronDown {...props} />;
}

// Top-bar phone: click to choose calling directly (tel:) or messaging on
// WhatsApp (wa.me). WhatsApp uses the configured WhatsApp number/text, falling
// back to the phone number's digits when no WhatsApp number is set.
function TopbarPhone({ phone, whatsappNumber, whatsappText }: { phone: string; whatsappNumber: string; whatsappText: string }) {
  const [open, setOpen] = useState(false);
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const waDigits = (whatsappNumber || phone).replace(/\D/g, "");
  const waHref = `https://wa.me/${waDigits}${whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ""}`;

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 hover:text-white" aria-haspopup="menu" aria-expanded={open}>
        📞 {phone} <ChevDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          {/* click-away layer */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border bg-white py-1 text-gray-700 shadow-lg" role="menu">
            <a href={telHref} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100" role="menuitem">
              <Phone className="h-3.5 w-3.5 text-blue-600" /> Call via phone
            </a>
            {waDigits && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100" role="menuitem">
                <MessageCircle className="h-3.5 w-3.5 text-green-600" /> Chat on WhatsApp
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Renders an internal Next <Link> or an external <a> (new tab) depending on href.
function NavItem({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const isExternal = /^https?:\/\//i.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

// The DB-driven Categories mega-dropdown shown in the desktop header.
function CategoriesDropdown({ categories }: { categories: NavCategory[] }) {
  if (categories.length === 0) return null;
  return (
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
  );
}
