import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/controllers/auth";

const AuthSchema = z.strictObject({
  email: z.email(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { email } = AuthSchema.parse(json);
    await AuthController.findOrCreateUser(email);
    return NextResponse.json({
      message: "Verification code sent successfully",
    });
  } catch (error) {
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
