import { client, sender } from './mailtrap.config.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE ,WELCOME_EMAIL_TEMPLATE , } from './EmailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient= [{email}];

  try {
    const response = await client.send({
      from:sender,
      to: recipient,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification"
    });

    console.log(" Email sent successfully " ,response);
  } catch (error) {
    throw new Error(`Error sending Verification email:${error}`);
  }
}

export const sendWelcomeEmail = async (email , firstName) => {
  const recipient = [{email}];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: 'Welcome to Skill Forge Community',
      html: WELCOME_EMAIL_TEMPLATE.replace("{FirstName}", firstName),
      category: "Welcome Email"
    });

    console.log("Email sent successfully ", response);
  } catch (error) {
    console.log("Error sending Welcome email: ", error);
    throw new Error(`Error sending Welcome email:${error}`);
  }
}

export const SendPasswordResetEmail = async (email , ResetUrl) => {
  const recipient = [{email}];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", ResetUrl),
      category: "Password Reset"
    });

    console.log("Email sent successfully ", response);
  } catch (error) {
    console.log("Error sending Password Reset email: ", error);
    throw new Error(`Error sending Password Reset email:${error}`);
  }
}

export const SendResetSuccessEmail = async (email) => {
  const recipient = [{email}];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: 'Password reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset"
    });

    console.log("password reset email sent successfully", response);
  } catch (error) {
    throw new Error(`Error sending password reset success email: ${error}`);
  }
}
