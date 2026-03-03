import { getSequelize } from "@/lib/sequelize/sequelize";
import { User } from "@/models/user";
import { sendOrderConfirmation } from "@/lib/mail/nodemailer";

export async function GET(request: Request) {
  await sendOrderConfirmation("mateoquinteros150@gmail.com", "cancelled", {
    title: "Zapatillas Nike Air Force 1",
    price: 100000,
    description:
      "Zapatillas clásicas de Nike con estilo atemporal y comodidad excepcional.",
    image_url:
      "https://nikearprod.vtexassets.com/arquivos/ids/155415/CW2288_111_A_PREM-hei-3144-wid-3144-fmt.jpg?v=638086277591330000",
    quantity: 2,
  });
  return Response.json({ message: "Correo de confirmación enviado" });
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
