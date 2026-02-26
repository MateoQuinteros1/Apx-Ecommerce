import { NextRequest, NextResponse } from "next/server";
import { SearchController } from "@/controllers/search";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  //Necesito el await para que funcione correctamente. Sin él no devuelve nada.
  try {
    const { productId } = await params;
    const product = await SearchController.getProductById(productId);
    return NextResponse.json(product);
  } catch (error: any) {
    if (error.status === 404) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
