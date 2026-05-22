import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Hobby Mart Logo" width={40} height={40} className="object-contain" />
              <span className="text-lg font-bold text-white">Hobby<span className="text-blue-400">Mart</span></span>
            </div>
            <p className="text-sm text-gray-400">
              Bangladesh&apos;s premier drone shop. We offer DJI drones, professional drones, and accessories at the best prices.
            </p>
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
              <p className="text-gray-400">
                <span className="text-white font-medium">Dhanmondi Branch:</span><br />
                Shop-3057, Level-4, Shimanto Shambhar, Dhanmondi-2, Dhaka
              </p>
              <p>📞 <a href="tel:+8801707719909" className="hover:text-white">+880 170 771 9909</a></p>
              <p>✉️ <a href="mailto:droneplace32@gmail.com" className="hover:text-white">droneplace32@gmail.com</a></p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HobbyMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
