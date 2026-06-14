import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/settings";

const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z" /></svg>
);
const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.93 3.9 2.39 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg>
);
const YoutubeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23.5 6.2a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 002.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" /></svg>
);

export function Footer({ settings }: { settings: SiteSettings }) {
  const name = settings.companyName || "HobbyMart";
  const socials = [
    { url: settings.facebookUrl, Icon: FacebookIcon, label: "Facebook" },
    { url: settings.instagramUrl, Icon: InstagramIcon, label: "Instagram" },
    { url: settings.youtubeUrl, Icon: YoutubeIcon, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src={settings.logoUrl || "/logo.png"} alt={`${name} Logo`} width={40} height={40} className="object-contain" />
              <span className="text-lg font-bold text-white">{name}</span>
            </div>
            <p className="text-sm text-gray-400">
              {settings.footerTagline ||
                "Bangladesh's premier drone shop. We offer DJI drones, professional drones, and accessories at the best prices."}
            </p>
            {socials.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socials.map(({ url, Icon, label }) => (
                  <a key={label} href={url!} target="_blank" rel="noopener noreferrer" aria-label={label}
                     className="rounded-full bg-gray-800 p-2 text-gray-300 transition-colors hover:bg-blue-600 hover:text-white">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Return &amp; Refund Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">My Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Find Us</h3>
            <div className="space-y-3 text-sm">
              {settings.address && <p className="text-gray-400">{settings.address}</p>}
              {settings.phone && (
                <p>📞 <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">{settings.phone}</a></p>
              )}
              {settings.email && (
                <p>✉️ <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
