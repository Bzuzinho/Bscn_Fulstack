import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertEscalaoSchema,
  insertPessoaSchema,
  insertAtividadeSchema,
  insertPresencaSchema,
  insertMensalidadeSchema,
  insertFaturaSchema,
  insertTipoMensalidadeSchema,
  insertCentroCustoSchema,
  upsertUserSchema,
} from "@shared/schema";
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

  // Atividades routes
  app.get('/api/atividades', isAuthenticated, async (req, res) => {
    try {
      let atividades = await storage.getAtividades();
      
      // Apply filters if provided
      if (req.query.tipo) {
        atividades = atividades.filter(a => a.tipo === req.query.tipo);
      }
      if (req.query.data) {
        atividades = atividades.filter(a => a.data === req.query.data);
      }
      
      // Get all presencas to calculate participant counts
      const allPresencas = await storage.getPresencas();
      
      // Add participant count to each activity
      const atividadesWithCounts = atividades.map(atividade => {
        const presencas = allPresencas.filter(p => p.atividadeId === atividade.id && p.presente);
        return {
          ...atividade,
          participantsCount: presencas.length
        };
      });
      
      res.json(atividadesWithCounts);
    } catch (error) {
      console.error("Error fetching atividades:", error);
      res.status(500).json({ message: "Failed to fetch atividades" });
    }
  });

  app.get('/api/atividades/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const atividade = await storage.getAtividade(id);
      if (!atividade) {
        return res.status(404).json({ message: "Atividade not found" });
      }
      res.json(atividade);
    } catch (error) {
      console.error("Error fetching atividade:", error);
      res.status(500).json({ message: "Failed to fetch atividade" });
    }
  });

  app.post('/api/atividades', isAuthenticated, async (req, res) => {
    try {
      const validated = insertAtividadeSchema.parse(req.body);
      const atividade = await storage.createAtividade(validated);
      res.status(201).json(atividade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating atividade:", error);
      res.status(500).json({ message: "Failed to create atividade" });
    }
  });

  app.put('/api/atividades/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertAtividadeSchema.partial().parse(req.body);
      const atividade = await storage.updateAtividade(id, validated);
      if (!atividade) {
        return res.status(404).json({ message: "Atividade not found" });
      }
      res.json(atividade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating atividade:", error);
      res.status(500).json({ message: "Failed to update atividade" });
    }
  });

  app.delete('/api/atividades/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAtividade(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting atividade:", error);
      res.status(500).json({ message: "Failed to delete atividade" });
    }
  });

  // Presencas routes
  app.get('/api/presencas', isAuthenticated, async (req, res) => {
    try {
      let presencas = await storage.getPresencas();
      
      // Apply filters if provided
      if (req.query.atividadeId) {
        const atividadeId = parseInt(req.query.atividadeId as string);
        presencas = presencas.filter(p => p.atividadeId === atividadeId);
      }
      if (req.query.pessoaId) {
        const pessoaId = parseInt(req.query.pessoaId as string);
        presencas = presencas.filter(p => p.pessoaId === pessoaId);
      }
      
      res.json(presencas);
    } catch (error) {
      console.error("Error fetching presencas:", error);
      res.status(500).json({ message: "Failed to fetch presencas" });
    }
  });

  app.get('/api/presencas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const presenca = await storage.getPresenca(id);
      if (!presenca) {
        return res.status(404).json({ message: "Presenca not found" });
      }
      res.json(presenca);
    } catch (error) {
      console.error("Error fetching presenca:", error);
      res.status(500).json({ message: "Failed to fetch presenca" });
    }
  });

  app.post('/api/presencas', isAuthenticated, async (req, res) => {
    try {
      const validated = insertPresencaSchema.parse(req.body);
      const presenca = await storage.createPresenca(validated);
      res.status(201).json(presenca);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating presenca:", error);
      res.status(500).json({ message: "Failed to create presenca" });
    }
  });

  app.put('/api/presencas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertPresencaSchema.partial().parse(req.body);
      const presenca = await storage.updatePresenca(id, validated);
      if (!presenca) {
        return res.status(404).json({ message: "Presenca not found" });
      }
      res.json(presenca);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating presenca:", error);
      res.status(500).json({ message: "Failed to update presenca" });
    }
  });

  app.delete('/api/presencas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePresenca(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting presenca:", error);
      res.status(500).json({ message: "Failed to delete presenca" });
    }
  });

  // Mensalidades routes
  app.get('/api/mensalidades/stats', isAuthenticated, async (req, res) => {
    try {
      const mensalidades = await storage.getMensalidades();
      const pessoas = await storage.getPessoas();
      
      // Calculate statistics
      const totalReceita = mensalidades
        .filter(m => m.status === 'pago')
        .reduce((sum, m) => sum + Number(m.valor), 0);
      
      const pendentes = mensalidades.filter(m => m.status === 'pendente');
      const totalPendente = pendentes.reduce((sum, m) => sum + Number(m.valor), 0);
      
      const atrasadas = mensalidades.filter(m => m.status === 'atrasado');
      const totalAtrasado = atrasadas.reduce((sum, m) => sum + Number(m.valor), 0);
      
      const taxaPagamento = mensalidades.length > 0 
        ? (mensalidades.filter(m => m.status === 'pago').length / mensalidades.length) * 100 
        : 0;
      
      res.json({
        totalReceita,
        totalPendente,
        totalAtrasado,
        countPendentes: pendentes.length,
        countAtrasadas: atrasadas.length,
        taxaPagamento: Math.round(taxaPagamento * 10) / 10,
      });
    } catch (error) {
      console.error("Error fetching mensalidades stats:", error);
      res.status(500).json({ message: "Failed to fetch mensalidades stats" });
    }
  });

  app.get('/api/mensalidades', isAuthenticated, async (req, res) => {
    try {
      let mensalidades = await storage.getMensalidades();
      const pessoas = await storage.getPessoas();
      
      // Apply filters if provided
      if (req.query.pessoaId) {
        const pessoaId = parseInt(req.query.pessoaId as string);
        mensalidades = mensalidades.filter(m => m.pessoaId === pessoaId);
      }
      if (req.query.mes) {
        const mes = parseInt(req.query.mes as string);
        mensalidades = mensalidades.filter(m => m.mes === mes);
      }
      if (req.query.ano) {
        const ano = parseInt(req.query.ano as string);
        mensalidades = mensalidades.filter(m => m.ano === ano);
      }
      if (req.query.status) {
        mensalidades = mensalidades.filter(m => m.status === req.query.status);
      }
      
      // Add pessoa details to each mensalidade
      const mensalidadesWithPessoa = mensalidades.map(mensalidade => {
        const pessoa = pessoas.find(p => p.id === mensalidade.pessoaId);
        return {
          ...mensalidade,
          pessoaNome: pessoa?.nome || 'Desconhecido',
        };
      });
      
      res.json(mensalidadesWithPessoa);
    } catch (error) {
      console.error("Error fetching mensalidades:", error);
      res.status(500).json({ message: "Failed to fetch mensalidades" });
    }
  });

  app.get('/api/mensalidades/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mensalidade = await storage.getMensalidade(id);
      if (!mensalidade) {
        return res.status(404).json({ message: "Mensalidade not found" });
      }
      res.json(mensalidade);
    } catch (error) {
      console.error("Error fetching mensalidade:", error);
      res.status(500).json({ message: "Failed to fetch mensalidade" });
    }
  });

  app.post('/api/mensalidades', isAuthenticated, async (req, res) => {
    try {
      const validated = insertMensalidadeSchema.parse(req.body);
      const mensalidade = await storage.createMensalidade(validated);
      res.status(201).json(mensalidade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating mensalidade:", error);
      res.status(500).json({ message: "Failed to create mensalidade" });
    }
  });

  app.put('/api/mensalidades/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertMensalidadeSchema.partial().parse(req.body);
      const mensalidade = await storage.updateMensalidade(id, validated);
      if (!mensalidade) {
        return res.status(404).json({ message: "Mensalidade not found" });
      }
      res.json(mensalidade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating mensalidade:", error);
      res.status(500).json({ message: "Failed to update mensalidade" });
    }
  });

  app.delete('/api/mensalidades/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMensalidade(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting mensalidade:", error);
      res.status(500).json({ message: "Failed to delete mensalidade" });
    }
  });

  // Users/Atletas routes (NEW SYSTEM)
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      const filters: any = {};
      if (req.query.escalaoId) filters.escalaoId = parseInt(req.query.escalaoId as string);
      if (req.query.estado) filters.estado = req.query.estado;
      
      const users = await storage.getUsers(filters);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/users', isAuthenticated, async (req, res) => {
    try {
      // Convert empty strings to null for optional fields
      const sanitized = {
        ...req.body,
        dataNascimento: req.body.dataNascimento === "" ? null : req.body.dataNascimento,
        email: req.body.email === "" ? null : req.body.email,
        contacto: req.body.contacto === "" ? null : req.body.contacto,
        nif: req.body.nif === "" ? null : req.body.nif,
        morada: req.body.morada === "" ? null : req.body.morada,
        codigoPostal: req.body.codigoPostal === "" ? null : req.body.codigoPostal,
        localidade: req.body.localidade === "" ? null : req.body.localidade,
        numeroSocio: req.body.numeroSocio === "" ? null : req.body.numeroSocio,
        observacoesConfig: req.body.observacoesConfig === "" ? null : req.body.observacoesConfig,
      };
      const validated = upsertUserSchema.parse(sanitized);
      const user = await storage.upsertUser(validated);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      // Convert empty strings to null for optional fields
      const sanitized = {
        ...req.body,
        dataNascimento: req.body.dataNascimento === "" ? null : req.body.dataNascimento,
        email: req.body.email === "" ? null : req.body.email,
        contacto: req.body.contacto === "" ? null : req.body.contacto,
        nif: req.body.nif === "" ? null : req.body.nif,
        morada: req.body.morada === "" ? null : req.body.morada,
        codigoPostal: req.body.codigoPostal === "" ? null : req.body.codigoPostal,
        localidade: req.body.localidade === "" ? null : req.body.localidade,
        numeroSocio: req.body.numeroSocio === "" ? null : req.body.numeroSocio,
        observacoesConfig: req.body.observacoesConfig === "" ? null : req.body.observacoesConfig,
      };
      const validated = upsertUserSchema.partial().parse(sanitized);
      const user = await storage.updateUser(req.params.id, validated);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Faturas routes (NEW SYSTEM)
  app.get('/api/faturas', isAuthenticated, async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const faturasWithUser = await storage.getFaturasWithUser(userId);
      res.json(faturasWithUser);
    } catch (error) {
      console.error("Error fetching faturas:", error);
      res.status(500).json({ message: "Failed to fetch faturas" });
    }
  });

  app.get('/api/faturas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const fatura = await storage.getFatura(id);
      if (!fatura) {
        return res.status(404).json({ message: "Fatura not found" });
      }
      res.json(fatura);
    } catch (error) {
      console.error("Error fetching fatura:", error);
      res.status(500).json({ message: "Failed to fetch fatura" });
    }
  });

  app.post('/api/faturas', isAuthenticated, async (req, res) => {
    try {
      const validated = insertFaturaSchema.parse(req.body);
      const fatura = await storage.createFatura(validated);
      res.status(201).json(fatura);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating fatura:", error);
      res.status(500).json({ message: "Failed to create fatura" });
    }
  });

  app.put('/api/faturas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertFaturaSchema.partial().parse(req.body);
      const fatura = await storage.updateFatura(id, validated);
      if (!fatura) {
        return res.status(404).json({ message: "Fatura not found" });
      }
      res.json(fatura);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating fatura:", error);
      res.status(500).json({ message: "Failed to update fatura" });
    }
  });

  app.delete('/api/faturas/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFatura(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting fatura:", error);
      res.status(500).json({ message: "Failed to delete fatura" });
    }
  });

  // Generate annual invoices
  app.post('/api/faturas/gerar-anuais', isAuthenticated, async (req, res) => {
    try {
      const { userId, epoca, dataInicio } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      const result = await storage.gerarFaturasAnuais(userId, epoca, dataInicio);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error generating annual faturas:", error);
      res.status(500).json({ message: "Failed to generate faturas" });
    }
  });

  // Mark invoice as paid
  app.put('/api/faturas/:id/pagar', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { numeroRecibo, referenciaPagamento } = req.body;
      await storage.marcarFaturaPaga(id, numeroRecibo, referenciaPagamento);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking fatura as paid:", error);
      res.status(500).json({ message: "Failed to mark fatura as paid" });
    }
  });

  // Tipos de Mensalidade routes
  app.get('/api/tipos-mensalidade', isAuthenticated, async (req, res) => {
    try {
      const tipos = await storage.getTiposMensalidade();
      res.json(tipos);
    } catch (error) {
      console.error("Error fetching tipos mensalidade:", error);
      res.status(500).json({ message: "Failed to fetch tipos mensalidade" });
    }
  });

  app.post('/api/tipos-mensalidade', isAuthenticated, async (req, res) => {
    try {
      const validated = insertTipoMensalidadeSchema.parse(req.body);
      const tipo = await storage.createTipoMensalidade(validated);
      res.status(201).json(tipo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating tipo mensalidade:", error);
      res.status(500).json({ message: "Failed to create tipo mensalidade" });
    }
  });

  // Centros de Custo routes
  app.get('/api/centros-custo', isAuthenticated, async (req, res) => {
    try {
      const centros = await storage.getCentrosCusto();
      res.json(centros);
    } catch (error) {
      console.error("Error fetching centros custo:", error);
      res.status(500).json({ message: "Failed to fetch centros custo" });
    }
  });

  app.post('/api/centros-custo', isAuthenticated, async (req, res) => {
    try {
      const validated = insertCentroCustoSchema.parse(req.body);
      const centro = await storage.createCentroCusto(validated);
      res.status(201).json(centro);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating centro custo:", error);
      res.status(500).json({ message: "Failed to create centro custo" });
    }
  });

  // Dashboard statistics endpoint
  app.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
