import { NextRequest, NextResponse } from "next/server";
import { formatLimitAndPage } from "@/utils/algoliaPaginate";
import { SearchController } from "@/controllers/search";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const query = searchParams.get("query") ?? "";
  const { limit, offset } = formatLimitAndPage(
    searchParams.get("limit"),
    searchParams.get("offset"),
  );

  try {
    const results = await SearchController.searchProducts(query, limit, offset);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Algolia search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
