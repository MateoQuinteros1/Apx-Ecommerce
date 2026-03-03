import { NextResponse } from "next/server";
import { SearchController } from "@/controllers/search";

export async function GET() {
  try {
    const productIds = await SearchController.getAllProductIds();
    return NextResponse.json(productIds);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
