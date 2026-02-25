import { UserController } from "@/controllers/user";
import {
  authTokenMiddleware,
  AuthenticatedRequest,
} from "@/lib/middleware/authTokenMiddleware";
import { NextResponse } from "next/server";
import z from "zod";

const updateUserDataSchema = z.strictObject({
  name: z.string().min(3).max(30),
  phone: z.string().min(8).max(20),
});

//Get user data
async function getUserHandler(req: AuthenticatedRequest) {
  try {
    const payload = req.user as { id: string; iat: number; exp: number };
    const user = await UserController.getUserData(payload.id);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = authTokenMiddleware(getUserHandler);

//Update user data
async function updateUserDataHandler(req: AuthenticatedRequest) {
  try {
    const payload = req.user as { id: string; iat: number; exp: number };
    const body = await req.json();
    const validatedBody = updateUserDataSchema.parse(body);
    const updatedUser = await UserController.updateUserData(
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

export const PATCH = authTokenMiddleware(updateUserDataHandler);
