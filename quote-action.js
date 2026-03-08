const RESEND_API_KEY = 're_gTcmRhd1_8WTQvU6tcWkQYzcQfwnPRdg1';
const ADMIN_EMAIL = 'spzone.online@gmail.com';

async function sendNotification(to, subject, html) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'SP Zone <info@spzones.com>', to, subject, html })
  });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const { orderId, action, customerName, customerEmail, total } = Object.fromEntries(url.searchParams);

  const ref = 'ORD-' + String(orderId).padStart(6, '0');
  const isAccept = action === 'accept';

  const adminHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:30px 0;">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
  <tr><td style="background:#1B3A6B;padding:24px 32px;">
    <div style="color:#F5B800;font-size:24px;font-weight:900;letter-spacing:2px;">SP ZONE</div>
    <div style="color:rgba(255,255,255,0.6);font-size:11px;margin-top:3px;">Wholesale Auto Parts</div>
  </td></tr>
  <tr><td style="padding:32px;">
    <div style="background:${isAccept?'#f0fdf4':'#fff8f0'};border-left:4px solid ${isAccept?'#22c55e':'#f59e0b'};padding:16px;border-radius:4px;margin-bottom:24px;">
      <div style="font-size:22px;font-weight:bold;color:${isAccept?'#166534':'#92400e'};">
        ${isAccept ? '✅ Customer Accepted the Quote' : '🔄 Customer Requested Changes'}
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <tr style="background:#f8f8f8;"><td style="padding:10px;font-weight:bold;color:#555;width:130px;">Order</td><td style="padding:10px;color:#333;font-weight:bold;">${ref}</td></tr>
      <tr><td style="padding:10px;font-weight:bold;color:#555;">Customer</td><td style="padding:10px;color:#333;">${customerName}</td></tr>
      <tr style="background:#f8f8f8;"><td style="padding:10px;font-weight:bold;color:#555;">Email</td><td style="padding:10px;color:#333;">${customerEmail}</td></tr>
      <tr><td style="padding:10px;font-weight:bold;color:#555;">Total</td><td style="padding:10px;color:#333;font-weight:bold;">SAR ${total}</td></tr>
      <tr style="background:#f8f8f8;"><td style="padding:10px;font-weight:bold;color:#555;">Status</td>
      <td style="padding:10px;color:${isAccept?'#166534':'#92400e'};font-weight:bold;">
        ${isAccept ? '✅ Accepted — Proceed with order' : '🔄 Changes needed — Contact customer'}
      </td></tr>
    </table>
    <a href="https://spzones.com" style="display:inline-block;background:#F5B800;color:#000;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:20px;">Open Admin Panel →</a>
  </td></tr>
  <tr><td style="background:#f8f8f8;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
    <div style="font-size:11px;color:#999;">SP Zone · info@spzones.com · spzones.com</div>
  </td></tr></table></td></tr></table></body></html>`;

  await sendNotification(
    ADMIN_EMAIL,
    isAccept ? `✅ Quote Accepted — ${ref} — ${customerName}` : `🔄 Changes Requested — ${ref} — ${customerName}`,
    adminHtml
  );

  const confirmPage = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SP Zone — ${isAccept ? 'Quote Accepted' : 'Changes Requested'}</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}.card{background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.12);max-width:460px;width:100%;overflow:hidden;}.hdr{background:#1B3A6B;padding:26px 32px;}.logo{color:#F5B800;font-size:22px;font-weight:900;letter-spacing:2px;}.logo-sub{color:rgba(255,255,255,0.5);font-size:11px;margin-top:3px;}.body{padding:36px 32px;text-align:center;}.icon{font-size:60px;margin-bottom:16px;}h1{color:#1B3A6B;font-size:21px;margin-bottom:10px;}p{color:#666;line-height:1.7;font-size:14px;margin-bottom:8px;}.ref{display:inline-block;background:#fff8e1;color:#1B3A6B;font-weight:bold;padding:8px 22px;border-radius:20px;margin:14px 0;font-size:15px;border:1px solid #F5B800;}.btn{display:inline-block;background:#1B3A6B;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:18px;font-size:14px;}.footer{background:#f8f8f8;padding:14px 32px;text-align:center;border-top:1px solid #eee;font-size:11px;color:#aaa;}</style>
</head><body>
<div class="card">
  <div class="hdr"><div class="logo">SP ZONE</div><div class="logo-sub">Wholesale Auto Parts</div></div>
  <div class="body">
    <div class="icon">${isAccept ? '✅' : '🔄'}</div>
    <h1>${isAccept ? 'Quote Accepted!' : 'Changes Requested!'}</h1>
    <div class="ref">${ref}</div>
    <p>${isAccept ? 'Thank you! Your acceptance has been sent to our team. We will process your order and contact you shortly.' : 'Your request for changes has been sent. We will review and send you a revised quote soon.'}</p>
    <p style="color:#999;font-size:13px;margin-top:8px;">Our team has been notified automatically.</p>
    <a href="https://spzones.com" class="btn">Back to SP Zone →</a>
  </div>
  <div class="footer">SP Zone · info@spzones.com · spzones.com</div>
</div>
</body></html>`;

  return new Response(confirmPage, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
