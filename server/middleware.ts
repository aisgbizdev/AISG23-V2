/**
 * Authentication & Authorization Middleware for AiSG
 */

import type { Request, Response, NextFunction } from "express";
import type { User } from "@shared/schema";
import { getUserById } from "./auth";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 * Expects user ID to be stored in session
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.session?.userId;
  
  // Debug logging
  console.log("requireAuth check:", {
    sessionId: req.sessionID,
    userId: userId,
    session: req.session,
    cookies: req.headers.cookie,
  });
  
  if (!userId) {
    res.status(401).json({ error: "Unauthorized", userMessage: "Silakan login terlebih dahulu" });
    return;
  }
  
  // Get user from database
  const user = await getUserById(userId);
  
  if (!user) {
    // User ID in session but user doesn't exist in DB
    req.session.destroy(() => {});
    res.status(401).json({ error: "Unauthorized", userMessage: "Session tidak valid, silakan login kembali" });
    return;
  }
  
  // Attach user to request
  req.user = user;
  next();
}

/**
 * Middleware to require specific role
 * Usage: requireRole("admin") or requireRole("full_admin")
 */
export function requireRole(...allowedRoles: Array<User["role"]>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", userMessage: "Silakan login terlebih dahulu" });
      return;
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: "Forbidden", 
        userMessage: `Akses ditolak. Diperlukan role: ${allowedRoles.join(" atau ")}` 
      });
      return;
    }
    
    next();
  };
}

/**
 * Middleware to check if user is Full Admin
 */
export const requireFullAdmin = requireRole("full_admin");

/**
 * Middleware to check if user is Admin or higher
 */
export const requireAdmin = requireRole("full_admin", "admin");

/**
 * Middleware to check if user is Auditor or higher
 */
export const requireAuditor = requireRole("full_admin", "admin", "auditor");

/**
 * Optional auth middleware - doesn't fail if not authenticated
 * Just attaches user to request if session exists
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.session?.userId;
  
  if (userId) {
    const user = await getUserById(userId);
    if (user) {
      req.user = user;
    }
  }
  
  next();
}
