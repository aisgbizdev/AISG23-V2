import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAuditSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import gemini from "./gemini";
import openai from "./openai";
import { generateKnowledgeBasedResponse } from "./knowledge-base";
import { generateAuditPDF } from "./pdf-generator";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/audit - Create new audit and return results
  app.post("/api/audit", async (req, res) => {
    try {
      const validated = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit(validated);
      
      // Return audit with all calculated results
      res.json({
        auditId: audit.id,
        zonaKinerja: audit.zonaKinerja,
        zonaPerilaku: audit.zonaPerilaku,
        profil: audit.profil,
        magicSection: audit.magicSection,
        prodemRekomendasi: audit.prodemRekomendasi
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          error: "Validation error", 
          details: validationError.message 
        });
      } else {
        console.error("Error creating audit:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // GET /api/audits - Get all audits
  app.get("/api/audits", async (req, res) => {
    try {
      const allAudits = await storage.getAllAudits();
      res.json(allAudits);
    } catch (error) {
      console.error("Error fetching audits:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/audit/:id - Get single audit by ID
  app.get("/api/audit/:id", async (req, res) => {
    try {
      const audit = await storage.getAudit(req.params.id);
      
      if (!audit) {
        res.status(404).json({ error: "Audit not found" });
        return;
      }
      
      res.json(audit);
    } catch (error) {
      console.error("Error fetching audit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/chat - Send chat message and get AI response
  // 3-Source AI System: ChatGPT (OpenAI) → Gemini → Internal Knowledge Base
  app.post("/api/chat", async (req, res) => {
    try {
      const schema = z.object({
        auditId: z.string(),
        message: z.string().min(1)
      });
      
      const { auditId, message } = schema.parse(req.body);
      
      const audit = await storage.getAudit(auditId);
      if (!audit) {
        res.status(404).json({ error: "Audit not found" });
        return;
      }
      
      await storage.createChatMessage({
        auditId,
        role: "user",
        content: message
      });
      
      const history = await storage.getChatHistory(auditId);
      
      const systemPrompt = `Anda adalah AI coach profesional untuk AiSG (Audit Intelligence System Growth). Anda membantu karyawan memahami hasil audit performa mereka.

DATA AUDIT:
- Nama: ${audit.nama}
- Jabatan: ${audit.jabatan}
- Reality Score: ${audit.totalRealityScore}/90
- Profil: ${audit.profil}
- Zona: ${audit.zonaFinal}
- ProDem: ${audit.prodemRekomendasi.recommendation}

TUGAS ANDA:
1. Jawab pertanyaan tentang hasil audit dengan jelas dan supportif
2. Berikan insight actionable berdasarkan data audit
3. Motivasi karyawan untuk improve dengan tone profesional namun friendly
4. Jika ditanya tentang strategi improvement, refer ke Action Plan 30-60-90 dalam audit report
5. Gunakan Bahasa Indonesia yang profesional

Jawab dengan concise (2-3 paragraf max), fokus pada value bukan panjang teks.`;

      let aiResponse = "";
      let sourceUsed = "";

      // SOURCE 1: Try OpenAI ChatGPT first (primary)
      try {
        console.log("[CHAT] 🎯 Attempting Source 1: OpenAI ChatGPT...");
        
        const openaiMessages = [
          { role: "system" as const, content: systemPrompt },
          ...history.slice(-10).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content
          })),
          { role: "user" as const, content: message }
        ];

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: openaiMessages,
          temperature: 0.7,
          max_tokens: 500,
        });

        const responseText = completion.choices[0]?.message?.content;
        
        if (responseText && responseText.trim().length > 0) {
          aiResponse = responseText.trim();
          sourceUsed = "ChatGPT";
          console.log("[CHAT] ✅ Source 1 SUCCESS: OpenAI ChatGPT responded");
        } else {
          throw new Error("OpenAI returned empty response");
        }
      } catch (openaiError) {
        console.log("[CHAT] ❌ Source 1 FAILED: OpenAI error -", openaiError instanceof Error ? openaiError.message : String(openaiError));
        
        // SOURCE 2: Try Gemini as fallback (secondary)
        try {
          console.log("[CHAT] 🎯 Attempting Source 2: Google Gemini...");
          
          const chatHistory = history.slice(-10).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
          }));
          
          const result = await gemini.models.generateContent({
            model: "gemini-2.0-flash-exp",
            systemInstruction: systemPrompt,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
            contents: [
              ...chatHistory,
              {
                role: "user",
                parts: [{ text: message }]
              }
            ]
          });
          
          const geminiText = result.response?.text();
          
          if (geminiText && geminiText.trim().length > 0) {
            aiResponse = geminiText.trim();
            sourceUsed = "Gemini";
            console.log("[CHAT] ✅ Source 2 SUCCESS: Gemini responded");
          } else {
            throw new Error("Gemini returned empty response");
          }
        } catch (geminiError) {
          console.log("[CHAT] ❌ Source 2 FAILED: Gemini error -", geminiError instanceof Error ? geminiError.message : String(geminiError));
          
          // SOURCE 3: Use Internal Knowledge Base as last resort (tertiary)
          console.log("[CHAT] 🎯 Attempting Source 3: Internal Knowledge Base...");
          aiResponse = generateKnowledgeBasedResponse(message, audit);
          sourceUsed = "Knowledge Base";
          console.log("[CHAT] ✅ Source 3 SUCCESS: Knowledge Base responded");
        }
      }
      
      // Add source indicator to response
      const finalResponse = `${aiResponse}\n\n_[Answered by: ${sourceUsed}]_`;
      
      await storage.createChatMessage({
        auditId,
        role: "assistant",
        content: finalResponse
      });
      
      res.json({ response: finalResponse, source: sourceUsed });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ error: "Validation error", details: validationError.message });
      } else {
        console.error("Error in chat:", error);
        res.status(500).json({ 
          error: "Internal server error",
          userMessage: "Maaf, terjadi kesalahan sistem. Silakan coba lagi." 
        });
      }
    }
  });

  // GET /api/chat/:auditId - Get chat history for audit
  app.get("/api/chat/:auditId", async (req, res) => {
    try {
      const history = await storage.getChatHistory(req.params.auditId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // DELETE /api/chat/:auditId - Clear chat history
  app.delete("/api/chat/:auditId", async (req, res) => {
    try {
      await storage.deleteChatHistory(req.params.auditId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chat history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/audit/:id/pdf - Download audit as PDF
  app.get("/api/audit/:id/pdf", async (req, res) => {
    try {
      const audit = await storage.getAudit(req.params.id);
      
      if (!audit) {
        res.status(404).json({ error: "Audit not found" });
        return;
      }
      
      const doc = generateAuditPDF(audit);
      const filename = `audit-${audit.nama.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      
      doc.pipe(res);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // DELETE /api/audit/:id - Delete an audit
  app.delete("/api/audit/:id", async (req, res) => {
    try {
      const audit = await storage.getAudit(req.params.id);
      
      if (!audit) {
        res.status(404).json({ error: "Audit not found" });
        return;
      }
      
      await storage.deleteAudit(req.params.id);
      res.json({ success: true, message: "Audit deleted successfully" });
    } catch (error) {
      console.error("Error deleting audit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
