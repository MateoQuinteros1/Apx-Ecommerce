import { NextRequest, NextResponse } from "next/server";
import { SearchController } from "@/controllers/search";
import { formatLimitAndPage } from "@/utils/algoliaPaginate";

const VALID_CATEGORIES = [
  "Camas",
  "Estanterías",
  "Sillas",
  "Iluminación",
  "Alfombras",
  "Sofás",
  "Mesas",
] as const;

const VALID_HOMEROOMS = [
  "Living",
  "Oficina",
  "Exterior",
  "Comedor",
  "Dormitorio",
] as const;

function isValidCategory(
  category: string,
): category is (typeof VALID_CATEGORIES)[number] {
  return VALID_CATEGORIES.includes(
    category as (typeof VALID_CATEGORIES)[number],
  );
}

function isValidHomeroom(
  homeroom: string,
): homeroom is (typeof VALID_HOMEROOMS)[number] {
  return VALID_HOMEROOMS.includes(homeroom as (typeof VALID_HOMEROOMS)[number]);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const homeroom = searchParams.get("homeroom");
  const { limit, offset } = formatLimitAndPage(
    searchParams.get("limit"),
    searchParams.get("offset"),
  );

  if (!category && !homeroom) {
    return NextResponse.json(
      { error: "You must provide either category or homeroom" },
      { status: 400 },
    );
  }

  if (category && homeroom) {
    return NextResponse.json(
      { error: "Use either category or homeroom, not both at the same time" },
      { status: 400 },
    );
  }

  try {
    if (category) {
      if (!isValidCategory(category)) {
        return NextResponse.json(
          {
            error: "Invalid category",
            validCategories: VALID_CATEGORIES,
          },
          { status: 400 },
        );
      }

      const results = await SearchController.getProductsByCategory(
        category,
        limit,
        offset,
      );
      return NextResponse.json(results);
    }

    if (!homeroom || !isValidHomeroom(homeroom)) {
      return NextResponse.json(
        {
          error: "Invalid homeroom",
          validHomerooms: VALID_HOMEROOMS,
        },
        { status: 400 },
      );
    }

    const results = await SearchController.getProductsByHomeRoom(
      homeroom,
      limit,
      offset,
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("Products filter search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
