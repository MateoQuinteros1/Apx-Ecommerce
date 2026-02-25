import {
  authTokenMiddleware,
  type AuthenticatedRequest,
} from "@/lib/middleware/authTokenMiddleware";
import { UserController } from "@/controllers/user";
import { NextResponse } from "next/server";
import z from "zod";

const updateUserAddressSchema = z.strictObject({
  street_name: z.string().min(3).max(50).optional(),
  street_number: z.string().min(1).max(20).optional(),
  apartment: z.string().min(1).max(15).optional(),
  city: z.string().min(3).max(50).optional(),
  state: z.string().min(3).max(50).optional(),
  postal_code: z.string().min(3).max(20).optional(),
  country: z.string().min(3).max(50).optional(),
});

//Update user address
async function updateUserAddressHandler(req: AuthenticatedRequest) {
  try {
    const payload = req.user as { id: string; iat: number; exp: number };
    const body = await req.json();
    const validatedBody = updateUserAddressSchema.parse(body);
    const updatedUser = await UserController.updateUserAddress(
      payload.id,
      validatedBody,
    );
    return NextResponse.json(updatedUser);
  } catch (error) {
    // Errores de validación del request
    if (error instanceof z.ZodError) {
      if (error.issues[0].code === "unrecognized_keys") {
        const errors = error.issues[0].keys.join(", ");
        return NextResponse.json(
          {
            error: `Unrecognized keys: ${errors}`,
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          error: error.issues[0],
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const PATCH = authTokenMiddleware(updateUserAddressHandler);
