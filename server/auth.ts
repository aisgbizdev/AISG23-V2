/**
 * Authentication Service for AiSG
 * SQL Manual Version (Compatible with NeonDB)
 */

import bcrypt from "bcrypt";
import { pool } from "./db";
import type { User } from "@shared/schema";

const SALT_ROUNDS = 10;

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create user
 */
export async function createUser(data: {
  username: string;
  password: string;
  name: string;
  email?: string;
  role: "full_admin" | "admin" | "auditor" | "regular_user";
  securityQuestion?: string;
  securityAnswer?: string;
}): Promise<User> {
  
  const hashedPassword = await hashPassword(data.password);
  const hashedSecurityAnswer = data.securityAnswer
    ? await hashPassword(data.securityAnswer.toLowerCase().trim())
    : null;

  const query = `
    INSERT INTO users (username, password, name, email, role, security_question, security_answer)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const params = [
    data.username,
    hashedPassword,
    data.name,
    data.email || null,
    data.role,
    data.securityQuestion || null,
    hashedSecurityAnswer
  ];

  const result = await pool.query(query, params);
  return result.rows[0];
}

/**
 * Register regular user
 */
export async function registerUser(data: {
  username: string;
  password: string;
  name: string;
  email?: string;
  securityQuestion: string;
  securityAnswer: string;
}): Promise<User> {
  return createUser({
    ...data,
    role: "regular_user",
  });
}

/**
 * Get security question
 */
export async function getSecurityQuestion(username: string): Promise<string | null> {
  const result = await pool.query(
    "SELECT security_question FROM users WHERE username = $1 LIMIT 1",
    [username]
  );

  return result.rows[0]?.security_question || null;
}

/**
 * Verify security answer
 */
export async function verifySecurityAnswer(
  username: string,
  answer: string
): Promise<boolean> {
  
  const result = await pool.query(
    "SELECT security_answer FROM users WHERE username = $1 LIMIT 1",
    [username]
  );

  if (!result.rows[0] || !result.rows[0].security_answer)
    return false;

  return verifyPassword(answer.toLowerCase().trim(), result.rows[0].security_answer);
}

/**
 * Reset password
 */
export async function resetPassword(
  username: string,
  newPassword: string
): Promise<void> {
  
  const hashedPassword = await hashPassword(newPassword);

  await pool.query(
    `UPDATE users SET password = $1, updated_at = NOW() WHERE username = $2`,
    [hashedPassword, username]
  );
}

/**
 * Authenticate user
 */
export async function authenticateUser(
  username: string,
  password: string
): Promise<Omit<User, "password"> | null> {

  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1 LIMIT 1",
    [username]
  );

  const user = result.rows[0];
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  const { password: _, ...userWithoutPass } = user;
  return userWithoutPass;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<Omit<User, "password"> | null> {

  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1 LIMIT 1",
    [userId]
  );

  const user = result.rows[0];
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<void> {

  const hashedPassword = await hashPassword(newPassword);

  await pool.query(
    `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
    [hashedPassword, userId]
  );
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<void> {
  await pool.query(
    "DELETE FROM users WHERE id = $1",
    [userId]
  );
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<Array<Omit<User, "password">>> {
  const result = await pool.query("SELECT * FROM users");

  return result.rows.map(({ password: _, ...u }) => u);
}

/**
 * Permission checks
 */
export function hasPermission(
  userRole: User["role"],
  requiredRole: User["role"]
): boolean {
  const hierarchy = {
    full_admin: 4,
    admin: 3,
    auditor: 2,
    regular_user: 1,
  };
  return hierarchy[userRole] >= hierarchy[requiredRole];
}

export function canAccessAudit(
  userRole: User["role"],
  userId: string,
  auditOwnerId: string | null
): boolean {
  if (userRole === "full_admin") return true;
  if (userRole === "admin") return true;
  return userId === auditOwnerId;
}

/**
 * Ensure superadmin exists
 */
export async function ensureSuperadminExists(): Promise<void> {
  try {
    const check = await pool.query(
      "SELECT * FROM users WHERE username = 'superadmin' LIMIT 1"
    );

    if (check.rows.length > 0) {
      console.log("✅ Superadmin already exists");
      return;
    }

    console.log("🔧 Creating superadmin...");

    await createUser({
      username: "superadmin",
      password: "vito1007",
      name: "AiSG Admin Panel",
      email: "admin@aisg.com",
      role: "full_admin",
      securityQuestion: "Nama aplikasi ini?",
      securityAnswer: "AiSG",
    });

    console.log("✅ Superadmin created");
  } catch (error) {
    console.error("❌ Failed to ensure superadmin exists:", error);
  }
}
