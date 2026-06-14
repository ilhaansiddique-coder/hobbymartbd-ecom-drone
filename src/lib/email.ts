// Email utility — sends via Resend when RESEND_API_KEY is set, otherwise logs
// to the console (so dev/preview works without an email account).
// Setup: create a free account at resend.com, add RESEND_API_KEY and EMAIL_FROM
// (e.g. "HobbyMart <orders@yourdomain.com>") to your env vars.

export type EmailData = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(data: EmailData): Promise<void> {
  if (!data.to) return;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "HobbyMart <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("=== EMAIL (no RESEND_API_KEY, not sent) ===");
    console.log("To:", data.to, "| Subject:", data.subject);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: data.to, subject: data.subject, html: data.html }),
    });
    if (!res.ok) {
      console.error("Resend email failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Email send error:", err);
  }
}

export function orderConfirmationEmail(userEmail: string, orderId: string, items: { name: string; quantity: number; price: number }[], total: number) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">BDT ${item.price.toLocaleString()}</td>
    </tr>
  `).join("");

  return {
    to: userEmail,
    subject: `Order Confirmed - #${orderId.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Order Confirmed!</h2>
        <p>Thank you for your order at <strong>HobbyMart</strong>.</p>
        <p><strong>Order ID:</strong> #${orderId.slice(0, 8)}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">BDT ${total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <p>We'll notify you when your order status changes.</p>
        <p>Best regards,<br/>HobbyMart Team</p>
      </div>
    `,
  };
}

export function orderStatusEmail(userEmail: string, orderId: string, status: string) {
  return {
    to: userEmail,
    subject: `Order Update - #${orderId.slice(0, 8)} is now ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Order Status Updated</h2>
        <p>Your order <strong>#${orderId.slice(0, 8)}</strong> has been updated.</p>
        <p><strong>New Status:</strong> ${status}</p>
        <p>You can track your order on our website.</p>
        <p>Best regards,<br/>HobbyMart Team</p>
      </div>
    `,
  };
}
