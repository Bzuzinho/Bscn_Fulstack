import {
  users,
  pessoas,
  escaloes,
  atividades,
  presencas,
  presencasNovo,
  eventos,
  mensalidades,
  materiais,
  emprestimos,
  emails,
  faturas,
  faturaItens,
  tiposMensalidade,
  centrosCusto,
  dadosDesportivos,
  dadosConfiguracao,
  treinos,
  resultados,
  type User,
  type UpsertUser,
  type Pessoa,
  type InsertPessoa,
  type Escalao,
  type InsertEscalao,
  type Atividade,
  type InsertAtividade,
  type Presenca,
  type InsertPresenca,
  type Mensalidade,
  type InsertMensalidade,
  type Material,
  type InsertMaterial,
  type Emprestimo,
  type InsertEmprestimo,
  type Email,
  type InsertEmail,
  type Fatura,
  type TipoMensalidade,
  type CentroCusto,
  type DadosDesportivos,
  type DadosConfiguracao,
  type Treino,
  type Resultado,
  insertFaturaSchema,
  insertTipoMensalidadeSchema,
  insertCentroCustoSchema,
  insertDadosDesportivosSchema,
  insertDadosConfiguracaoSchema,
  insertTreinoSchema,
  insertResultadoSchema,
} from "@shared/schema";
import { db } from "./db.ts";
import { eq, and, sql as drizzleSql, gte, lte } from "drizzle-orm";
import { z } from "zod";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsers(filters?: { escalaoId?: number; estado?: string }): Promise<User[]>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  // Faturas operations
  getFaturas(userId?: string): Promise<Fatura[]>;
  getFaturasWithUser(userId?: string): Promise<any[]>;
  getFatura(id: number): Promise<Fatura | undefined>;
  getFaturaWithUser(id: number): Promise<any>;
  createFatura(fatura: z.infer<typeof insertFaturaSchema>): Promise<Fatura>;
  updateFatura(id: number, fatura: Partial<z.infer<typeof insertFaturaSchema>>): Promise<Fatura | undefined>;
  deleteFatura(id: number): Promise<void>;
  gerarFaturasAnuais(userId: string, epoca?: string, dataInicio?: string): Promise<any>;
  marcarFaturaPaga(id: number, numeroRecibo?: string, referencia?: string): Promise<boolean>;

  // Tipos de Mensalidade operations
  getTiposMensalidade(): Promise<TipoMensalidade[]>;
  getTipoMensalidade(id: number): Promise<TipoMensalidade | undefined>;
  createTipoMensalidade(tipo: z.infer<typeof insertTipoMensalidadeSchema>): Promise<TipoMensalidade>;
  updateTipoMensalidade(id: number, tipo: Partial<z.infer<typeof insertTipoMensalidadeSchema>>): Promise<TipoMensalidade | undefined>;
  deleteTipoMensalidade(id: number): Promise<void>;

  // Centros de Custo operations
  getCentrosCusto(): Promise<CentroCusto[]>;
  getCentroCusto(id: number): Promise<CentroCusto | undefined>;
  createCentroCusto(centro: z.infer<typeof insertCentroCustoSchema>): Promise<CentroCusto>;
  updateCentroCusto(id: number, centro: Partial<z.infer<typeof insertCentroCustoSchema>>): Promise<CentroCusto | undefined>;
  deleteCentroCusto(id: number): Promise<void>;
  
  // Dashboard Statistics
  getDashboardStats(): Promise<{
    totalAtletas: number;
    atividadesMes: number;
    receitaMensal: string;
    taxaPresenca: string;
  }>;

  // Dados Desportivos operations
  getDadosDesportivos(userId: string): Promise<DadosDesportivos | undefined>;
  upsertDadosDesportivos(dados: z.infer<typeof insertDadosDesportivosSchema>): Promise<DadosDesportivos>;

  // Dados Configuracao operations
  getDadosConfiguracao(userId: string): Promise<DadosConfiguracao | undefined>;
  upsertDadosConfiguracao(dados: z.infer<typeof insertDadosConfiguracaoSchema>): Promise<DadosConfiguracao>;

  // Treinos operations
  getTreinos(userId: string): Promise<Treino[]>;
  createTreino(treino: z.infer<typeof insertTreinoSchema>): Promise<Treino>;

  // Resultados operations
  getResultados(userId: string): Promise<Resultado[]>;
  createResultado(resultado: z.infer<typeof insertResultadoSchema>): Promise<Resultado>;

  // Pessoas operations (LEGACY - will be deprecated)
  getPessoas(): Promise<Pessoa[]>;
  getPessoa(id: number): Promise<Pessoa | undefined>;
  createPessoa(pessoa: InsertPessoa): Promise<Pessoa>;
  updatePessoa(id: number, pessoa: Partial<InsertPessoa>): Promise<Pessoa | undefined>;
  deletePessoa(id: number): Promise<void>;

  // Escaloes operations
  getEscaloes(): Promise<Escalao[]>;
  getEscalao(id: number): Promise<Escalao | undefined>;
  createEscalao(escalao: InsertEscalao): Promise<Escalao>;
  updateEscalao(id: number, escalao: Partial<InsertEscalao>): Promise<Escalao | undefined>;
  deleteEscalao(id: number): Promise<void>;

  // Atividades operations
  getAtividades(): Promise<Atividade[]>;
  getAtividade(id: number): Promise<Atividade | undefined>;
  createAtividade(atividade: InsertAtividade): Promise<Atividade>;
  updateAtividade(id: number, atividade: Partial<InsertAtividade>): Promise<Atividade | undefined>;
  deleteAtividade(id: number): Promise<void>;

  // Presencas operations
  getPresencas(atividadeId?: number): Promise<Presenca[]>;
  getPresenca(id: number): Promise<Presenca | undefined>;
  createPresenca(presenca: InsertPresenca): Promise<Presenca>;
  updatePresenca(id: number, presenca: Partial<InsertPresenca>): Promise<Presenca | undefined>;
  deletePresenca(id: number): Promise<void>;

  // Mensalidades operations
  getMensalidades(pessoaId?: number): Promise<Mensalidade[]>;
  getMensalidade(id: number): Promise<Mensalidade | undefined>;
  createMensalidade(mensalidade: InsertMensalidade): Promise<Mensalidade>;
  updateMensalidade(id: number, mensalidade: Partial<InsertMensalidade>): Promise<Mensalidade | undefined>;
  deleteMensalidade(id: number): Promise<void>;

  // Materiais operations
  getMateriais(): Promise<Material[]>;
  getMaterial(id: number): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material | undefined>;
  deleteMaterial(id: number): Promise<void>;

  // Emprestimos operations
  getEmprestimos(pessoaId?: number): Promise<Emprestimo[]>;
  getEmprestimo(id: number): Promise<Emprestimo | undefined>;
  createEmprestimo(emprestimo: InsertEmprestimo): Promise<Emprestimo>;
  updateEmprestimo(id: number, emprestimo: Partial<InsertEmprestimo>): Promise<Emprestimo | undefined>;
  deleteEmprestimo(id: number): Promise<void>;

  // Emails operations
  getEmails(): Promise<Email[]>;
  getEmail(id: number): Promise<Email | undefined>;
  createEmail(email: InsertEmail): Promise<Email>;
  updateEmail(id: number, email: Partial<InsertEmail>): Promise<Email | undefined>;
  deleteEmail(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsers(filters?: { escalaoId?: number; estado?: string }): Promise<User[]> {
    // Current DB users table (from Laravel migrations) only contains the core fields.
    // For now, ignore filters that reference legacy or expanded user fields and
    // return all users. We can later join with `pessoas` or extend the users table
    // if more filters are required.
    return db.select().from(users);
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Faturas operations
  async getFaturas(userId?: string): Promise<Fatura[]> {
    if (userId) {
      return db.select().from(faturas).where(eq(faturas.userId, userId));
    }
    return db.select().from(faturas);
  }

  async getFaturaWithUser(id: number): Promise<any> {
    const result = await db
      .select({
        fatura: faturas,
        user: users,
      })
      .from(faturas)
      .leftJoin(users, eq(faturas.userId, users.id))
      .where(eq(faturas.id, id))
      .limit(1);
    
    if (result.length === 0) return undefined;
    
    const { fatura, user } = result[0];
    return {
      ...fatura,
      userName: user?.name || user?.firstName + ' ' + user?.lastName || 'Desconhecido',
    };
  }

  async getFaturasWithUser(userId?: string): Promise<any[]> {
    const query = userId
      ? db
          .select({
            fatura: faturas,
            user: users,
          })
          .from(faturas)
          .leftJoin(users, eq(faturas.userId, users.id))
          .where(eq(faturas.userId, userId))
      : db
          .select({
            fatura: faturas,
            user: users,
          })
          .from(faturas)
          .leftJoin(users, eq(faturas.userId, users.id));

    const results = await query;
    
    return results.map(({ fatura, user }) => ({
      ...fatura,
      userName: user?.name || user?.firstName + ' ' + user?.lastName || 'Desconhecido',
    }));
  }

  async getFatura(id: number): Promise<Fatura | undefined> {
    const [fatura] = await db.select().from(faturas).where(eq(faturas.id, id));
    return fatura;
  }

  async createFatura(faturaData: z.infer<typeof insertFaturaSchema>): Promise<Fatura> {
    const [fatura] = await db.insert(faturas).values(faturaData).returning();
    return fatura;
  }

  async updateFatura(id: number, faturaData: Partial<z.infer<typeof insertFaturaSchema>>): Promise<Fatura | undefined> {
    const [updated] = await db
      .update(faturas)
      .set({ ...faturaData, updatedAt: new Date() })
      .where(eq(faturas.id, id))
      .returning();
    return updated;
  }

  async deleteFatura(id: number): Promise<void> {
    await db.delete(faturas).where(eq(faturas.id, id));
  }

  async gerarFaturasAnuais(userId: string, epoca?: string, dataInicio?: string): Promise<any> {
    const query = drizzleSql`SELECT * FROM gerar_faturas_anuais(${userId}, ${epoca || null}, ${dataInicio ? drizzleSql`${dataInicio}::DATE` : null})`;
    const result = await db.execute(query);
    return result.rows;
  }

  async marcarFaturaPaga(id: number, numeroRecibo?: string, referencia?: string): Promise<boolean> {
    const query = drizzleSql`SELECT marcar_fatura_paga(${id}, ${numeroRecibo || null}, ${referencia || null})`;
    const result = await db.execute(query);
    return true;
  }

  // Tipos de Mensalidade operations
  async getTiposMensalidade(): Promise<TipoMensalidade[]> {
    return db.select().from(tiposMensalidade);
  }

  async getTipoMensalidade(id: number): Promise<TipoMensalidade | undefined> {
    const [tipo] = await db.select().from(tiposMensalidade).where(eq(tiposMensalidade.id, id));
    return tipo;
  }

  async createTipoMensalidade(tipoData: z.infer<typeof insertTipoMensalidadeSchema>): Promise<TipoMensalidade> {
    const [tipo] = await db.insert(tiposMensalidade).values(tipoData).returning();
    return tipo;
  }

  async updateTipoMensalidade(id: number, tipoData: Partial<z.infer<typeof insertTipoMensalidadeSchema>>): Promise<TipoMensalidade | undefined> {
    const [updated] = await db
      .update(tiposMensalidade)
      .set({ ...tipoData, updatedAt: new Date() })
      .where(eq(tiposMensalidade.id, id))
      .returning();
    return updated;
  }

  async deleteTipoMensalidade(id: number): Promise<void> {
    await db.delete(tiposMensalidade).where(eq(tiposMensalidade.id, id));
  }

  // Centros de Custo operations
  async getCentrosCusto(): Promise<CentroCusto[]> {
    return db.select().from(centrosCusto);
  }

  async getCentroCusto(id: number): Promise<CentroCusto | undefined> {
    const [centro] = await db.select().from(centrosCusto).where(eq(centrosCusto.id, id));
    return centro;
  }

  async createCentroCusto(centroData: z.infer<typeof insertCentroCustoSchema>): Promise<CentroCusto> {
    const [centro] = await db.insert(centrosCusto).values(centroData).returning();
    return centro;
  }

  async updateCentroCusto(id: number, centroData: Partial<z.infer<typeof insertCentroCustoSchema>>): Promise<CentroCusto | undefined> {
    const [updated] = await db
      .update(centrosCusto)
      .set({ ...centroData, updatedAt: new Date() })
      .where(eq(centrosCusto.id, id))
      .returning();
    return updated;
  }

  async deleteCentroCusto(id: number): Promise<void> {
    await db.delete(centrosCusto).where(eq(centrosCusto.id, id));
  }
  
  // Dashboard Statistics
  async getDashboardStats(): Promise<{
    totalAtletas: number;
    atividadesMes: number;
    receitaMensal: string;
    taxaPresenca: string;
  }> {
    // Data atual para cálculos mensais
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    const primeiroDiaStr = primeiroDiaMes.toISOString().split('T')[0];
    const ultimoDiaStr = ultimoDiaMes.toISOString().split('T')[0];
    
    // 1. Total de atletas (users table in this DB only contains core fields).
    // The original code filtered by `estado_utilizador` which isn't present in the
    // current migrations; fall back to counting all users.
    const [atletasResult] = await db.select({
      count: drizzleSql<number>`count(*)::int`
    })
    .from(users);

    const totalAtletas = atletasResult?.count || 0;
    
    // 2. Eventos do mês atual (using correct column name data_inicio)
    const [eventosResult] = await db.select({
      count: drizzleSql<number>`count(*)::int`
    })
    .from(eventos)
    .where(
      and(
        gte(eventos.dataInicio, primeiroDiaStr),
        lte(eventos.dataInicio, ultimoDiaStr)
      )
    );
    
    const atividadesMes = eventosResult?.count || 0;
    
    // 3. Receita mensal (faturas pagas do mês)
    const [receitaResult] = await db.select({
      total: drizzleSql<string>`COALESCE(sum(valor), 0)`
    })
    .from(faturas)
    .where(
      and(
        eq(faturas.estado, 'paga'),
        gte(faturas.dataVencimento, primeiroDiaStr),
        lte(faturas.dataVencimento, ultimoDiaStr)
      )
    );
    
    const receitaMensal = receitaResult?.total || "0";
    
    // 4. Taxa de presença do mês
    const [presencaResult] = await db.select({
      total: drizzleSql<number>`count(*)::int`,
      presentes: drizzleSql<number>`count(*) filter (where presenca = true)::int`
    })
    .from(presencasNovo)
    .where(
      and(
        gte(presencasNovo.data, primeiroDiaStr),
        lte(presencasNovo.data, ultimoDiaStr)
      )
    );
    
    const totalPresencas = presencaResult?.total || 0;
    const totalPresentes = presencaResult?.presentes || 0;
    const taxaPresencaNum = totalPresencas > 0 ? (totalPresentes / totalPresencas) * 100 : 0;
    const taxaPresenca = taxaPresencaNum.toFixed(0);
    
    return {
      totalAtletas,
      atividadesMes,
      receitaMensal,
      taxaPresenca,
    };
  }

  // Pessoas operations (LEGACY - will be deprecated)
  async getPessoas(): Promise<Pessoa[]> {
    return db.select().from(pessoas);
  }

  async getPessoa(id: number): Promise<Pessoa | undefined> {
    const [pessoa] = await db.select().from(pessoas).where(eq(pessoas.id, id));
    return pessoa;
  }

  async createPessoa(pessoa: InsertPessoa): Promise<Pessoa> {
    const [newPessoa] = await db.insert(pessoas).values(pessoa).returning();
    return newPessoa;
  }

  async updatePessoa(id: number, pessoa: Partial<InsertPessoa>): Promise<Pessoa | undefined> {
    const [updated] = await db
      .update(pessoas)
      .set({ ...pessoa, updatedAt: new Date() })
      .where(eq(pessoas.id, id))
      .returning();
    return updated;
  }

  async deletePessoa(id: number): Promise<void> {
    await db.delete(pessoas).where(eq(pessoas.id, id));
  }

  // Escaloes operations
  async getEscaloes(): Promise<Escalao[]> {
    return db.select().from(escaloes);
  }

  async getEscalao(id: number): Promise<Escalao | undefined> {
    const [escalao] = await db.select().from(escaloes).where(eq(escaloes.id, id));
    return escalao;
  }

  async createEscalao(escalao: InsertEscalao): Promise<Escalao> {
    const [newEscalao] = await db.insert(escaloes).values(escalao).returning();
    return newEscalao;
  }

  async updateEscalao(id: number, escalao: Partial<InsertEscalao>): Promise<Escalao | undefined> {
    const [updated] = await db
      .update(escaloes)
      .set(escalao)
      .where(eq(escaloes.id, id))
      .returning();
    return updated;
  }

  async deleteEscalao(id: number): Promise<void> {
    await db.delete(escaloes).where(eq(escaloes.id, id));
  }

  // Atividades operations
  async getAtividades(): Promise<Atividade[]> {
    return db.select().from(atividades);
  }

  async getAtividade(id: number): Promise<Atividade | undefined> {
    const [atividade] = await db.select().from(atividades).where(eq(atividades.id, id));
    return atividade;
  }

  async createAtividade(atividade: InsertAtividade): Promise<Atividade> {
    const [newAtividade] = await db.insert(atividades).values(atividade).returning();
    return newAtividade;
  }

  async updateAtividade(id: number, atividade: Partial<InsertAtividade>): Promise<Atividade | undefined> {
    const [updated] = await db
      .update(atividades)
      .set(atividade)
      .where(eq(atividades.id, id))
      .returning();
    return updated;
  }

  async deleteAtividade(id: number): Promise<void> {
    await db.delete(atividades).where(eq(atividades.id, id));
  }

  // Presencas operations
  async getPresencas(atividadeId?: number): Promise<Presenca[]> {
    if (atividadeId) {
      return db.select().from(presencas).where(eq(presencas.atividadeId, atividadeId));
    }
    return db.select().from(presencas);
  }

  async getPresenca(id: number): Promise<Presenca | undefined> {
    const [presenca] = await db.select().from(presencas).where(eq(presencas.id, id));
    return presenca;
  }

  async createPresenca(presenca: InsertPresenca): Promise<Presenca> {
    const [newPresenca] = await db.insert(presencas).values(presenca).returning();
    return newPresenca;
  }

  async updatePresenca(id: number, presenca: Partial<InsertPresenca>): Promise<Presenca | undefined> {
    const [updated] = await db
      .update(presencas)
      .set(presenca)
      .where(eq(presencas.id, id))
      .returning();
    return updated;
  }

  async deletePresenca(id: number): Promise<void> {
    await db.delete(presencas).where(eq(presencas.id, id));
  }

  // Mensalidades operations
  async getMensalidades(pessoaId?: number): Promise<Mensalidade[]> {
    if (pessoaId) {
      return db.select().from(mensalidades).where(eq(mensalidades.pessoaId, pessoaId));
    }
    return db.select().from(mensalidades);
  }

  async getMensalidade(id: number): Promise<Mensalidade | undefined> {
    const [mensalidade] = await db.select().from(mensalidades).where(eq(mensalidades.id, id));
    return mensalidade;
  }

  async createMensalidade(mensalidade: InsertMensalidade): Promise<Mensalidade> {
    const [newMensalidade] = await db.insert(mensalidades).values(mensalidade).returning();
    return newMensalidade;
  }

  async updateMensalidade(id: number, mensalidade: Partial<InsertMensalidade>): Promise<Mensalidade | undefined> {
    const [updated] = await db
      .update(mensalidades)
      .set(mensalidade)
      .where(eq(mensalidades.id, id))
      .returning();
    return updated;
  }

  async deleteMensalidade(id: number): Promise<void> {
    await db.delete(mensalidades).where(eq(mensalidades.id, id));
  }

  // Materiais operations
  async getMateriais(): Promise<Material[]> {
    return db.select().from(materiais);
  }

  async getMaterial(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materiais).where(eq(materiais.id, id));
    return material;
  }

  async createMaterial(material: InsertMaterial): Promise<Material> {
    const [newMaterial] = await db.insert(materiais).values(material).returning();
    return newMaterial;
  }

  async updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material | undefined> {
    const [updated] = await db
      .update(materiais)
      .set(material)
      .where(eq(materiais.id, id))
      .returning();
    return updated;
  }

  async deleteMaterial(id: number): Promise<void> {
    await db.delete(materiais).where(eq(materiais.id, id));
  }

  // Emprestimos operations
  async getEmprestimos(pessoaId?: number): Promise<Emprestimo[]> {
    if (pessoaId) {
      return db.select().from(emprestimos).where(eq(emprestimos.pessoaId, pessoaId));
    }
    return db.select().from(emprestimos);
  }

  async getEmprestimo(id: number): Promise<Emprestimo | undefined> {
    const [emprestimo] = await db.select().from(emprestimos).where(eq(emprestimos.id, id));
    return emprestimo;
  }

  async createEmprestimo(emprestimo: InsertEmprestimo): Promise<Emprestimo> {
    const [newEmprestimo] = await db.insert(emprestimos).values(emprestimo).returning();
    return newEmprestimo;
  }

  async updateEmprestimo(id: number, emprestimo: Partial<InsertEmprestimo>): Promise<Emprestimo | undefined> {
    const [updated] = await db
      .update(emprestimos)
      .set(emprestimo)
      .where(eq(emprestimos.id, id))
      .returning();
    return updated;
  }

  async deleteEmprestimo(id: number): Promise<void> {
    await db.delete(emprestimos).where(eq(emprestimos.id, id));
  }

  // Emails operations
  async getEmails(): Promise<Email[]> {
    return db.select().from(emails);
  }

  async getEmail(id: number): Promise<Email | undefined> {
    const [email] = await db.select().from(emails).where(eq(emails.id, id));
    return email;
  }

  async createEmail(email: InsertEmail): Promise<Email> {
    const [newEmail] = await db.insert(emails).values(email).returning();
    return newEmail;
  }

  async updateEmail(id: number, email: Partial<InsertEmail>): Promise<Email | undefined> {
    const [updated] = await db
      .update(emails)
      .set(email)
      .where(eq(emails.id, id))
      .returning();
    return updated;
  }

  async deleteEmail(id: number): Promise<void> {
    await db.delete(emails).where(eq(emails.id, id));
  }

  // Dados Desportivos operations
  async getDadosDesportivos(userId: string): Promise<DadosDesportivos | undefined> {
    const [dados] = await db
      .select()
      .from(dadosDesportivos)
      .where(eq(dadosDesportivos.userId, userId));
    return dados;
  }

  async upsertDadosDesportivos(dados: z.infer<typeof insertDadosDesportivosSchema>): Promise<DadosDesportivos> {
    const existing = await this.getDadosDesportivos(dados.userId);
    
    if (existing) {
      const [updated] = await db
        .update(dadosDesportivos)
        .set(dados)
        .where(eq(dadosDesportivos.userId, dados.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(dadosDesportivos)
        .values(dados)
        .returning();
      return created;
    }
  }

  // Dados Configuracao operations
  async getDadosConfiguracao(userId: string): Promise<DadosConfiguracao | undefined> {
    const [dados] = await db
      .select()
      .from(dadosConfiguracao)
      .where(eq(dadosConfiguracao.userId, userId));
    return dados;
  }

  async upsertDadosConfiguracao(dados: z.infer<typeof insertDadosConfiguracaoSchema>): Promise<DadosConfiguracao> {
    const existing = await this.getDadosConfiguracao(dados.userId);
    
    if (existing) {
      const [updated] = await db
        .update(dadosConfiguracao)
        .set(dados)
        .where(eq(dadosConfiguracao.userId, dados.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(dadosConfiguracao)
        .values(dados)
        .returning();
      return created;
    }
  }

  // Treinos operations
  async getTreinos(userId: string): Promise<Treino[]> {
    return db
      .select()
      .from(treinos)
      .where(eq(treinos.userId, userId))
      .orderBy(treinos.data);
  }

  async createTreino(treino: z.infer<typeof insertTreinoSchema>): Promise<Treino> {
    const [newTreino] = await db.insert(treinos).values(treino).returning();
    return newTreino;
  }

  // Resultados operations
  async getResultados(userId: string): Promise<Resultado[]> {
    return db
      .select()
      .from(resultados)
      .where(eq(resultados.userId, userId))
      .orderBy(resultados.data);
  }

  async createResultado(resultado: z.infer<typeof insertResultadoSchema>): Promise<Resultado> {
    const [newResultado] = await db.insert(resultados).values(resultado).returning();
    return newResultado;
  }
}

export const storage = new DatabaseStorage();
