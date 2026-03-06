import dns from "node:dns";
import pg from "pg";
const { Pool } = pg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// Prefer IPv4 to avoid IPv6 timeouts with some managed Postgres hosts
dns.setDefaultResultOrder("ipv4first");

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  hostaddr: process.env.PGHOSTADDR, // keep host (for SNI) but pin TCP to this IP if provided
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});
export const db = drizzle(pool, { schema });
