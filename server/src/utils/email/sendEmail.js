import Brevo from "@getbrevo/brevo";

export async function sendEmail({ to, subject, html }) {
  const client = new Brevo.TransactionalEmailsApi();

  client.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const sendSmtpEmail = {
    sender: { name: "SecretBox", email: "magicianmt@gmail.com" }, 
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  try {
    const response = await client.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw error;
  }
}