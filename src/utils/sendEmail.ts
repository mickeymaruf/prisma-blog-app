import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const sendEmail = async ({
  to,
  name,
  subject,
  verificationLink,
}: {
  to: string;
  name: string;
  subject: string;
  verificationLink: string;
}) => {
  const info = await transporter.sendMail({
    from: '"Prisma Blog" <mickeymaruf@gmail.com>',
    to,
    subject,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #4CAF50;
          font-size: 24px;
          margin-bottom: 10px;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .button {
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin-top: 30px;
        }
        .footer a {
          color: #4CAF50;
          text-decoration: none;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>

      <div class="container">
        <h2>Welcome to Prisma Blog!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Prisma Blog App! We're thrilled to have you as part of our community.</p>
        <p>To complete your registration, please verify your email address by clicking the link below:</p>
        
        <p style="text-align: center;">
          <a href="${verificationLink}" class="button">Verify Your Email</a>
        </p>
        
        <p>If you did not sign up for this account, please ignore this email.</p>

        <div class="footer">
          <p>If you have any questions, feel free to <a href="mailto:support@prismablog.com">contact us</a>.</p>
          <p>© 2026 Prisma Blog App. All rights reserved.</p>
        </div>
      </div>

    </body>
    </html>
  `,
  });

  console.log("Message sent:", info.messageId);
};

export default sendEmail;
