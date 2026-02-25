import { airTable } from "@/lib/airtable";
import { client, indexName } from "@/lib/algolia";
export class SearchController {
  public static async syncProductsFromAirtable() {
    //Esto recorre la tabla de airtable y va iterando de 10 en 10, sincronizandolos en algolia
    await airTable("Furniture")
      .select({
        view: "All furniture",
        pageSize: 10,
      })
      .eachPage(async (records, fetchNextPage) => {
        const formatedRecords = records.map((record) => ({
          objectID: record.id,
          ...record.fields,
        }));
        await client.saveObjects({
          indexName,
          objects: formatedRecords,
        });
        fetchNextPage();
      });
  }
}
