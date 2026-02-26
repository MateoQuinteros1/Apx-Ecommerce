import { NextRequest, NextResponse } from "next/server";
import {
  authTokenMiddleware,
  AuthenticatedRequest,
} from "@/lib/middleware/authTokenMiddleware";
import { OrderController } from "@/controllers/order";

export const GET = authTokenMiddleware(async function GetOrderByIdHandler(
  request: AuthenticatedRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const { orderId } = await params;
    const order = await OrderController.getOrderById(orderId);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 },
    );
  }
});
