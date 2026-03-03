import { NextRequest, NextResponse } from "next/server";
import { OrderController } from "@/controllers/order";
import { WebHookBody } from "@/controllers/order";
import { validateMercadoPagoWebhook } from "@/lib/mercadopago/validateMercadoPagoWebHook";

//Webhook que recibe la señal de mercado pago
export async function POST(request: NextRequest) {
  try {
    //Valida que la solicitud proviene de mercado pago
    await validateMercadoPagoWebhook(request);

    //Se confirma (o no) la orden dependiendo de la información que se reciba.
    const body = (await request.json()) as WebHookBody;
    await OrderController.confirmOrder(body);
    return NextResponse.json({ message: "Order resolved successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
