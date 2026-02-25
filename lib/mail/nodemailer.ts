import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationCode(email: string, code: number) {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; margin-top: 0;">¡Bienvenido!</h1>
        <p style="color: #666666; font-size: 16px;">Para continuar con tu ingreso, utiliza el siguiente código de verificación:</p>
      </div>
      
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 30px;">
        <span style="font-size: 42px; font-weight: bold; letter-spacing: 8px; color: #007bff;">${code}</span>
      </div>
      
      <div style="text-align: center;">
        <p style="color: #999999; font-size: 14px;">Este código expirará en <strong>5 minutos</strong>.</p>
        <p style="color: #999999; font-size: 12px; margin-top: 20px;">Si no solicitaste este código, puedes ignorar este correo de forma segura.</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
      
      <div style="text-align: center; color: #bdbdbd; font-size: 11px;">
        <p>${new Date().getFullYear()} APX E-commerce App.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"APX E-commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Tu código de verificación",
    text: `Tu código de verificación es: ${code}`,
    html: htmlContent,
  });
}
