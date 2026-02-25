import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { AuthController } from "@/controllers/auth";

const AuthTokenSchema = z.strictObject({
  email: z.email(),
  code: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { email, code } = AuthTokenSchema.parse(json);
    const token = await AuthController.verifyCode(email, code);
    return NextResponse.json({
      message: "Token generated successfully",
      token,
    });
  } catch (error: any) {
    // Errores de validez del código de verificación
    if (
      error.message === "INVALID_VERIFICATION_CODE" ||
      error.message === "VERIFICATION_CODE_EXPIRED" ||
      error.message === "VERIFICATION_CODE_ALREADY_USED"
    ) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 401 },
      );
    }

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
          error: error.issues[0].message,
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
