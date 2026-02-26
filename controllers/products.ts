import { airTable } from "@/lib/airtable";
type StockAction = "increment" | "decrease";
import { Product } from "./order";

export class ProductController {
  public static async incrementOrDecreaseProductStock(
    productId: string,
    action: StockAction,
    quantity: number,
  ) {
    const product = (await airTable("Furniture").find(
      productId,
    )) as unknown as {
      fields: Product;
    };

    if (action === "decrease") {
      if (product.fields.stock < 1 || product.fields.stock < quantity) {
        throw new Error("INSUFFICIENT_STOCK");
      }
      await airTable("Furniture").update(productId, {
        stock: product.fields.stock - quantity,
      });
    }
  }
}
