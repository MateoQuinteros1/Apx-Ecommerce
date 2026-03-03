import crypto from "crypto";
import { NextRequest } from "next/server";

export async function validateMercadoPagoWebhook(request: NextRequest) {
  const secret = process.env.MP_WEBHOOK_SECRET!;

  const rawBody = await request.text();

  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");

  if (!signature || !requestId) {
    throw new Error("Missing Mercado Pago headers");
  }

  const parts = Object.fromEntries(
    signature.split(",").map((part) => part.split("=")),
  );

  const ts = parts.ts;
  const v1 = parts.v1;

  const data = JSON.parse(rawBody);

  const manifest = `id:${data.data.id};request-id:${requestId};ts:${ts};`;

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  if (hmac !== v1) {
    throw new Error("Invalid Mercado Pago signature");
  }

  return data; // devuelve el body ya validado
}
