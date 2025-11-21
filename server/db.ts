// db.ts – NeonDB Ready Version
import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL tidak ditemukan di environment");
  process.exit(1);
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // wajib untuk Neon + Render
  },
});

export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    throw error;
  }
};

// OPTIONAL: test function (boleh dihapus)
export const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to NeonDB at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ NeonDB connection failed:", err);
  }
};
