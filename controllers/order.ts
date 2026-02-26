import { Order } from "../models/order";
import { initDb } from "@/lib/sequelize/init";
import { SearchController } from "./search";
import { createPreference } from "@/lib/mercadopago";
import { getPaymentStatus } from "@/lib/mercadopago";

//Tipo para el parametro que recibe la funcion createOrder
type CreateOrderParams = {
  user_id: string;
  product_id: string;
  quantity: number;
};

//Tipos para los productos que vienen desde algolia
interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface ProductImage {
  id: string;
  width: number;
  height: number;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: Thumbnail;
    large: Thumbnail;
    full: Thumbnail;
  };
}

export interface Product {
  Name: string;
  Orders: string[];
  Images: ProductImage[];
  Description: string;
  Link: string;
  Type: string;
  "Unit cost": number;
  Materials: string[];
  Settings: string[];
  "Size (WxLxH)": string;
  Vendor: string[];
  Designer: string[];
  "In stock": boolean;
  "Total units sold": number;
  "Gross sales": number;
  Color: string[];
  objectID: string;
  stock: number;
}

//Tipos para el Web Hook de mercado pago
export type WebHookBody = {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: string;
};

export class OrderController {
  public static async getUserOrders(user_id: string) {
    await initDb();
    const orders = await Order.findAll({ where: { user_id } });
    return orders;
  }

  public static async getOrderById(order_id: string) {
    await initDb();
    const order = await Order.findByPk(order_id);
    return order;
  }

  public static async createOrder(params: CreateOrderParams) {
    await initDb();
    const productData = (await SearchController.getProductById(
      params.product_id,
    )) as unknown as Product;

    const newOrder = await Order.create({
      user_id: params.user_id,
      product_id: params.product_id,
      quantity: params.quantity,
      total_price: productData["Unit cost"] * params.quantity,
      status: "pending",
    });
    const newPreference = await createPreference({
      productName: productData.Name,
      productId: params.product_id,
      price: productData["Unit cost"],
      quantity: params.quantity,
      transactionId: newOrder.id,
    });
    return newPreference;
  }

  public static async confirmOrder(data: WebHookBody) {
    if (data.type === "payment") {
      await initDb();
      const mpPayment = await getPaymentStatus(data.data.id);
      //En caso de que salga bien el pago
      if (mpPayment.status === "approved") {
        await Order.update(
          { status: "completed" },
          { where: { id: mpPayment.external_reference } },
        );
        //En caso de que salga mal el pago o el usuario lo cancele
      } else if (
        mpPayment.status === "cancelled" ||
        mpPayment.status === "rejected"
      ) {
        await Order.update(
          { status: "cancelled" },
          { where: { id: mpPayment.external_reference } },
        );
      }
    }
  }
}
