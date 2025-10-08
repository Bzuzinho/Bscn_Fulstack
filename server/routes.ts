import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEscalaoSchema, insertPessoaSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Escaloes routes
  app.get('/api/escaloes', isAuthenticated, async (req, res) => {
    try {
      const escaloes = await storage.getEscaloes();
      res.json(escaloes);
    } catch (error) {
      console.error("Error fetching escaloes:", error);
      res.status(500).json({ message: "Failed to fetch escaloes" });
    }
  });

  app.post('/api/escaloes', isAuthenticated, async (req, res) => {
    try {
      const validated = insertEscalaoSchema.parse(req.body);
      const escalao = await storage.createEscalao(validated);
      res.status(201).json(escalao);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating escalao:", error);
      res.status(500).json({ message: "Failed to create escalao" });
    }
  });

  app.put('/api/escaloes/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertEscalaoSchema.partial().parse(req.body);
      const escalao = await storage.updateEscalao(id, validated);
      if (!escalao) {
        return res.status(404).json({ message: "Escalao not found" });
      }
      res.json(escalao);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating escalao:", error);
      res.status(500).json({ message: "Failed to update escalao" });
    }
  });

  app.delete('/api/escaloes/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEscalao(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting escalao:", error);
      res.status(500).json({ message: "Failed to delete escalao" });
    }
  });

  // Pessoas routes
  app.get('/api/pessoas', isAuthenticated, async (req, res) => {
    try {
      let pessoas = await storage.getPessoas();
      
      // Apply filters if provided
      if (req.query.tipo) {
        pessoas = pessoas.filter(p => p.tipo === req.query.tipo);
      }
      if (req.query.escalao) {
        const escalaoId = parseInt(req.query.escalao as string);
        pessoas = pessoas.filter(p => p.escalao === escalaoId);
      }
      
      res.json(pessoas);
    } catch (error) {
      console.error("Error fetching pessoas:", error);
      res.status(500).json({ message: "Failed to fetch pessoas" });
    }
  });

  app.get('/api/pessoas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pessoa = await storage.getPessoa(id);
      if (!pessoa) {
        return res.status(404).json({ message: "Pessoa not found" });
      }
      res.json(pessoa);
    } catch (error) {
      console.error("Error fetching pessoa:", error);
      res.status(500).json({ message: "Failed to fetch pessoa" });
    }
  });

  app.post('/api/pessoas', isAuthenticated, async (req, res) => {
    try {
      const validated = insertPessoaSchema.parse(req.body);
      const pessoa = await storage.createPessoa(validated);
      res.status(201).json(pessoa);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating pessoa:", error);
      res.status(500).json({ message: "Failed to create pessoa" });
    }
  });

  app.put('/api/pessoas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertPessoaSchema.partial().parse(req.body);
      const pessoa = await storage.updatePessoa(id, validated);
      if (!pessoa) {
        return res.status(404).json({ message: "Pessoa not found" });
      }
      res.json(pessoa);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating pessoa:", error);
      res.status(500).json({ message: "Failed to update pessoa" });
    }
  });

  app.delete('/api/pessoas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePessoa(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting pessoa:", error);
      res.status(500).json({ message: "Failed to delete pessoa" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
