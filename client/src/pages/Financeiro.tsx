import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Euro, TrendingUp, AlertCircle, Calendar, Check, FileText, Wand2, Receipt } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { User, TipoMensalidade, CentroCusto } from "@shared/schema";
import { Building2, Layers } from "lucide-react";

// Fatura com dados de user (da API otimizada)
interface FaturaWithUser {
  id: number;
  userId: string;
  numero?: string | null;
  descricao?: string | null;
  valorTotal: string;
  mesReferencia: number;
  anoReferencia: number;
  dataEmissao: string;
  dataVencimento: string;
  estado: string;
  numeroRecibo?: string | null;
  referenciaPagamento?: string | null;
  dataPagamento?: string | null;
  userName: string;
  userNumeroSocio?: number | null;
}

const generateInvoicesSchema = z.object({
  userId: z.string().min(1, "Atleta é obrigatório"),
  epoca: z.string().regex(/^\d{4}\/\d{4}$/, "Época deve estar no formato YYYY/YYYY"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
});

const markAsPaidSchema = z.object({
  numeroRecibo: z.string().min(1, "Número do recibo é obrigatório"),
  referencia: z.string().optional(),
});

type GenerateInvoicesFormData = z.infer<typeof generateInvoicesSchema>;
type MarkAsPaidFormData = z.infer<typeof markAsPaidSchema>;

export default function Financeiro() {
  const [selectedTab, setSelectedTab] = useState<"todas" | "pendentes" | "pagas" | "atrasadas" | "futuras" | "config">("todas");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<FaturaWithUser | null>(null);
  const { toast } = useToast();

  const generateForm = useForm<GenerateInvoicesFormData>({
    resolver: zodResolver(generateInvoicesSchema),
    defaultValues: {
      userId: "",
      epoca: "2024/2025",
      dataInicio: format(new Date(2024, 8, 1), "yyyy-MM-dd"), // 1 de Setembro 2024
    },
  });

  const paymentForm = useForm<MarkAsPaidFormData>({
    resolver: zodResolver(markAsPaidSchema),
    defaultValues: {
      numeroRecibo: "",
      referencia: "",
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: faturas = [], isLoading: isFaturasLoading } = useQuery<FaturaWithUser[]>({
    queryKey: ["/api/faturas"],
  });

  const { data: tiposMensalidade = [], isLoading: isTiposLoading } = useQuery<TipoMensalidade[]>({
    queryKey: ["/api/tipos-mensalidade"],
  });

  const { data: centrosCusto = [], isLoading: isCentrosLoading } = useQuery<CentroCusto[]>({
    queryKey: ["/api/centros-custo"],
  });

  // Calcular estatísticas
  const stats = {
    totalReceita: faturas
      .filter(f => f.estado === "paga")
      .reduce((sum, f) => sum + parseFloat(f.valorTotal), 0),
    totalPendente: faturas
      .filter(f => f.estado === "pendente")
      .reduce((sum, f) => sum + parseFloat(f.valorTotal), 0),
    totalAtrasado: faturas
      .filter(f => f.estado === "em_divida")
      .reduce((sum, f) => sum + parseFloat(f.valorTotal), 0),
    countPendentes: faturas.filter(f => f.estado === "pendente").length,
    countAtrasadas: faturas.filter(f => f.estado === "em_divida").length,
    countPagas: faturas.filter(f => f.estado === "paga").length,
  };

  const generateInvoicesMutation = useMutation({
    mutationFn: async (data: GenerateInvoicesFormData) => {
      const res = await apiRequest("POST", "/api/faturas/gerar", data);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/faturas"] });
      toast({
        title: "Faturas geradas",
        description: `${data.geradas} faturas foram geradas com sucesso para ${data.epoca}.`,
      });
      setIsGenerateDialogOpen(false);
      generateForm.reset();
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
        description: error.message || "Falha ao gerar faturas.",
        variant: "destructive",
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async ({ faturaId, data }: { faturaId: number; data: MarkAsPaidFormData }) => {
      await apiRequest("POST", `/api/faturas/${faturaId}/pagar`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faturas"] });
      toast({
        title: "Pagamento registado",
        description: "Fatura marcada como paga com sucesso.",
      });
      setIsPaymentDialogOpen(false);
      setSelectedFatura(null);
      paymentForm.reset();
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

  const handleGenerateInvoices = (data: GenerateInvoicesFormData) => {
    generateInvoicesMutation.mutate(data);
  };

  const handleMarkAsPaid = (data: MarkAsPaidFormData) => {
    if (!selectedFatura) return;
    markAsPaidMutation.mutate({ faturaId: selectedFatura.id, data });
  };

  const handleOpenPaymentDialog = (fatura: FaturaWithUser) => {
    setSelectedFatura(fatura);
    paymentForm.reset({
      numeroRecibo: "",
      referencia: "",
    });
    setIsPaymentDialogOpen(true);
  };

  const estadoColors: Record<string, string> = {
    futuro: "bg-muted text-muted-foreground",
    pendente: "bg-chart-3 text-white",
    em_divida: "bg-destructive text-destructive-foreground",
    paga: "bg-chart-2 text-white",
    cancelada: "bg-muted text-muted-foreground",
  };

  const estadoLabels: Record<string, string> = {
    futuro: "Futura",
    pendente: "Pendente",
    em_divida: "Em Dívida",
    paga: "Paga",
    cancelada: "Cancelada",
  };

  const filteredFaturas = faturas.filter((f) => {
    if (selectedTab === "todas") return true;
    if (selectedTab === "pendentes") return f.estado === "pendente";
    if (selectedTab === "pagas") return f.estado === "paga";
    if (selectedTab === "atrasadas") return f.estado === "em_divida";
    if (selectedTab === "futuras") return f.estado === "futuro";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Sistema de faturas automáticas</p>
        </div>
        <Button onClick={() => setIsGenerateDialogOpen(true)} data-testid="button-generate-invoices">
          <Wand2 className="h-4 w-4 mr-2" />
          Gerar Faturas Anuais
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isFaturasLoading ? (
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
                  €{stats.totalReceita.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.countPagas} faturas pagas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pagamentos Pendentes</h3>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono" data-testid="stat-revenue-pending">
                  €{stats.totalPendente.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.countPendentes} faturas pendentes
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
                  €{stats.totalAtrasado.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.countAtrasadas} faturas em dívida
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas" data-testid="tab-all">Todas</TabsTrigger>
          <TabsTrigger value="pendentes" data-testid="tab-pending">Pendentes</TabsTrigger>
          <TabsTrigger value="pagas" data-testid="tab-paid">Pagas</TabsTrigger>
          <TabsTrigger value="atrasadas" data-testid="tab-overdue">Atrasadas</TabsTrigger>
          <TabsTrigger value="futuras" data-testid="tab-future">Futuras</TabsTrigger>
          <TabsTrigger value="config" data-testid="tab-config">Configuração</TabsTrigger>
        </TabsList>

        {/* Tabs de Faturas - reutilizável para todas, pendentes, pagas, atrasadas, futuras */}
        {["todas", "pendentes", "pagas", "atrasadas", "futuras"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {isFaturasLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            ) : filteredFaturas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Nenhuma fatura encontrada</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gere faturas anuais para começar
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFaturas.map((fatura) => (
                  <Card key={fatura.id} className="hover-elevate" data-testid={`invoice-${fatura.id}`}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base" data-testid={`invoice-${fatura.id}-athlete`}>
                            {fatura.userName}
                          </h3>
                          {fatura.userNumeroSocio && (
                            <span className="text-xs text-muted-foreground">
                              #{fatura.userNumeroSocio}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {fatura.descricao || `Mensalidade ${fatura.mesReferencia}/${fatura.anoReferencia}`}
                        </p>
                        {fatura.numero && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Fatura nº {fatura.numero}
                          </p>
                        )}
                      </div>
                      <Badge className={estadoColors[fatura.estado]} data-testid={`invoice-${fatura.id}-status`}>
                        {estadoLabels[fatura.estado]}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Euro className="h-4 w-4" />
                        <span className="font-mono font-semibold text-foreground" data-testid={`invoice-${fatura.id}-amount`}>
                          €{parseFloat(fatura.valorTotal).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Venc: {format(new Date(fatura.dataVencimento), "dd/MM/yyyy", { locale: pt })}</span>
                      </div>
                      {fatura.dataPagamento && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4" />
                          <span>Pago: {format(new Date(fatura.dataPagamento), "dd/MM/yyyy", { locale: pt })}</span>
                        </div>
                      )}
                      {fatura.numeroRecibo && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Receipt className="h-4 w-4" />
                          <span>Recibo: {fatura.numeroRecibo}</span>
                        </div>
                      )}
                      {(fatura.estado === "pendente" || fatura.estado === "em_divida") && (
                        <div className="pt-2 border-t">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleOpenPaymentDialog(fatura)}
                            data-testid={`invoice-${fatura.id}-pay`}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Marcar como Pago
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}

        <TabsContent value="config" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tipos de Mensalidade */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Tipos de Mensalidade</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Valores e configurações de mensalidades
                </p>
              </CardHeader>
              <CardContent>
                {isTiposLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                ) : tiposMensalidade.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Nenhum tipo de mensalidade configurado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tiposMensalidade.map((tipo) => (
                      <div 
                        key={tipo.id} 
                        className="p-4 border rounded-md hover-elevate"
                        data-testid={`tipo-mensalidade-${tipo.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold" data-testid={`tipo-${tipo.id}-name`}>
                              {tipo.nome}
                            </h4>
                            {tipo.descricao && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {tipo.descricao}
                              </p>
                            )}
                            {tipo.escalaoId && (
                              <Badge variant="outline" className="mt-2">
                                Escalão ID: {tipo.escalaoId}
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-semibold text-lg" data-testid={`tipo-${tipo.id}-value`}>
                              €{parseFloat(tipo.valorMensal).toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">por mês</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Centros de Custo */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Centros de Custo</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Distribuição de custos por escalão/departamento
                </p>
              </CardHeader>
              <CardContent>
                {isCentrosLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                ) : centrosCusto.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Nenhum centro de custo configurado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {centrosCusto.map((centro) => (
                      <div 
                        key={centro.id} 
                        className="p-4 border rounded-md hover-elevate"
                        data-testid={`centro-custo-${centro.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold" data-testid={`centro-${centro.id}-name`}>
                              {centro.nome}
                            </h4>
                            {centro.descricao && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {centro.descricao}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">
                                {centro.tipo}
                              </Badge>
                              {centro.escalaoId && (
                                <Badge variant="outline">
                                  Escalão ID: {centro.escalaoId}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {centro.percentualAlocacao !== null && (
                            <div className="text-right">
                              <div className="font-mono font-semibold text-lg" data-testid={`centro-${centro.id}-percentage`}>
                                {parseFloat(centro.percentualAlocacao).toFixed(1)}%
                              </div>
                              <p className="text-xs text-muted-foreground">alocação</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para gerar faturas anuais */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="dialog-generate-invoices">
          <DialogHeader>
            <DialogTitle>Gerar Faturas Anuais</DialogTitle>
            <DialogDescription>
              Gera automaticamente 11 faturas mensais (Setembro a Julho) para um atleta
            </DialogDescription>
          </DialogHeader>
          <Form {...generateForm}>
            <form onSubmit={generateForm.handleSubmit(handleGenerateInvoices)} className="space-y-4">
              <FormField
                control={generateForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atleta</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="input-athlete">
                          <SelectValue placeholder="Selecione um atleta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.email || "Sem nome"}
                            {user.numeroSocio && ` (#${user.numeroSocio})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={generateForm.control}
                name="epoca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Época</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="2024/2025" 
                        {...field}
                        data-testid="input-season"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={generateForm.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        data-testid="input-start-date"
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
                  onClick={() => setIsGenerateDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={generateInvoicesMutation.isPending}
                  data-testid="button-generate"
                >
                  {generateInvoicesMutation.isPending ? "A gerar..." : "Gerar Faturas"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para marcar fatura como paga */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="dialog-payment">
          <DialogHeader>
            <DialogTitle>Registar Pagamento</DialogTitle>
            <DialogDescription>
              Marcar fatura como paga e registar dados do recibo
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handleMarkAsPaid)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="numeroRecibo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Recibo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="REC-2024-001" 
                        {...field}
                        data-testid="input-receipt-number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="referencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referência de Pagamento (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MB12345678" 
                        {...field}
                        data-testid="input-payment-reference"
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
                  onClick={() => setIsPaymentDialogOpen(false)}
                  data-testid="button-cancel-payment"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={markAsPaidMutation.isPending}
                  data-testid="button-confirm-payment"
                >
                  {markAsPaidMutation.isPending ? "A guardar..." : "Confirmar Pagamento"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
