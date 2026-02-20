import { Controller, Get, Module, Query } from "@nestjs/common";
import { createHash } from "node:crypto";
import { query as dbQuery } from "../../common/utils/db";
import { redis } from "../../common/utils/redis";

type SearchFilters = {
  serviceType?: "property" | "tour" | "car" | "bus";
  cityId?: string;
  checkIn?: string;
  checkOut?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: "price_asc" | "price_desc" | "rating_desc";
};

class SearchService {
  private cacheKey(filters: SearchFilters) {
    const digest = createHash("sha256").update(JSON.stringify(filters)).digest("hex");
    return `search:v1:${digest}`;
  }

  async unifiedSearch(filters: SearchFilters) {
    const key = this.cacheKey(filters);
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const sql = `
      SELECT service_type, entity_id, title, city_id, price_min_etb, price_max_etb, rating_avg
      FROM search_documents
      WHERE ($1::text IS NULL OR service_type = $1)
        AND ($2::uuid IS NULL OR city_id = $2::uuid)
        AND ($3::numeric IS NULL OR price_min_etb >= $3::numeric)
        AND ($4::numeric IS NULL OR price_max_etb <= $4::numeric)
        AND ($5::numeric IS NULL OR rating_avg >= $5::numeric)
      ORDER BY
        CASE WHEN $6::text = 'price_asc' THEN price_min_etb END ASC NULLS LAST,
        CASE WHEN $6::text = 'price_desc' THEN price_min_etb END DESC NULLS LAST,
        CASE WHEN $6::text = 'rating_desc' THEN rating_avg END DESC NULLS LAST
      LIMIT 50
    `;

    const result = await dbQuery(sql, [
      filters.serviceType ?? null,
      filters.cityId ?? null,
      filters.minPrice ?? null,
      filters.maxPrice ?? null,
      filters.minRating ?? null,
      filters.sort ?? "price_asc"
    ]);

    const payload = { filters, results: result.rows };
    await redis.set(key, JSON.stringify(payload), "EX", 60);
    return payload;
  }
}

@Controller("search")
class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() query: SearchFilters) {
    return this.searchService.unifiedSearch(query);
  }
}

@Module({
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
