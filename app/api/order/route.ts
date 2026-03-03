import { NextRequest, NextResponse } from "next/server";
import {
  authTokenMiddleware,
  AuthenticatedRequest,
} from "@/lib/middleware/authTokenMiddleware";
import { OrderController } from "@/controllers/order";

export const POST = authTokenMiddleware(async function POSTHandler(
  request: AuthenticatedRequest,
) {
  const payload = request.user as { id: string; iat: number; exp: number };
  const { searchParams } = request.nextUrl;
  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity"));

  if (!productId || !quantity) {
    return NextResponse.json(
      { error: "Missing params: productId and quantity are required" },
      { status: 400 },
    );
  }

  try {
    const order = await OrderController.createOrder({
      user_id: payload.id,
      product_id: productId,
      quantity,
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
