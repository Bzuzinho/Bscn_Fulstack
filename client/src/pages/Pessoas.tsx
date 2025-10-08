import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { AthleteCard } from "@/components/AthleteCard";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, LayoutGrid, TableIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPessoaSchema, type Pessoa, type Escalao } from "@shared/schema";
import { z } from "zod";

const pessoaFormSchema = insertPessoaSchema.extend({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
});

type PessoaFormData = z.infer<typeof pessoaFormSchema>;

export default function Pessoas() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedTab, setSelectedTab] = useState<"atletas" | "treinadores" | "encarregados">("atletas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
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
      ativo: true,
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

  // Create/Update mutation
  const saveMutation = useMutation({
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
          ? "Pessoa atualizada com sucesso." 
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
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao guardar pessoa.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pessoas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas"] });
      toast({
        title: "Pessoa eliminada",
        description: "Pessoa eliminada com sucesso.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "A fazer login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao eliminar pessoa.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (pessoa?: Pessoa) => {
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
        ativo: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: PessoaFormData) => {
    saveMutation.mutate(data);
  };

  const getEscalaoName = (escalaoId: number | null) => {
    if (!escalaoId) return "-";
    const escalao = escaloes.find((e) => e.id === escalaoId);
    return escalao?.nome || "-";
  };

  const statusColors = {
    active: "bg-chart-2 text-white",
    pending: "bg-chart-3 text-white",
    inactive: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    active: "Ativo",
    pending: "Pendente",
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Pessoas</h1>
          <p className="text-muted-foreground mt-1">Gerir atletas, sócios e treinadores</p>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={() => handleOpenDialog()} data-testid="button-new-person">
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
            <div className="text-center py-12 text-muted-foreground" data-testid="empty-state">
              <p>Nenhum {getTipoLabel().toLowerCase()} encontrado.</p>
              <Button onClick={() => handleOpenDialog()} className="mt-4" data-testid="button-add-first">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar {getTipoLabel()}
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pessoas.map((pessoa) => (
                <AthleteCard
                  key={pessoa.id}
                  name={pessoa.nome}
                  escalao={getEscalaoName(pessoa.escalao)}
                  email={pessoa.email || "-"}
                  phone={pessoa.telefone || "-"}
                  status={pessoa.ativo ? "active" : "inactive"}
                  testId={`pessoa-${pessoa.id}`}
                />
              ))}
            </div>
          ) : (
            <DataTable
              data={pessoas}
              columns={tableColumns}
              searchPlaceholder={`Pesquisar ${getTipoLabel().toLowerCase()}s...`}
              onRowClick={(item) => handleOpenDialog(item as Pessoa)}
              testId="pessoas-table"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-pessoa">
          <DialogHeader>
            <DialogTitle>
              {editingPessoa ? "Editar" : "Adicionar"} {getTipoLabel()}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        <Input {...field} value={field.value || ""} data-testid="input-telefone" />
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
                        <Input type="date" {...field} value={field.value || ""} data-testid="input-data-nascimento" />
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
                        <Input {...field} value={field.value || ""} data-testid="input-nif" />
                      </FormControl>
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
                      <Input {...field} value={field.value || ""} data-testid="input-morada" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                {editingPessoa && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      deleteMutation.mutate(editingPessoa.id);
                      setIsDialogOpen(false);
                    }}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete"
                  >
                    Eliminar
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingPessoa(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  data-testid="button-save"
                >
                  {saveMutation.isPending ? "A guardar..." : editingPessoa ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
