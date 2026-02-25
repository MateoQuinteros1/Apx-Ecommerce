import { Auth } from "@/models/auth";
import { User } from "@/models/user";
import { initDb } from "@/lib/sequelize/init";
import { addMinutes } from "date-fns";
import { sendVerificationCode } from "@/lib/mail/nodemailer";
import { isBefore } from "date-fns";
import jwt from "jsonwebtoken";

export class AuthController {
  public static async findOrCreateUser(email: string) {
    //Necesario para que sequelize se conecte a la base de datos
    await initDb();

    const inFiveMinutes = addMinutes(new Date(), 5);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const existingAuth = await Auth.findOne({ where: { email } });
    if (!existingAuth) {
      const newName = email.split("@")[0];
      const user = await User.create({ name: newName });
      await Auth.create({
        email,
        verification_code: verificationCode,
        verification_code_expires_at: inFiveMinutes,
        user_id: user.id,
      });
      await sendVerificationCode(email, verificationCode);
      return;
    }

    await existingAuth?.update({
      verification_code: verificationCode,
      verification_code_expires_at: inFiveMinutes,
      is_verification_code_used: false,
    });

    await sendVerificationCode(email, verificationCode);
  }

  public static async verifyCode(email: string, code: number) {
    await initDb();

    const auth = await Auth.findOne({ where: { email } });

    if (auth?.verification_code !== code) {
      throw new Error("INVALID_VERIFICATION_CODE");
    }

    const isVerificationCodeExpired = isBefore(
      auth?.verification_code_expires_at,
      new Date(),
    );

    if (isVerificationCodeExpired) {
      throw new Error("VERIFICATION_CODE_EXPIRED");
    }

    if (auth.is_verification_code_used) {
      throw new Error("VERIFICATION_CODE_ALREADY_USED");
    }

    await auth.update({
      is_verification_code_used: true,
    });

    const token = jwt.sign(
      { id: auth.user_id },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: "5d",
      },
    );

    return token;
  }
}
