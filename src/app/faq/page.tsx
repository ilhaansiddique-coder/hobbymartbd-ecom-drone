export const metadata = {
  title: "FAQ - Hobby Mart",
  description: "Frequently asked questions about ordering, shipping, returns, and products at Hobby Mart.",
};

const faqs = [
  {
    category: "Ordering",
    items: [
      { q: "How do I place an order?", a: "Browse our catalog, add items to your cart, and proceed to checkout. You will need to provide your shipping details and choose a payment method. Once confirmed, you will receive an order confirmation email." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or canceled within 1 hour of placement. Please contact us immediately at droneplace32@gmail.com with your order number. After that window, the order may already be in processing." },
      { q: "Do you offer wholesale pricing?", a: "Yes, we offer wholesale pricing for bulk orders. Please contact us with your requirements and we will provide a customized quote." },
    ],
  },
  {
    category: "Shipping",
    items: [
      { q: "What shipping methods do you offer?", a: "We offer standard and express shipping within Bangladesh. Delivery times range from 1-3 business days for major cities and 3-5 business days for other areas." },
      { q: "Do you ship internationally?", a: "Currently, we only ship within Bangladesh. We are working on expanding our shipping capabilities to neighboring countries." },
      { q: "How can I track my order?", a: "Once your order is shipped, you will receive a tracking number via email. You can also track your order on our Track Order page using your order ID and email address." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We offer a 7-day return policy for unused items in original packaging. Please visit our Return & Refund Policy page for full details." },
      { q: "How long do refunds take?", a: "Once we receive and inspect your return, refunds are processed within 5-7 business days and credited to your original payment method." },
      { q: "What if I receive a defective product?", a: "Contact us immediately with your order number and photos of the defect. We will arrange a replacement or full refund, including return shipping costs." },
    ],
  },
  {
    category: "Products",
    items: [
      { q: "Are your drones genuine?", a: "Yes, all our drones are 100% authentic and sourced directly from authorized distributors. We are an official partner of DJI and other major brands." },
      { q: "Do you offer warranty on products?", a: "All products come with the manufacturer's warranty. DJI products include a standard 1-year warranty. Extended warranty options are available at checkout." },
      { q: "Can I test a drone before buying?", a: "Absolutely! Visit our Dhanmondi store to see our products in person. Our staff will be happy to demonstrate and help you choose the right drone." },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Find answers to common questions about our products and services.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-12 lg:px-8 space-y-10">
        {faqs.map((group) => (
          <section key={group.category}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{group.category}</h2>
            <div className="space-y-3">
              {group.items.map((item, i) => (
                <details key={i} className="group rounded-2xl border bg-white overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <svg
                      className="ml-2 h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="border-t px-6 py-4 text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
