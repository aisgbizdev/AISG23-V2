/**
 * Authentication Routes for AiSG
 * Handles login, logout, register, user management
 */

import type { Express, Request, Response } from "express";
import { z } from "zod";
import { loginSchema, insertUserSchema } from "@shared/schema";
import { authenticateUser, createUser, getAllUsers, deleteUser, updateUserPassword } from "./auth";
import { requireAuth, requireFullAdmin, requireAdmin } from "./middleware";

export function registerAuthRoutes(app: Express) {
  /**
   * POST /api/auth/login
   * Login with username & password
   */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      // Validate input
      const { username, password } = loginSchema.parse(req.body);
      
      // Authenticate
      const user = await authenticateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          userMessage: "Username atau password salah" 
        });
      }
      
      // Set session
      req.session.userId = user.id;
      
      return res.json({ 
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          userMessage: error.errors[0].message,
          details: error.errors 
        });
      }
      
      console.error("Login error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        userMessage: "Terjadi kesalahan saat login" 
      });
    }
  });
  
  /**
   * POST /api/auth/logout
   * Logout current user
   */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ 
          error: "Logout failed",
          userMessage: "Gagal logout" 
        });
      }
      
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
  
  /**
   * GET /api/auth/me
   * Get current logged-in user
   */
  app.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
    return res.json({ user: req.user });
  });
  
  /**
   * POST /api/auth/register
   * Register new user (only Full Admin can do this)
   */
  app.post("/api/auth/register", requireAuth, requireFullAdmin, async (req: Request, res: Response) => {
    try {
      const createUserSchema = z.object({
        username: z.string().min(3, "Username minimal 3 karakter"),
        password: z.string().min(6, "Password minimal 6 karakter"),
        name: z.string().min(1, "Nama harus diisi"),
        email: z.string().email("Email tidak valid").optional(),
        role: z.enum(["full_admin", "admin", "auditor", "regular_user"]),
      });
      
      const userData = createUserSchema.parse(req.body);
      
      // Create user
      const user = await createUser(userData);
      
      // Return without password
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({ 
        success: true,
        user: userWithoutPassword,
        message: "User created successfully" 
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          userMessage: error.errors[0].message,
          details: error.errors 
        });
      }
      
      // Handle unique constraint violation (duplicate username)
      if (error.code === "23505") {
        return res.status(409).json({ 
          error: "Username already exists",
          userMessage: "Username sudah digunakan" 
        });
      }
      
      console.error("Register error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        userMessage: "Gagal membuat user baru" 
      });
    }
  });
  
  /**
   * GET /api/users
   * Get all users (Admin and Full Admin only)
   */
  app.get("/api/users", requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    try {
      const users = await getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        userMessage: "Gagal mengambil data users" 
      });
    }
  });
  
  /**
   * DELETE /api/users/:id
   * Delete user (Full Admin only)
   */
  app.delete("/api/users/:id", requireAuth, requireFullAdmin, async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      
      // Prevent deleting yourself
      if (userId === req.user?.id) {
        return res.status(400).json({ 
          error: "Cannot delete yourself",
          userMessage: "Tidak bisa menghapus akun sendiri" 
        });
      }
      
      await deleteUser(userId);
      
      return res.json({ 
        success: true,
        message: "User deleted successfully" 
      });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        userMessage: "Gagal menghapus user" 
      });
    }
  });
  
  /**
   * PUT /api/users/:id/password
   * Update user password (Full Admin or self)
   */
  app.put("/api/users/:id/password", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const { password } = z.object({ 
        password: z.string().min(6, "Password minimal 6 karakter") 
      }).parse(req.body);
      
      // Check permission: full admin can change anyone's password, others can only change their own
      if (req.user?.role !== "full_admin" && userId !== req.user?.id) {
        return res.status(403).json({ 
          error: "Forbidden",
          userMessage: "Anda hanya bisa mengubah password sendiri" 
        });
      }
      
      await updateUserPassword(userId, password);
      
      return res.json({ 
        success: true,
        message: "Password updated successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          userMessage: error.errors[0].message 
        });
      }
      
      console.error("Update password error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        userMessage: "Gagal mengubah password" 
      });
    }
  });
}
