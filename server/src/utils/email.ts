import nodemailer from "nodemailer";

export const sendEmail = async (options: { email: string; subject: string; message: string }) => {
  // 1) Create a transporter
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: Number(process.env.EMAIL_PORT),
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });


  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
      user: process.env.EMAIL_USER || "e1c476edbcae45",
      pass: process.env.EMAIL_PASS || "0c03093238f34d",
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Bexex Global <noreply@bexex.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div>${options.message}</div>`,
  };

  // 3) Actually send the email
  await transport.sendMail(mailOptions);
};