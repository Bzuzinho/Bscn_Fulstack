import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { pool } from "./db.ts";
import { setupAuth, isAuthenticated } from "./replitAuth.ts";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage.ts";
import { ObjectPermission } from "./objectAcl.ts";
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
      try {
        const user = await storage.getUser(userId);
        if (user) return res.json(user);
      } catch (err) {
        console.error('storage.getUser failed, falling back to raw query', err);
      }

      // fallback: try a simple raw query selecting common columns
      try {
        const q = await pool.query('SELECT id, email, name FROM users WHERE id = $1 LIMIT 1', [userId]);
        const row = q.rows[0];
        if (row) return res.json(row);
      } catch (err) {
        console.error('raw user query failed', err);
      }

      // final fallback: return the minimal session info
      return res.json({ id: userId });
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
      
      // (legacy filters removed) If you need filtering by type or escalao
      // reintroduce here after adding the appropriate columns to the `pessoas` table.
      
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
      // Accept both legacy `pessoa` shape and the user-form shape used by the UI.
      const body = req.body ?? {};

      // Map UI/user fields to the `pessoas` table column names (telemovel, cp, data_nascimento)
      const mapped = {
        nome: body.name || body.nome,
        email: body.email || null,
        telemovel: body.contacto || body.telemovel || null,
        data_nascimento: body.dataNascimento || body.data_nascimento || null,
        nif: body.nif || null,
        morada: body.morada || null,
        cp: body.codigoPostal || body.cp || null,
        localidade: body.localidade || null,
        sexo: body.sexo || null,
      } as any;

      const validated = insertPessoaSchema.parse(mapped);
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
      // Permission check: only admin, the pessoa itself, or its encarregado may update
  const sessionUserId = (req.user as any)?.claims?.sub || (req.user as any)?.id;
  const existingPessoa = await storage.getPessoa(id);
      if (!existingPessoa) return res.status(404).json({ message: "Pessoa not found" });

  const isAdmin = ((req.user as any)?.claims?.role || "").toString().toLowerCase() === "admin";
  const isSelf = String(sessionUserId) === String((existingPessoa as any).userId ?? (existingPessoa as any).id);
  // Also allow if there exists an entry in encarregado_user linking this pessoa -> session user
  let isEncarregado = String(sessionUserId) === String((existingPessoa as any).encarregado_id ?? (existingPessoa as any).encarregadoId ?? "");
  try {
    const q = await pool.query('SELECT 1 FROM encarregado_user WHERE user_id = $1 AND encarregado_id = $2 LIMIT 1', [id, sessionUserId]);
    if (q && q.rowCount && q.rowCount > 0) isEncarregado = true;
  } catch (err) {
    // If the table doesn't exist or query fails, silently ignore - fallback to single-field check
    console.error('encarregado_user check failed', err);
  }

      if (!isAdmin && !isSelf && !isEncarregado) {
        return res.status(403).json({ message: 'Forbidden' });
      }

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
        atividades = atividades.filter(a => (a as any).tipo === req.query.tipo);
      }
      if (req.query.data) {
        atividades = atividades.filter(a => (a as any).data === req.query.data);
      }
      
      // Get all presencas to calculate participant counts. The current DB
      // schema doesn't always include an explicit `atividadeId` on presencas,
      // so compute a safe participant count based on the `presenca` flag.
      const allPresencas = await storage.getPresencas();

      // Add participant count to each activity (best-effort using presenca)
      const atividadesWithCounts = atividades.map(atividade => {
        const presencas = allPresencas.filter(p => (p as any).presenca === true);
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

  // Roles (tipo_membro) - lightweight endpoints
  app.get('/api/roles', isAuthenticated, async (req, res) => {
    try {
      const q = await pool.query('SELECT id, name FROM roles ORDER BY name');
      res.json(q.rows);
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).json({ message: 'Failed to fetch roles' });
    }
  });

  // Get roles for a specific user
  app.get('/api/users/:id/roles', isAuthenticated, async (req, res) => {
    try {
      const userId = String(req.params.id);
      const q = await pool.query(`SELECT r.id, r.name FROM model_has_roles m JOIN roles r ON r.id = m.role_id WHERE m.model_id = $1`, [userId]);
      res.json(q.rows.map((r: any) => r.name));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      res.status(500).json({ message: 'Failed to fetch user roles' });
    }
  });

  // Set roles for a specific user (admin only)
  app.put('/api/users/:id/roles', isAuthenticated, async (req, res) => {
    try {
      const actorRole = ((req.user as any)?.claims?.role || "").toString().toLowerCase();
      if (actorRole !== 'admin') return res.status(403).json({ message: 'Only admin can set roles' });
      const userId = String(req.params.id);
      const rolesToSet: number[] = Array.isArray(req.body) ? req.body : [];
      // Replace existing model_has_roles entries for this user
      await pool.query('DELETE FROM model_has_roles WHERE model_id = $1', [userId]);
      for (const roleId of rolesToSet) {
        await pool.query('INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES ($1, $2, $3)', [roleId, 'users', userId]);
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error setting user roles:', error);
      res.status(500).json({ message: 'Failed to set user roles' });
    }
  });

  // List users that are guardians (role 'encarregado') or listed in model_has_roles
  app.get('/api/encarregados', isAuthenticated, async (req, res) => {
    try {
      const q = await pool.query(`
        SELECT u.* FROM users u
        WHERE u.role = $1 OR EXISTS (
          SELECT 1 FROM model_has_roles m JOIN roles r ON r.id = m.role_id WHERE m.model_id = u.id::text AND r.name = $1
        )
      `, ['encarregado']);
      res.json(q.rows);
    } catch (error) {
      console.error('Error fetching encarregados:', error);
      res.status(500).json({ message: 'Failed to fetch encarregados' });
    }
  });

  // List minors (users where menor = true)
  app.get('/api/minors', isAuthenticated, async (req, res) => {
    try {
      const q = await pool.query(`SELECT * FROM users WHERE menor = true`);
      res.json(q.rows);
    } catch (error) {
      console.error('Error fetching minors:', error);
      res.status(500).json({ message: 'Failed to fetch minors' });
    }
  });

  // Create an encarregado_user relation (link guardian -> educando)
  app.post('/api/encarregado_user', isAuthenticated, async (req, res) => {
    try {
      const { userId, encarregadoId } = req.body || {};
      if (!userId || !encarregadoId) return res.status(400).json({ message: 'userId and encarregadoId required' });
      const insert = await pool.query('INSERT INTO encarregado_user (user_id, encarregado_id, created_at, updated_at) VALUES ($1, $2, now(), now()) RETURNING *', [userId, encarregadoId]);
      res.status(201).json(insert.rows[0]);
    } catch (error) {
      console.error('Error creating encarregado_user:', error);
      res.status(500).json({ message: 'Failed to create encarregado_user' });
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
        presencas = presencas.filter(p => (p as any).atividadeId === atividadeId);
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
        // pessoas.id may be bigint while mensalidade.pessoaId is an integer;
        // compare via string to avoid bigint/number mismatch.
        const pessoa = pessoas.find(p => String(p.id) === String(mensalidade.pessoaId));
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

  // Dados Desportivos routes
  app.get('/api/users/:id/dados-desportivos', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.getDadosDesportivos(req.params.id);
      res.json(dados || {});
    } catch (error) {
      console.error("Error fetching dados desportivos:", error);
      res.status(500).json({ message: "Failed to fetch dados desportivos" });
    }
  });

  app.put('/api/users/:id/dados-desportivos', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.upsertDadosDesportivos({
        ...req.body,
        userId: req.params.id,
      });
      res.json(dados);
    } catch (error) {
      console.error("Error updating dados desportivos:", error);
      res.status(500).json({ message: "Failed to update dados desportivos" });
    }
  });

  // Aliases for legacy clients that call /api/pessoas/:id/... keep compatibility
  app.get('/api/pessoas/:id/dados-desportivos', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.getDadosDesportivos(String(req.params.id));
      res.json(dados || {});
    } catch (error) {
      console.error('Error fetching dados desportivos (alias):', error);
      res.status(500).json({ message: 'Failed to fetch dados desportivos' });
    }
  });

  app.put('/api/pessoas/:id/dados-desportivos', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.upsertDadosDesportivos({ ...(req.body || {}), userId: String(req.params.id) });
      res.json(dados);
    } catch (error) {
      console.error('Error updating dados desportivos (alias):', error);
      res.status(500).json({ message: 'Failed to update dados desportivos' });
    }
  });

  // Dados Configuracao routes
  app.get('/api/users/:id/dados-configuracao', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.getDadosConfiguracao(req.params.id);
      res.json(dados || {});
    } catch (error) {
      console.error("Error fetching dados configuracao:", error);
      res.status(500).json({ message: "Failed to fetch dados configuracao" });
    }
  });

  app.put('/api/users/:id/dados-configuracao', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.upsertDadosConfiguracao({
        ...req.body,
        userId: req.params.id,
      });
      res.json(dados);
    } catch (error) {
      console.error("Error updating dados configuracao:", error);
      res.status(500).json({ message: "Failed to update dados configuracao" });
    }
  });

  // Dados Financeiros routes (basic upsert to dados_financeiros)
  app.get('/api/users/:id/dados-financeiros', isAuthenticated, async (req, res) => {
    try {
      const q = await pool.query('SELECT * FROM dados_financeiros WHERE user_id = $1 LIMIT 1', [String(req.params.id)]);
      res.json(q.rows[0] || {});
    } catch (error) {
      console.error('Error fetching dados financeiros:', error);
      res.status(500).json({ message: 'Failed to fetch dados financeiros' });
    }
  });

  app.put('/api/users/:id/dados-financeiros', isAuthenticated, async (req, res) => {
    try {
      const { mensalidadeId, estadoPagamento, numeroRecibo, referenciaPagamento } = req.body || {};
      // Upsert semantics: delete existing and insert new for simplicity
      await pool.query('DELETE FROM dados_financeiros WHERE user_id = $1', [String(req.params.id)]);
      const insert = await pool.query(
        'INSERT INTO dados_financeiros (user_id, mensalidade_id, estado_pagamento, numero_recibo, referencia_pagamento, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, now(), now()) RETURNING *',
        [String(req.params.id), mensalidadeId || null, estadoPagamento || null, numeroRecibo || null, referenciaPagamento || null]
      );
      res.json(insert.rows[0]);
    } catch (error) {
      console.error('Error updating dados financeiros:', error);
      res.status(500).json({ message: 'Failed to update dados financeiros' });
    }
  });

  // Password reset (dev) - no email delivery, returns success and logs action
  app.post('/api/users/:id/send-reset', isAuthenticated, async (req, res) => {
    try {
      const actor = (req.user as any)?.claims?.email || (req.user as any)?.claims?.sub;
      console.log(`Password reset requested for user ${req.params.id} by ${actor}`);
      // In production, integrate with email service. Here we just return success.
      res.json({ success: true, message: 'Password reset triggered (dev)' });
    } catch (error) {
      console.error('Error triggering password reset:', error);
      res.status(500).json({ message: 'Failed to trigger password reset' });
    }
  });

  // Alias for pessoas dados-configuracao
  app.get('/api/pessoas/:id/dados-configuracao', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.getDadosConfiguracao(String(req.params.id));
      res.json(dados || {});
    } catch (error) {
      console.error('Error fetching dados configuracao (alias):', error);
      res.status(500).json({ message: 'Failed to fetch dados configuracao' });
    }
  });

  app.put('/api/pessoas/:id/dados-configuracao', isAuthenticated, async (req, res) => {
    try {
      const dados = await storage.upsertDadosConfiguracao({ ...(req.body || {}), userId: String(req.params.id) });
      res.json(dados);
    } catch (error) {
      console.error('Error updating dados configuracao (alias):', error);
      res.status(500).json({ message: 'Failed to update dados configuracao' });
    }
  });

  // Treinos routes
  app.get('/api/users/:id/treinos', isAuthenticated, async (req, res) => {
    try {
      const treinos = await storage.getTreinos(req.params.id);
      res.json(treinos);
    } catch (error) {
      console.error("Error fetching treinos:", error);
      res.status(500).json({ message: "Failed to fetch treinos" });
    }
  });

  // Resultados routes
  app.get('/api/users/:id/resultados', isAuthenticated, async (req, res) => {
    try {
      const resultados = await storage.getResultados(req.params.id);
      res.json(resultados);
    } catch (error) {
      console.error("Error fetching resultados:", error);
      res.status(500).json({ message: "Failed to fetch resultados" });
    }
  });

  // User faturas route (already exists via /api/faturas?userId=X, but adding specific route)
  app.get('/api/users/:id/faturas', isAuthenticated, async (req, res) => {
    try {
      const faturas = await storage.getFaturasWithUser(req.params.id);
      res.json(faturas);
    } catch (error) {
      console.error("Error fetching user faturas:", error);
      res.status(500).json({ message: "Failed to fetch faturas" });
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

  // Object Storage routes - Referenced from blueprint:javascript_object_storage
  // Get upload URL for profile image
  // Debug endpoints (only enabled in development when DISABLE_REPLIT_AUTH=true)
  if (process.env.DISABLE_REPLIT_AUTH === 'true') {
    app.post("/api/debug/objects/upload", async (_req, res) => {
      try {
        const objectStorageService = new ObjectStorageService();
        const uploadURL = await objectStorageService.getObjectEntityUploadURL();
        console.log("/api/debug/objects/upload -> uploadURL:", uploadURL);
        res.json({ uploadURL });
      } catch (error) {
        console.error("Error getting debug upload URL:", error);
        res.status(500).json({ message: "Failed to get upload URL (debug)" });
      }
    });

    app.put("/api/debug/profile-images", async (req, res) => {
      try {
        const rawPath = req.body?.profileImageUrl;
        if (!rawPath) return res.status(400).json({ error: "profileImageUrl is required" });
        const objectStorageService = new ObjectStorageService();
        const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(rawPath, {
          owner: req.body?.owner || "debug",
          visibility: "public",
        });
        console.log("/api/debug/profile-images -> objectPath:", objectPath);
        res.json({ objectPath });
      } catch (error) {
        console.error("Error in debug profile-image path:", error);
        res.status(500).json({ error: "Internal server error (debug)" });
      }
    });

    // Dev helper: set a user's profileImageUrl directly in the DB (development only)
    app.post('/api/debug/set-profile-image', async (req, res) => {
      try {
        const { userId, profileImageUrl } = req.body || {};
        if (!userId || !profileImageUrl) return res.status(400).json({ error: 'userId and profileImageUrl are required' });
        // Normalize local-upload fallback URLs to the public-serving path.
        let finalUrl = profileImageUrl as string;
        try {
          // remove origin if present
          const origin = process.env.SERVER_ORIGIN || `http://localhost:${process.env.PORT || 3000}`;
          if (finalUrl.startsWith(origin)) {
            finalUrl = finalUrl.slice(origin.length);
          }
        } catch (e) {
          // ignore
        }

        // Convert `/local-uploads-upload/<id>` -> `/local-uploads/<id>`
        finalUrl = finalUrl.replace('/local-uploads-upload/', '/local-uploads/').replace('/local-uploads-upload', '/local-uploads');

        // Ensure we persist an absolute URL so clients can fetch it directly.
        const serverOrigin = process.env.SERVER_ORIGIN || `http://localhost:${process.env.PORT || 3000}`;
        const absoluteUrl = finalUrl.startsWith('/') ? `${serverOrigin}${finalUrl}` : finalUrl;

        const updated = await storage.updateUser(String(userId), { profileImageUrl: absoluteUrl });
        return res.json({ success: true, updated });
      } catch (err) {
        console.error('Error in debug set-profile-image:', err);
        return res.status(500).json({ error: 'internal error' });
      }
    });
  }

  // Local dev upload receiver (accept PUT so local signed URLs can target this)
  // This endpoint stores uploaded bytes under ./tmp/local-uploads/<id>
  app.put('/local-uploads-upload/:id', async (req, res) => {
    try {
      const id = req.params.id;
      console.log('local upload handler invoked for id=', id, 'headers=', {
        length: req.headers['content-length'],
        type: req.headers['content-type'],
        origin: req.headers['origin'],
      });
      const fsPromises = await import('fs/promises');
      const dirPath = `/tmp/local-uploads`;
      await fsPromises.mkdir(dirPath, { recursive: true });
      const filePath = `${dirPath}/${id}`;
      const fs = await import('fs');
      const writeStream = fs.createWriteStream(filePath);
      // Pipe request into the file write stream and listen for finish/error on the stream
      req.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log('local upload finished for id=', id, 'savedTo=', filePath);
        res.status(200).json({ path: `/local-uploads/${id}` });
      });
      writeStream.on('error', (err: any) => {
        console.error('local upload stream error for id=', id, err);
        try {
          if (!res.headersSent) res.status(500).json({ error: 'upload failed' });
        } catch (_) {}
      });
    } catch (error) {
      console.error('Error handling local upload:', error);
      res.status(500).json({ error: 'internal error' });
    }
  });

  // Alias under /api so dev frontends can PUT to a relative /api URL (proxed by Vite)
  app.put('/api/local-uploads-upload/:id', async (req, res) => {
    try {
      const id = req.params.id;
      console.log('api local upload handler invoked for id=', id, 'headers=', {
        length: req.headers['content-length'],
        type: req.headers['content-type'],
        origin: req.headers['origin'],
      });
      const fsPromises = await import('fs/promises');
      const dirPath = `/tmp/local-uploads`;
      await fsPromises.mkdir(dirPath, { recursive: true });
      const filePath = `${dirPath}/${id}`;
      const fs = await import('fs');
      const writeStream = fs.createWriteStream(filePath);
      req.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log('api local upload finished for id=', id, 'savedTo=', filePath);
        res.status(200).json({ path: `/local-uploads/${id}` });
      });
      writeStream.on('error', (err: any) => {
        console.error('api local upload stream error for id=', id, err);
        try {
          if (!res.headersSent) res.status(500).json({ error: 'upload failed' });
        } catch (_) {}
      });
    } catch (error) {
      console.error('Error handling api local upload:', error);
      res.status(500).json({ error: 'internal error' });
    }
  });

  // Serve local uploaded files in development
  app.get('/local-uploads/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const fsPromises = await import('fs/promises');
      const filePath = `/tmp/local-uploads/${id}`;
      try {
        await fsPromises.access(filePath);
      } catch (e) {
        return res.sendStatus(404);
      }
      res.sendFile(filePath);
    } catch (error) {
      console.error('Error serving local upload:', error);
      res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      console.log("/api/objects/upload -> uploadURL:", uploadURL);
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req, res) => {
    const userId = (req as any).user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Update profile image
  app.put("/api/profile-images", isAuthenticated, async (req, res) => {
    const userId = (req as any).user?.claims?.sub;
    
    if (!req.body.profileImageUrl) {
      return res.status(400).json({ error: "profileImageUrl is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.profileImageUrl,
        {
          owner: userId,
          visibility: "public", // Profile images are public
        },
      );

      // Update user's profileImageUrl in database
      await storage.updateUser(userId, { profileImageUrl: objectPath });

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting profile image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
