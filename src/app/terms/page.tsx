export const metadata = {
  title: "Terms & Conditions - Hobby Mart",
  description: "Read the terms and conditions governing your use of Hobby Mart's website and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Terms & <span className="text-blue-600">Conditions</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-12 lg:px-8">
        <div className="rounded-2xl border bg-white p-8 sm:p-12 space-y-8 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to Hobby Mart. These Terms & Conditions govern your use of our website and the purchase of products from us. By accessing or using our site, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. General Conditions</h2>
            <p>
              We reserve the right to refuse service to anyone for any reason at any time. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the service without express written permission from us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Products & Pricing</h2>
            <p>
              All product descriptions, images, and pricing are subject to change without notice. We strive to display accurate colors and details but cannot guarantee that your monitor&apos;s display of any color will be accurate. We reserve the right to discontinue any product at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Orders & Payment</h2>
            <p>
              By placing an order, you agree to provide current, complete, and accurate purchase and account information. We reserve the right to refuse or cancel any order for reasons including but not limited to product availability, pricing errors, or suspected fraud. Payment must be received before order processing begins.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Shipping & Delivery</h2>
            <p>
              Shipping times are estimates and not guaranteed. We are not liable for delays caused by carriers, customs, or force majeure. Risk of loss passes to you upon delivery. You are responsible for providing accurate shipping information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p>
              Hobby Mart shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our site or products. Our total liability is limited to the amount you paid for the product giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, Bangladesh.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of the site after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
