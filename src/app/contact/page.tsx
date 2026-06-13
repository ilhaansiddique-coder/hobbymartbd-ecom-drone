import { ContactForm } from "./contact-form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us - Hobby Mart",
  description: "Get in touch with Hobby Mart. Visit our Dhanmondi store, call us, or send us an email.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            We&apos;d love to hear from you. Reach out with any questions or concerns.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex gap-4 rounded-2xl border bg-white p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Our Address</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Shop-3057, Level-4, Shimanto Shambhar<br />
                    Dhanmondi-2, Dhaka
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border bg-white p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <a href="tel:+8801707719909" className="mt-1 block text-sm text-blue-600 hover:text-blue-700">
                    +880 170 771 9909
                  </a>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border bg-white p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href="mailto:droneplace32@gmail.com" className="mt-1 block text-sm text-blue-600 hover:text-blue-700">
                    droneplace32@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border bg-white p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Saturday - Thursday: 10:00 AM - 8:00 PM<br />
                    Friday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
