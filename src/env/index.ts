import { config } from "dotenv";
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.preprocess(val => Number(val), z.number().default(8080)),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
