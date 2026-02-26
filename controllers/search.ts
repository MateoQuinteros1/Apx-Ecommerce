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

  public static async searchProducts(
    query: string,
    limit: number,
    offset: number,
  ) {
    const results = await client.searchSingleIndex({
      indexName,
      searchParams: {
        query,
        offset: offset,
        length: limit,
        filters: "'In stock':true",
      },
    });
    return {
      results: results.hits,
      pagination: {
        offset,
        limit,
        total: results.nbHits,
      },
    };
  }

  public static async getProductById(id: string) {
    const product = await client.getObject({
      indexName,
      objectID: id,
    });
    return product;
  }
}
