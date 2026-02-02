/**
 * Seed script to create first superadmin user
 * Run with: SUPERADMIN_PASSWORD=yourpassword npx tsx server/seed-superadmin.ts
 */

import { createUser } from "./auth";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedSuperadmin() {
  try {
    console.log("🌱 Starting superadmin seed...");
    
    // Get password from environment variable
    const password = process.env.SUPERADMIN_PASSWORD;
    if (!password) {
      console.error("❌ SUPERADMIN_PASSWORD environment variable is required!");
      console.log("   Usage: SUPERADMIN_PASSWORD=yourpassword npx tsx server/seed-superadmin.ts");
      process.exit(1);
    }
    
    // Check if superadmin already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.username, "superadmin"))
      .limit(1);
    
    if (existing) {
      console.log("⚠️  Superadmin already exists!");
      console.log("   Username:", existing.username);
      console.log("   Name:", existing.name);
      console.log("   Role:", existing.role);
      console.log("   Created:", existing.createdAt);
      process.exit(0);
    }
    
    // Create superadmin with secure password from env
    console.log("📝 Creating superadmin account...");
    const superadmin = await createUser({
      username: "superadmin",
      password: password,
      name: "AiSG Admin Panel",
      role: "full_admin",
    });
    
    console.log("✅ Superadmin created successfully!");
    console.log("   Username:", superadmin.username);
    console.log("   Name:", superadmin.name);
    console.log("   Role:", superadmin.role);
    console.log("   ID:", superadmin.id);
    console.log("\n🎉 You can now login to AiSG!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding superadmin:", error);
    process.exit(1);
  }
}

seedSuperadmin();
