import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
   

    const info = await transporter.sendMail({
      from: `"Bank Hudge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

   
  } catch (error) {
   
    throw error; // <-- important
  }
};


async function sendRegistrationEmail(email, name) {
  const subject = "🎉 Welcome to Bank Hudge";

  const text = `Hi ${name},

Welcome to Bank Hudge!

Your account has been created successfully.

You can now log in and start managing your banking services securely.

Thank you for choosing Bank Hudge.

Regards,
Bank Hudge Team`;

  const html = `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:20px;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="background:#1d4ed8;padding:25px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;">
                    🏦 Bank Hudge
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:35px;color:#374151;font-size:16px;line-height:1.7;">
                  <p style="margin-top:0;">Hi <strong>${name}</strong>,</p>

                  <p>
                    Welcome to <strong>Bank Hudge</strong>! Your account has been
                    <strong>successfully created.</strong>
                  </p>

                  <p>
                    You can now log in to your account and securely access all our banking services.
                  </p>

                  <div style="text-align:center;margin:35px 0;">
                    <a
                      href="http://localhost:5173"
                      style="background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;display:inline-block;"
                    >
                      Login to Your Account
                    </a>
                  </div>

                  <p>
                    Thank you for choosing <strong>Bank Hudge</strong>. We look forward to serving you.
                  </p>

                  <p>
                    Regards,<br>
                    <strong>Bank Hudge Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:18px;text-align:center;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;">
                  © ${new Date().getFullYear()} Bank Hudge. All Rights Reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  await sendEmail(email, subject, text, html);
}


export const transactionEmail = async ({
  userEmail,
  name,
  transactionId,
  amount,
  type, // CREDIT | DEBIT
  status, // SUCCESS | FAILED | PENDING
  date = new Date().toLocaleString("en-IN"),
}) => {
  const statusColor = {
    SUCCESS: "#16a34a",
    FAILED: "#dc2626",
    PENDING: "#f59e0b",
  }[status];

  const transactionText =
    type === "CREDIT" ? "Amount Credited" : "Amount Debited";

  const subject = `${transactionText} - ${status}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Transaction Receipt</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,.08);">

<div style="background:#2563eb;padding:24px;text-align:center;">
<h1 style="color:#fff;margin:0;">Bank Transaction System</h1>
</div>

<div style="padding:30px;">

<h2>Hello ${name},</h2>

<p>Your transaction has been processed successfully.</p>

<table style="width:100%;border-collapse:collapse;">

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;"><b>Transaction ID</b></td>
<td style="padding:10px;border-bottom:1px solid #eee;">${transactionId}</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;"><b>Type</b></td>
<td style="padding:10px;border-bottom:1px solid #eee;">${transactionText}</td>
</tr>

<tr>
<td style="padding:10px;border-bottom:1px solid #eee;"><b>Amount</b></td>
<td style="padding:10px;border-bottom:1px solid #eee;">₹${Number(amount).toLocaleString(
    "en-IN"
  )}</td>
</tr>


<tr>
<td style="padding:10px;border-bottom:1px solid #eee;"><b>Date</b></td>
<td style="padding:10px;border-bottom:1px solid #eee;">${date}</td>
</tr>

<tr>
<td style="padding:10px;"><b>Status</b></td>
<td style="padding:10px;">
<span style="background:${statusColor};color:white;padding:6px 14px;border-radius:20px;font-weight:bold;">
${status}
</span>
</td>
</tr>

</table>

<p style="margin-top:30px;">
If you did not authorize this transaction, please contact support immediately.
</p>

<p>
Regards,<br>
<b>Bank Transaction System</b>
</p>

</div>

<div style="background:#f3f4f6;padding:15px;text-align:center;font-size:13px;color:#666;">
This is an automated email. Please do not reply.
</div>

</div>

</body>
</html>
`;

  await sendEmail(userEmail, subject, "", html);
};


export default {sendRegistrationEmail,transactionEmail}