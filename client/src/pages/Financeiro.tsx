import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Euro, TrendingUp, AlertCircle, Calendar, Check, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMensalidadeSchema, type Mensalidade, type Pessoa } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const mensalidadeFormSchema = insertMensalidadeSchema.extend({
  pessoaId: z.number({ required_error: "Pessoa é obrigatória" }),
  valor: z.string().min(1, "Valor é obrigatório"),
  mes: z.number().min(1, "Mês deve ser entre 1 e 12").max(12, "Mês deve ser entre 1 e 12"),
  ano: z.number().min(2020, "Ano inválido"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
});

type MensalidadeFormData = z.infer<typeof mensalidadeFormSchema>;

type MensalidadeWithPessoa = Mensalidade & {
  pessoaNome: string;
};

interface StatsData {
  totalReceita: number;
  totalPendente: number;
  totalAtrasado: number;
  countPendentes: number;
  countAtrasadas: number;
  taxaPagamento: number;
}

export default function Financeiro() {
  const [selectedTab, setSelectedTab] = useState<"todas" | "pagas" | "pendentes" | "atrasadas">("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMensalidade, setEditingMensalidade] = useState<MensalidadeWithPessoa | null>(null);
  const { toast } = useToast();

  const form = useForm<MensalidadeFormData>({
    resolver: zodResolver(mensalidadeFormSchema),
    defaultValues: {
      pessoaId: 0,
      valor: "",
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      dataVencimento: "",
      dataPagamento: "",
      status: "pendente",
      descricao: "",
    },
  });

  const { data: pessoas = [] } = useQuery<Pessoa[]>({
    queryKey: ["/api/pessoas"],
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery<StatsData>({
    queryKey: ["/api/mensalidades", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/mensalidades/stats");
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
  });

  const { data: mensalidades = [], isLoading: isMensalidadesLoading } = useQuery<MensalidadeWithPessoa[]>({
    queryKey: ["/api/mensalidades"],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: MensalidadeFormData) => {
      if (editingMensalidade) {
        await apiRequest("PUT", `/api/mensalidades/${editingMensalidade.id}`, data);
      } else {
        await apiRequest("POST", "/api/mensalidades", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mensalidades"] });
      toast({
        title: editingMensalidade ? "Mensalidade atualizada" : "Mensalidade criada",
        description: editingMensalidade 
          ? "Mensalidade atualizada com sucesso." 
          : "Nova mensalidade adicionada com sucesso.",
      });
      setIsDialogOpen(false);
      setEditingMensalidade(null);
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
        description: "Falha ao guardar mensalidade.",
        variant: "destructive",
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (mensalidade: MensalidadeWithPessoa) => {
      await apiRequest("PUT", `/api/mensalidades/${mensalidade.id}`, {
        status: "pago",
        dataPagamento: new Date().toISOString().split('T')[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mensalidades"] });
      toast({
        title: "Pagamento registado",
        description: "Mensalidade marcada como paga.",
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
        description: "Falha ao registar pagamento.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/mensalidades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mensalidades"] });
      toast({
        title: "Mensalidade eliminada",
        description: "Mensalidade eliminada com sucesso.",
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
        description: "Falha ao eliminar mensalidade.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (mensalidade?: MensalidadeWithPessoa) => {
    if (mensalidade) {
      setEditingMensalidade(mensalidade);
      form.reset({
        pessoaId: mensalidade.pessoaId,
        valor: mensalidade.valor,
        mes: mensalidade.mes,
        ano: mensalidade.ano,
        dataVencimento: mensalidade.dataVencimento,
        dataPagamento: mensalidade.dataPagamento || "",
        status: mensalidade.status,
        descricao: mensalidade.descricao || "",
      });
    } else {
      setEditingMensalidade(null);
      form.reset({
        pessoaId: 0,
        valor: "",
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        dataVencimento: "",
        dataPagamento: "",
        status: "pendente",
        descricao: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: MensalidadeFormData) => {
    saveMutation.mutate(data);
  };

  const statusColors = {
    pago: "bg-chart-2 text-white",
    pendente: "bg-chart-3 text-white",
    atrasado: "bg-destructive text-destructive-foreground",
  };

  const statusLabels = {
    pago: "Pago",
    pendente: "Pendente",
    atrasado: "Atrasado",
  };

  const filteredMensalidades = mensalidades.filter((m) => {
    if (selectedTab === "todas") return true;
    if (selectedTab === "pagas") return m.status === "pago";
    if (selectedTab === "pendentes") return m.status === "pendente";
    if (selectedTab === "atrasadas") return m.status === "atrasado";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Gerir mensalidades e pagamentos</p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-new-payment">
          <Plus className="h-4 w-4 mr-2" />
          Nova Mensalidade
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isStatsLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Receita Recebida</h3>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono" data-testid="stat-revenue-received">
                  €{stats?.totalReceita.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pagamentos Pendentes</h3>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono" data-testid="stat-revenue-pending">
                  €{stats?.totalPendente.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.countPendentes || 0} pagamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pagamentos Atrasados</h3>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono" data-testid="stat-revenue-overdue">
                  €{stats?.totalAtrasado.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.countAtrasadas || 0} pagamentos
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas" data-testid="tab-all">Todas</TabsTrigger>
          <TabsTrigger value="pagas" data-testid="tab-paid">Pagas</TabsTrigger>
          <TabsTrigger value="pendentes" data-testid="tab-pending">Pendentes</TabsTrigger>
          <TabsTrigger value="atrasadas" data-testid="tab-overdue">Atrasadas</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {isMensalidadesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          ) : filteredMensalidades.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Euro className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Nenhuma mensalidade encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione a primeira mensalidade
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMensalidades.map((mensalidade) => (
                <Card key={mensalidade.id} className="hover-elevate" data-testid={`finance-${mensalidade.id}`}>
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base" data-testid={`finance-${mensalidade.id}-athlete`}>
                        {mensalidade.pessoaNome}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mensalidade.descricao || `Mensalidade ${mensalidade.mes}/${mensalidade.ano}`}
                      </p>
                    </div>
                    <Badge className={statusColors[mensalidade.status as keyof typeof statusColors]} data-testid={`finance-${mensalidade.id}-status`}>
                      {statusLabels[mensalidade.status as keyof typeof statusLabels]}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Euro className="h-4 w-4" />
                      <span className="font-mono font-semibold text-foreground" data-testid={`finance-${mensalidade.id}-amount`}>
                        €{Number(mensalidade.valor).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Vencimento: {format(new Date(mensalidade.dataVencimento), "dd/MM/yyyy", { locale: pt })}</span>
                    </div>
                    {mensalidade.dataPagamento && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4" />
                        <span>Pago em: {format(new Date(mensalidade.dataPagamento), "dd/MM/yyyy", { locale: pt })}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenDialog(mensalidade)}
                          data-testid={`finance-${mensalidade.id}-edit`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteMutation.mutate(mensalidade.id)}
                          data-testid={`finance-${mensalidade.id}-delete`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {mensalidade.status === "pendente" && (
                        <Button 
                          size="sm" 
                          onClick={() => markAsPaidMutation.mutate(mensalidade)}
                          data-testid={`finance-${mensalidade.id}-pay`}
                        >
                          Marcar como Pago
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" data-testid="dialog-mensalidade">
          <DialogHeader>
            <DialogTitle>
              {editingMensalidade ? "Editar Mensalidade" : "Nova Mensalidade"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pessoaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pessoa</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="input-pessoa">
                          <SelectValue placeholder="Selecione uma pessoa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pessoas.map((pessoa) => (
                          <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                            {pessoa.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="45.00" 
                          {...field}
                          data-testid="input-valor"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="input-status">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="atrasado">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mês</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="12" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-mes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="2020" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-ano"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataVencimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Vencimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-data-vencimento" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Pagamento (opcional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} data-testid="input-data-pagamento" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mensalidade de outubro 2025" 
                        {...field}
                        value={field.value || ""}
                        data-testid="input-descricao"
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
                  disabled={saveMutation.isPending}
                  data-testid="button-save"
                >
                  {saveMutation.isPending ? "A guardar..." : editingMensalidade ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
