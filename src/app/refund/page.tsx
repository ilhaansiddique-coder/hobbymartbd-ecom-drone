export const metadata = {
  title: "Return & Refund Policy - Hobby Mart",
  description: "Learn about Hobby Mart's return and refund policy for drones and accessories.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Return & <span className="text-blue-600">Refund Policy</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Our commitment to your satisfaction and hassle-free returns.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-12 lg:px-8">
        <div className="rounded-2xl border bg-white p-8 sm:p-12 space-y-8 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Return Window</h2>
            <p>
              You have 7 calendar days from the date of delivery to initiate a return. To be eligible, items must be unused, in their original packaging, and in the same condition as received. Please contact us before returning any item.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Non-Returnable Items</h2>
            <p>
              The following items cannot be returned or exchanged: opened drone batteries, software or digital products, clearance or sale items, and products damaged due to improper use or modification. Custom or special-order items are also non-returnable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Refund Process</h2>
            <p>
              Once we receive and inspect your return, we will notify you of the refund status. Approved refunds will be processed within 5-7 business days and credited to your original payment method. Shipping costs are non-refundable unless the return is due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Defective or Wrong Items</h2>
            <p>
              If you receive a defective product or an incorrect item, please contact us immediately. We will arrange a replacement or full refund, including return shipping costs. Please include your order number and photos of the issue when reporting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Exchanges</h2>
            <p>
              We only replace items if they are defective or damaged. If you need to exchange a product for a different model, please initiate a return and place a new order. The fastest way to get what you want is to return the original item and make a separate purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. How to Initiate a Return</h2>
            <p>
              To start a return, email us at{" "}
              <a href="mailto:droneplace32@gmail.com" className="text-blue-600 hover:text-blue-700">droneplace32@gmail.com</a>{" "}
              with your order number and reason for return. Our team will provide a return authorization and shipping instructions. Customers are responsible for return shipping costs unless the return is due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Late or Missing Refunds</h2>
            <p>
              If you haven&apos;t received a refund within the stated timeframe, first check your bank account or credit card statement. Contact your financial institution as processing times vary. If the issue persists, please contact us for assistance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
