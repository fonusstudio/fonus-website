import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactRateLimits = sqliteTable(
  "contact_rate_limits",
  {
    identifier: text("identifier").primaryKey(),
    windowStartedAt: integer("window_started_at").notNull(),
    requestCount: integer("request_count").notNull().default(1),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("contact_rate_limits_updated_at_idx").on(table.updatedAt)],
);
