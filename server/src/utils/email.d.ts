/**
 * Sends an email using the configured SMTP transport.
 */
export declare const sendEmail: (options: {
    email: string;
    subject: string;
    message: string;
}) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
//# sourceMappingURL=email.d.ts.map