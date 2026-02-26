import { NextRequest, NextResponse } from "next/server";
import {
  authTokenMiddleware,
  AuthenticatedRequest,
} from "@/lib/middleware/authTokenMiddleware";
import { OrderController } from "@/controllers/order";

export const POST = authTokenMiddleware(async function POSTHandler(
  request: AuthenticatedRequest,
) {
  const { searchParams } = request.nextUrl;
  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity"));
  const payload = request.user as { id: string; iat: number; exp: number };

  if (!productId || !quantity) {
    return NextResponse.json(
      { error: "Missing params: productId and quantity are required" },
      { status: 400 },
    );
  }

  const order = await OrderController.createOrder({
    user_id: payload.id,
    product_id: productId,
    quantity,
  });
  return NextResponse.json(order);
});
