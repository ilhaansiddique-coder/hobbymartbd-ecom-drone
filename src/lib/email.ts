// Email notification utility
// In production, replace with actual email service (SendGrid, Resend, etc.)

export type EmailData = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(data: EmailData) {
  // For now, log to console
  console.log("=== EMAIL NOTIFICATION ===");
  console.log("To:", data.to);
  console.log("Subject:", data.subject);
  console.log("Body:", data.html);
  console.log("=== END EMAIL ===");
  
  // In production, integrate with an email provider:
  // const res = await fetch("https://api.sendgrid.com/v3/mail/send", { ... });
  // const res = await resend.emails.send({ ... });
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
