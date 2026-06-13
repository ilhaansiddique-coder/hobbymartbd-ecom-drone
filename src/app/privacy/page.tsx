export const metadata = {
  title: "Privacy Policy - Hobby Mart",
  description: "Learn how Hobby Mart collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            How we collect, use, and safeguard your information.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-12 lg:px-8">
        <div className="rounded-2xl border bg-white p-8 sm:p-12 space-y-8 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you place an order or contact us. We also automatically collect certain information when you visit our site, including your IP address, browser type, device information, and browsing behavior.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to process orders, communicate with you about your purchases, provide customer support, improve our website and services, and send marketing communications with your consent. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information, including SSL encryption for data transmission and secure storage practices. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings. Disabling cookies may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
            <p>
              We may share your information with trusted third parties who assist us in operating our website, processing payments, delivering orders, and analyzing data. These partners are contractually obligated to keep your information confidential and use it only for the services they provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. You may opt out of marketing communications by clicking the unsubscribe link in any email or by contacting us directly. We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:droneplace32@gmail.com" className="text-blue-600 hover:text-blue-700">droneplace32@gmail.com</a>{" "}
              or visit our contact page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Updates</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
