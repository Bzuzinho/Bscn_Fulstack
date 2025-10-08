import {
  users,
  pessoas,
  escaloes,
  atividades,
  presencas,
  mensalidades,
  materiais,
  emprestimos,
  emails,
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
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Pessoas operations
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

  // Pessoas operations
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
}

export const storage = new DatabaseStorage();
