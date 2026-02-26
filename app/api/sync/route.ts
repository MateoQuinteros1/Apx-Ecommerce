import { NextRequest, NextResponse } from "next/server";
import { SearchController } from "@/controllers/search";

export async function POST(request: NextRequest) {
  try {
    /*     const authHeader = request.headers.get("Authorization");
    if (authHeader !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } */
    await SearchController.syncProductsFromAirtable();
    return NextResponse.json({ message: "Successfully synced" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
