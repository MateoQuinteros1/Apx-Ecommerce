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

type ProductData = {
  title: string;
  price: number;
  description: string;
  image_url: string;
  quantity: number;
};

export async function sendOrderConfirmation(
  email: string,
  status: string,
  productData?: ProductData,
) {
  let htmlContent: string = "";
  let subject: string = "";

  if (status === "approved" && productData) {
    subject = "¡Tu compra fue exitosa!";
    htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">

        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a1a; margin-top: 0;">¡Compra exitosa! 🎉</h1>
          <p style="color: #666666; font-size: 16px;">Gracias por tu compra. Aquí tienes el resumen de tu pedido:</p>
        </div>

        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <div style="text-align: center; margin-bottom: 15px;">
            <img src="${productData.image_url}" alt="${productData.title}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #e0e0e0;" />
          </div>
          <div>
            <h2 style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 18px;">${productData.title}</h2>
            <p style="color: #666666; font-size: 14px; margin: 0 0 12px 0;">${productData.description}</p>
            <p style="color: #1a1a1a; font-size: 14px; margin: 0 0 6px 0;">
              <strong>Cantidad:</strong> ${productData.quantity}
            </p>
            <p style="color: #1a1a1a; font-size: 14px; margin: 0 0 6px 0;">
              <strong>Precio unitario:</strong> $${productData.price.toFixed(2)}
            </p>
            <p style="color: #007bff; font-size: 16px; font-weight: bold; margin: 10px 0 0 0;">
              Total: $${(productData.price * productData.quantity).toFixed(2)}
            </p>
          </div>
        </div>

        <div style="background-color: #e6f4ea; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 30px;">
          <p style="color: #2e7d32; font-size: 15px; margin: 0;">
            ✅ Tu pago fue <strong>aprobado</strong> correctamente.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">

        <div style="text-align: center; color: #bdbdbd; font-size: 11px;">
          <p>${new Date().getFullYear()} APX E-commerce App.</p>
        </div>
      </div>
    `;
  } else {
    subject = "Tu compra no pudo procesarse";
    htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">

        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a1a; margin-top: 0;">Compra no procesada ❌</h1>
          <p style="color: #666666; font-size: 16px;">Lo sentimos, tu compra de ${productData?.title} no pudo completarse en este momento.</p>
        </div>

        <div style="background-color: #fdecea; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 30px;">
          <p style="color: #c62828; font-size: 15px; margin: 0;">
             Tu pago fue <strong>${status === "cancelled" ? "cancelado" : "rechazado"}</strong>.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #666666; font-size: 14px;">
            Si crees que esto es un error, por favor intenta nuevamente o comunícate con nuestro soporte.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">

        <div style="text-align: center; color: #bdbdbd; font-size: 11px;">
          <p>${new Date().getFullYear()} APX E-commerce App.</p>
        </div>
      </div>
    `;
  }

  await transporter.sendMail({
    from: `"APX E-commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: htmlContent,
  });
}
