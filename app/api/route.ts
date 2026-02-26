import { getSequelize } from "@/lib/sequelize/sequelize";
import { User } from "@/models/user";
import { ProductController } from "@/controllers/products";

export async function GET(request: Request) {
  const res = await ProductController.incrementOrDecreaseProductStock(
    "recwBQnAY12SX9Rgd",
    "decrease",
    1,
  );
  return Response.json({ message: "Hello world", product: res });
}

export async function POST(request: Request) {
  try {
    await getSequelize().authenticate();
    console.log("Conectado a la DB");
    return Response.json({ message: "Conectado a la DB" });
  } catch (error) {
    console.log("Entro al error");
    console.error(error);
    return Response.json({ error: error });
  }
}

export async function PATCH(request: Request) {
  try {
    const usuario = await User.findByPk("19b3a28c-c6e9-46ee-9387-53c78c287bc1");
    console.log(usuario);
    return Response.json({ message: "Usuario encontrado" });
  } catch (error) {
    console.log("Entro al error");
    console.error(error);
    return Response.json({ error: error });
  }
}
