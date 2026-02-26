import { MercadoPagoConfig, Order, Payment, Preference } from "mercadopago";
import { PaymentGetData } from "mercadopago/dist/clients/payment/get/types";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN as string,
});

const pref = new Preference(client);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

type CreatePrefOptions = {
  productName: string;
  productId: string;
  price: number;
  quantity: number;
  transactionId: string;
};

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
        success: `${BASE_URL}/success`,
        failure: `${BASE_URL}/failure`,
        pending: `${BASE_URL}/pending`,
      },
    },
  });

  return newPref;
}

export async function getPaymentStatus(paymentId: string) {
  const payment = new Payment(client);
  const paymentStatus = await payment.get({ id: paymentId });
  return paymentStatus;
}
