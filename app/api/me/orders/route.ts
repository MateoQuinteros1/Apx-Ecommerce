import { NextRequest, NextResponse } from "next/server";
import {
  authTokenMiddleware,
  AuthenticatedRequest,
} from "@/lib/middleware/authTokenMiddleware";
import { OrderController } from "@/controllers/order";

export const GET = authTokenMiddleware(async function GetUserOrdersHandler(
  request: AuthenticatedRequest,
) {
  const payload = request.user as { id: string; iat: number; exp: number };
  const orders = await OrderController.getUserOrders(payload.id);
  return NextResponse.json(orders);
});
