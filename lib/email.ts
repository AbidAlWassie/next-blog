import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string,
  baseUrl: string
) => {
  const confirmLink = `${baseUrl}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email address</h2>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <a href="${confirmLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${confirmLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't sign up for an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: "Failed to send verification email" };
  }
};

export const sendWelcomeEmail = async (email: string, name?: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to: email,
      subject: "Welcome to our platform!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome${name ? ` ${name}` : ""}!</h2>
          <p>Thank you for verifying your email address. Your account is now active.</p>
          <p>You can now sign in to your account and start using our platform.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: "Failed to send welcome email" };
  }
};
