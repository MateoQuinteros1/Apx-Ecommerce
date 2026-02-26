import { verify, JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Extiende NextRequest para incluir el payload del JWT decodificado
export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload | string;
}

type Handler = (
  req: AuthenticatedRequest,
  params?: any,
) => Promise<NextResponse> | NextResponse;

export const authTokenMiddleware = (handler: Handler) => {
  return async (req: AuthenticatedRequest, params?: any): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized: No token provided" },
          { status: 401 },
        );
      }

      const decoded = verify(token, process.env.JWT_SECRET!);

      // Adjunta el payload decodificado al request para que el handler lo use
      req.user = decoded;

      return handler(req, params);
    } catch {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 },
      );
    }
  };
};
