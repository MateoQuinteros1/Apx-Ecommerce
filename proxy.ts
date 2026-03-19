import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["http://localhost:3000"];

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed = allowedOrigins.includes(origin);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": isAllowed ? origin : "",
        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS, PATCH, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // cachea el preflight 24hs
      },
    });
  }

  // Para el resto de requests, inyecta el header en la respuesta
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", isAllowed ? origin : "");
  return response;
}

export const config = {
  matcher: "/api/:path*", // solo aplica a rutas de API
};
