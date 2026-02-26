import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/mercadopago";
import { OrderController } from "@/controllers/order";
import { WebHookBody } from "@/controllers/order";

//Webhook que recibe la señal de mercado pago
export async function POST(request: NextRequest) {
  const body = (await request.json()) as WebHookBody;
  await OrderController.confirmOrder(body);
  return NextResponse.json({ message: "OK" });
}
