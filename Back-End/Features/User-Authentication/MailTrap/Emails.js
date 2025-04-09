import { transporter, sender, client } from './nodemailer.config.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './EmailTemplates.js';

// Method 1: Using Nodemailer directly
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", {
      recipient: email,
      error: error.message,
      stack: error.stack
    });
    throw new Error(`Error sending Verification email: ${error.message}`);
  }
}

export const sendWelcomeEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: 'Welcome to Skill Forge Community',
      html: WELCOME_EMAIL_TEMPLATE.replace("{FirstName}", firstName)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", {
      recipient: email,
      firstName,
      error: error.message,
      stack: error.stack
    });
    throw new Error(`Error sending Welcome email: ${error.message}`);
  }
}

export const SendPasswordResetEmail = async (email, ResetUrl) => {
  try {
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", ResetUrl)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.messageId);
    console.log("Reset URL:", ResetUrl);
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", {
      recipient: email,
      resetUrl: ResetUrl,
      error: error.message,
      stack: error.stack
    });
    throw new Error(`Error sending Password Reset email: ${error.message}`);
  }
}

export const SendResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: 'Password Reset Successful',

      html: PASSWORD_RESET_SUCCESS_TEMPLATE
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending password reset success email:", {
      recipient: email,
      error: error.message,
      stack: error.stack
    });
    throw new Error(`Error sending password reset success email: ${error.message}`);
  }
}
