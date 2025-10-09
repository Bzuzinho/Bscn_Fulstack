import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { AthleteCard } from "@/components/AthleteCard";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, LayoutGrid, TableIcon, Pencil, Trash2, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPessoaSchema, insertEscalaoSchema, type Pessoa, type Escalao } from "@shared/schema";
import { z } from "zod";

// Validação melhorada para o formulário de pessoas
const pessoaFormSchema = insertPessoaSchema.extend({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  email: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string().email("Email inválido").optional()
  ),
  telefone: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string()
      .regex(/^(\+351\s?)?((9[1-9]|2[1-9])\d{7})$/, "Telefone inválido (ex: +351 912345678 ou 212345678)")
      .optional()
  ),
  nif: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string()
      .regex(/^\d{9}$/, "NIF deve ter 9 dígitos")
      .optional()
  ),
});

const escalaoFormSchema = insertEscalaoSchema.extend({
  nome: z.string().min(1, "Nome é obrigatório"),
});

type PessoaFormData = z.infer<typeof pessoaFormSchema>;
type EscalaoFormData = z.infer<typeof escalaoFormSchema>;

export default function Pessoas() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedTab, setSelectedTab] = useState<"atletas" | "treinadores" | "encarregados">("atletas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  const [deletingPessoa, setDeletingPessoa] = useState<Pessoa | null>(null);
  const [isEscalaoDialogOpen, setIsEscalaoDialogOpen] = useState(false);
  const [editingEscalao, setEditingEscalao] = useState<Escalao | null>(null);
  const [deletingEscalao, setDeletingEscalao] = useState<Escalao | null>(null);
  const { toast } = useToast();

  const form = useForm<PessoaFormData>({
    resolver: zodResolver(pessoaFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      tipo: "atleta",
      escalao: undefined,
      dataNascimento: "",
      nif: "",
      morada: "",
      observacoes: "",
      ativo: true,
    },
  });

  const escalaoForm = useForm<EscalaoFormData>({
    resolver: zodResolver(escalaoFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });

  // Fetch escaloes
  const { data: escaloes = [] } = useQuery<Escalao[]>({
    queryKey: ["/api/escaloes"],
  });

  // Fetch pessoas with tipo filter
  const { data: pessoas = [], isLoading: isPessoasLoading } = useQuery<Pessoa[]>({
    queryKey: ["/api/pessoas", selectedTab],
    queryFn: async () => {
      const tipoMap = {
        atletas: "atleta",
        treinadores: "treinador",
        encarregados: "encarregado",
      };
      const res = await fetch(`/api/pessoas?tipo=${tipoMap[selectedTab]}`);
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
  });

  // Pessoa mutations
  const savePessoaMutation = useMutation({
    mutationFn: async (data: PessoaFormData) => {
      if (editingPessoa) {
        await apiRequest("PUT", `/api/pessoas/${editingPessoa.id}`, data);
      } else {
        await apiRequest("POST", "/api/pessoas", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas"] });
      toast({
        title: editingPessoa ? "Pessoa atualizada" : "Pessoa criada",
        description: editingPessoa 
          ? "Dados atualizados com sucesso." 
          : "Nova pessoa adicionada com sucesso.",
      });
      setIsDialogOpen(false);
      setEditingPessoa(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "A fazer login novamente...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao guardar pessoa.",
        variant: "destructive",
      });
    },
  });

  const deletePessoaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pessoas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas"] });
      toast({
        title: "Pessoa eliminada",
        description: "Pessoa eliminada com sucesso.",
      });
      setDeletingPessoa(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "A fazer login novamente...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao eliminar pessoa.",
        variant: "destructive",
      });
    },
  });

  // Escalão mutations
  const saveEscalaoMutation = useMutation({
    mutationFn: async (data: EscalaoFormData) => {
      if (editingEscalao) {
        await apiRequest("PUT", `/api/escaloes/${editingEscalao.id}`, data);
      } else {
        await apiRequest("POST", "/api/escaloes", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/escaloes"] });
      toast({
        title: editingEscalao ? "Escalão atualizado" : "Escalão criado",
        description: editingEscalao 
          ? "Escalão atualizado com sucesso." 
          : "Novo escalão adicionado com sucesso.",
      });
      setIsEscalaoDialogOpen(false);
      setEditingEscalao(null);
      escalaoForm.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "A fazer login novamente...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao guardar escalão.",
        variant: "destructive",
      });
    },
  });

  const deleteEscalaoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/escaloes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/escaloes"] });
      toast({
        title: "Escalão eliminado",
        description: "Escalão eliminado com sucesso.",
      });
      setDeletingEscalao(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "A fazer login novamente...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao eliminar escalão. Pode estar em uso.",
        variant: "destructive",
      });
    },
  });

  const handleOpenPessoaDialog = (pessoa?: Pessoa) => {
    if (pessoa) {
      setEditingPessoa(pessoa);
      form.reset({
        nome: pessoa.nome,
        email: pessoa.email || "",
        telefone: pessoa.telefone || "",
        tipo: pessoa.tipo,
        escalao: pessoa.escalao || undefined,
        dataNascimento: pessoa.dataNascimento || "",
        nif: pessoa.nif || "",
        morada: pessoa.morada || "",
        observacoes: pessoa.observacoes || "",
        ativo: pessoa.ativo ?? true,
      });
    } else {
      setEditingPessoa(null);
      const tipoMap = {
        atletas: "atleta",
        treinadores: "treinador",
        encarregados: "encarregado",
      };
      form.reset({
        nome: "",
        email: "",
        telefone: "",
        tipo: tipoMap[selectedTab],
        escalao: undefined,
        dataNascimento: "",
        nif: "",
        morada: "",
        observacoes: "",
        ativo: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenEscalaoDialog = (escalao?: Escalao) => {
    if (escalao) {
      setEditingEscalao(escalao);
      escalaoForm.reset({
        nome: escalao.nome,
        descricao: escalao.descricao || "",
      });
    } else {
      setEditingEscalao(null);
      escalaoForm.reset({
        nome: "",
        descricao: "",
      });
    }
    setIsEscalaoDialogOpen(true);
  };

  const handleSubmitPessoa = (data: PessoaFormData) => {
    savePessoaMutation.mutate(data);
  };

  const handleSubmitEscalao = (data: EscalaoFormData) => {
    saveEscalaoMutation.mutate(data);
  };

  const getEscalaoName = (escalaoId: number | null) => {
    if (!escalaoId) return "-";
    const escalao = escaloes.find((e) => e.id === escalaoId);
    return escalao?.nome || "-";
  };

  const statusColors = {
    active: "bg-chart-2 text-white",
    inactive: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    active: "Ativo",
    inactive: "Inativo",
  };

  const tableColumns = [
    { key: "nome", header: "Nome" },
    { 
      key: "escalao", 
      header: "Escalão",
      render: (item: Pessoa) => getEscalaoName(item.escalao),
    },
    { key: "email", header: "Email" },
    { key: "telefone", header: "Telefone" },
    {
      key: "ativo",
      header: "Estado",
      render: (item: Pessoa) => (
        <Badge className={item.ativo ? statusColors.active : statusColors.inactive}>
          {item.ativo ? statusLabels.active : statusLabels.inactive}
        </Badge>
      ),
    },
  ];

  const getTipoLabel = () => {
    const labels = {
      atletas: "Atleta",
      treinadores: "Treinador",
      encarregados: "Encarregado",
    };
    return labels[selectedTab];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Pessoas</h1>
          <p className="text-muted-foreground mt-1">Gerir atletas, treinadores e encarregados</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            onClick={() => handleOpenEscalaoDialog()}
            data-testid="button-manage-escaloes"
          >
            <Settings className="h-4 w-4 mr-2" />
            Gerir Escalões
          </Button>
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              data-testid="button-view-table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => handleOpenPessoaDialog()} data-testid="button-new-person">
            <Plus className="h-4 w-4 mr-2" />
            Novo {getTipoLabel()}
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="atletas" data-testid="tab-athletes">Atletas</TabsTrigger>
          <TabsTrigger value="treinadores" data-testid="tab-coaches">Treinadores</TabsTrigger>
          <TabsTrigger value="encarregados" data-testid="tab-guardians">Encarregados</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {isPessoasLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" data-testid={`skeleton-${i}`} />
              ))}
            </div>
          ) : pessoas.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground" data-testid="empty-state">
                <p className="text-lg mb-4">Nenhum {getTipoLabel().toLowerCase()} encontrado.</p>
                <Button onClick={() => handleOpenPessoaDialog()} data-testid="button-add-first">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro {getTipoLabel()}
                </Button>
              </div>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pessoas.map((pessoa) => (
                <div key={pessoa.id} className="relative">
                  <AthleteCard
                    name={pessoa.nome}
                    escalao={getEscalaoName(pessoa.escalao)}
                    email={pessoa.email || "-"}
                    phone={pessoa.telefone || "-"}
                    status={pessoa.ativo ? "active" : "inactive"}
                    testId={`pessoa-${pessoa.id}`}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm hover-elevate"
                      onClick={() => handleOpenPessoaDialog(pessoa)}
                      data-testid={`button-edit-${pessoa.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm hover-elevate"
                      onClick={() => setDeletingPessoa(pessoa)}
                      data-testid={`button-delete-${pessoa.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              data={pessoas}
              columns={tableColumns}
              searchPlaceholder={`Pesquisar ${getTipoLabel().toLowerCase()}s...`}
              onRowClick={(item) => handleOpenPessoaDialog(item as Pessoa)}
              testId="pessoas-table"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Pessoa Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-pessoa">
          <DialogHeader>
            <DialogTitle>
              {editingPessoa ? "Editar" : "Adicionar"} {getTipoLabel()}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da pessoa. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitPessoa)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-nome" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-tipo">
                            <SelectValue placeholder="Selecionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="atleta">Atleta</SelectItem>
                          <SelectItem value="treinador">Treinador</SelectItem>
                          <SelectItem value="encarregado">Encarregado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} value={field.value || ""} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="+351 912345678"
                          data-testid="input-telefone" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="escalao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escalão</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-escalao">
                            <SelectValue placeholder="Selecionar escalão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {escaloes.map((escalao) => (
                            <SelectItem key={escalao.id} value={escalao.id.toString()}>
                              {escalao.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value || ""} 
                          data-testid="input-data-nascimento" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="123456789"
                          maxLength={9}
                          data-testid="input-nif" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-ativo">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Ativo</SelectItem>
                          <SelectItem value="false">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="morada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Morada</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        rows={2}
                        data-testid="input-morada" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        rows={3}
                        placeholder="Notas adicionais sobre a pessoa..."
                        data-testid="input-observacoes" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={savePessoaMutation.isPending}
                  data-testid="button-save"
                >
                  {savePessoaMutation.isPending ? "A guardar..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Pessoa Confirmation Dialog */}
      <AlertDialog open={!!deletingPessoa} onOpenChange={() => setDeletingPessoa(null)}>
        <AlertDialogContent data-testid="dialog-delete-pessoa">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar <strong>{deletingPessoa?.nome}</strong>? 
              Esta ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingPessoa && deletePessoaMutation.mutate(deletingPessoa.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Escalão Management Dialog */}
      <Dialog open={isEscalaoDialogOpen} onOpenChange={setIsEscalaoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]" data-testid="dialog-escaloes">
          <DialogHeader>
            <DialogTitle>Gerir Escalões</DialogTitle>
            <DialogDescription>
              Configure os escalões disponíveis para os atletas.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Left side: Escalão form */}
            <div className="space-y-4">
              <h3 className="font-medium">
                {editingEscalao ? "Editar Escalão" : "Novo Escalão"}
              </h3>
              <Form {...escalaoForm}>
                <form onSubmit={escalaoForm.handleSubmit(handleSubmitEscalao)} className="space-y-4">
                  <FormField
                    control={escalaoForm.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Infantis A" data-testid="input-escalao-nome" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={escalaoForm.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""} 
                            rows={3}
                            placeholder="Descrição do escalão..."
                            data-testid="input-escalao-descricao" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    {editingEscalao && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingEscalao(null);
                          escalaoForm.reset();
                        }}
                        data-testid="button-cancel-escalao"
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      disabled={saveEscalaoMutation.isPending}
                      className="flex-1"
                      data-testid="button-save-escalao"
                    >
                      {saveEscalaoMutation.isPending ? "A guardar..." : "Guardar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Right side: Escalões list */}
            <div className="space-y-4">
              <h3 className="font-medium">Escalões Existentes</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {escaloes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum escalão criado.</p>
                ) : (
                  escaloes.map((escalao) => (
                    <Card key={escalao.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{escalao.nome}</p>
                          {escalao.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {escalao.descricao}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleOpenEscalaoDialog(escalao)}
                            data-testid={`button-edit-escalao-${escalao.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setDeletingEscalao(escalao)}
                            data-testid={`button-delete-escalao-${escalao.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Escalão Confirmation Dialog */}
      <AlertDialog open={!!deletingEscalao} onOpenChange={() => setDeletingEscalao(null)}>
        <AlertDialogContent data-testid="dialog-delete-escalao">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar o escalão <strong>{deletingEscalao?.nome}</strong>? 
              Esta ação não pode ser revertida. Pessoas com este escalão ficarão sem escalão atribuído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-escalao">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEscalao && deleteEscalaoMutation.mutate(deletingEscalao.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-escalao"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
