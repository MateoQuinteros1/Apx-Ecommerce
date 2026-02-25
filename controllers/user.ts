import { User } from "@/models/user";
import { initDb } from "@/lib/sequelize/init";

type UpdateUserFields = {
  name?: string;
  phone?: string;
};

type UpdateUserAddressFields = {
  street_name?: string;
  street_number?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

export class UserController {
  public static async getUserData(user_id: string) {
    await initDb();
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    return user;
  }

  public static async updateUserData(
    user_id: string,
    fields: UpdateUserFields,
  ) {
    await initDb();
    const updatedUser = await User.update(fields, {
      where: { id: user_id },
      returning: true,
    });
    return updatedUser[1][0];
  }

  public static async updateUserAddress(
    user_id: string,
    fields: UpdateUserAddressFields,
  ) {
    await initDb();
    const updatedUser = await User.update(fields, {
      where: { id: user_id },
      returning: true,
    });
    return updatedUser[1][0];
  }
}
