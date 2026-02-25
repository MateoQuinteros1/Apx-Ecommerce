import { NextRequest, NextResponse } from "next/server";
import { SearchController } from "@/controllers/search";

export async function POST(request: NextRequest) {
  try {
    await SearchController.syncProductsFromAirtable();
    return NextResponse.json({ message: "Successfully synced" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
