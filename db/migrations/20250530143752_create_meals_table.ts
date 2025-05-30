import { time } from "console";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("meals", (table) => {
    table.string("id").primary();
    table.string("user_id").notNullable();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.boolean("is_on_diet").notNullable();
    table.timestamp("date").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("meals");
}
