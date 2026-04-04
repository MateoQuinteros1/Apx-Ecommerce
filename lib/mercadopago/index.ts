import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || "http://localhost:3000";
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN as string,
});

const pref = new Preference(client);

type CreatePrefOptions = {
  payerEmail: string;
  productName: string;
  productId: string;
  price: number;
  quantity: number;
  transactionId: string;
};

// Retorna el link del pago (entre otras cosas)
export async function createPreference(options: CreatePrefOptions) {
  const newPref = await pref.create({
    body: {
      items: [
        {
          id: options.productId,
          title: options.productName,
          quantity: options.quantity,
          unit_price: options.price,
        },
      ],
      external_reference: options.transactionId,
      back_urls: {
        success: `${FRONTEND_BASE_URL}/thanks`,
        failure: `${FRONTEND_BASE_URL}/failure`,
        pending: `${FRONTEND_BASE_URL}/pending`,
      },
      payer: {
        email: options.payerEmail,
      },
      notification_url: `${BACKEND_BASE_URL}/api/ipn/mercadopago`,
      metadata: {
        userEmail: options.payerEmail,
      },
    },
  });

  return newPref;
}

// Función para obtener el estado de un pago por su ID
export async function getPaymentStatus(paymentId: string) {
  const payment = new Payment(client);
  const paymentStatus = await payment.get({ id: paymentId });
  return paymentStatus;
}
