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

const connString = process.env.DATABASE_URL;

// Optional: if PGHOSTADDR is provided, pin to that IPv4 to avoid round-robin IPs that may be blocked
let finalConn = connString;
if (process.env.PGHOSTADDR) {
  try {
    const url = new URL(connString);
    url.hostname = process.env.PGHOSTADDR;
    finalConn = url.toString();
  } catch (_err) {
    // If parsing fails, fallback to original connection string
    finalConn = connString;
  }
}

const pool = new Pool({
  connectionString: finalConn,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});
export const db = drizzle(pool, { schema });
