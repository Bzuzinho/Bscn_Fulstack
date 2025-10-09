import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, User as UserIcon, Activity, Euro, Settings } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  upsertUserSchema,
  insertDadosDesportivosSchema,
  insertDadosConfiguracaoSchema,
} from "@shared/schema";
import type { 
  User, 
  Escalao, 
  DadosDesportivos, 
  DadosConfiguracao,
  Treino,
  Resultado,
  Fatura,
} from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const estadoLabels = {
  ativo: "Ativo",
  inativo: "Inativo",
  suspenso: "Suspenso",
};

const estadoColors = {
  ativo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inativo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  suspenso: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function PessoaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pessoais");

  // Fetch user data
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["/api/pessoas", id],
    queryFn: async () => {
      const response = await fetch(`/api/pessoas/${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
  });

  const { data: escaloes = [] } = useQuery<Escalao[]>({
    queryKey: ["/api/escaloes"],
  });

  const { data: dadosDesportivos } = useQuery<DadosDesportivos>({
    queryKey: ["/api/pessoas", id, "dados-desportivos"],
    queryFn: async () => {
      const response = await fetch(`/api/pessoas/${id}/dados-desportivos`);
      if (!response.ok) throw new Error("Failed to fetch dados desportivos");
      return response.json();
    },
  });

  const { data: dadosConfiguracao } = useQuery<DadosConfiguracao>({
    queryKey: ["/api/pessoas", id, "dados-configuracao"],
    queryFn: async () => {
      const response = await fetch(`/api/pessoas/${id}/dados-configuracao`);
      if (!response.ok) throw new Error("Failed to fetch dados configuracao");
      return response.json();
    },
  });

  const { data: treinos = [] } = useQuery<Treino[]>({
    queryKey: ["/api/pessoas", id, "treinos"],
    queryFn: async () => {
      const response = await fetch(`/api/pessoas/${id}/treinos`);
      if (!response.ok) throw new Error("Failed to fetch treinos");
      return response.json();
    },
  });

  const { data: resultados = [] } = useQuery<Resultado[]>({
    queryKey: ["/api/pessoas", id, "resultados"],
    queryFn: async () => {
      const response = await fetch(`/api/pessoas/${id}/resultados`);
      if (!response.ok) throw new Error("Failed to fetch resultados");
      return response.json();
    },
  });

  const { data: faturas = [] } = useQuery<Fatura[]>({
    queryKey: ["/api/pessoas", id, "faturas"],
    queryFn: async () => {
      const response = await fetch(`/api/pessoas/${id}/faturas`);
      if (!response.ok) throw new Error("Failed to fetch faturas");
      return response.json();
    },
  });

  if (isUserLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Utilizador não encontrado</h2>
        <Button onClick={() => navigate("/pessoas")} className="mt-4">
          Voltar para Pessoas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/pessoas")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {user.name || "Sem nome"}
              <Badge className={estadoColors[user.estadoUtilizador || "ativo" as keyof typeof estadoColors]}>
                {estadoLabels[user.estadoUtilizador || "ativo" as keyof typeof estadoLabels]}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              {user.numeroSocio ? `Sócio nº ${user.numeroSocio}` : "Sem número de sócio"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pessoais" data-testid="tab-dados-pessoais">
            <UserIcon className="h-4 w-4 mr-2" />
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="desportivos" data-testid="tab-dados-desportivos">
            <Activity className="h-4 w-4 mr-2" />
            Dados Desportivos
          </TabsTrigger>
          <TabsTrigger value="financeiros" data-testid="tab-dados-financeiros">
            <Euro className="h-4 w-4 mr-2" />
            Dados Financeiros
          </TabsTrigger>
          <TabsTrigger value="configuracao" data-testid="tab-configuracao">
            <Settings className="h-4 w-4 mr-2" />
            Configuração
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pessoais">
          <DadosPessoaisTab user={user} escaloes={escaloes} />
        </TabsContent>

        <TabsContent value="desportivos">
          <DadosDesportivosTab 
            userId={id!} 
            dadosDesportivos={dadosDesportivos}
            treinos={treinos}
            resultados={resultados}
          />
        </TabsContent>

        <TabsContent value="financeiros">
          <DadosFinanceirosTab userId={id!} faturas={faturas} />
        </TabsContent>

        <TabsContent value="configuracao">
          <ConfiguracaoTab 
            userId={id!} 
            dadosConfiguracao={dadosConfiguracao}
            userRole={user.role}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tab Components will be defined below
function DadosPessoaisTab({ user, escaloes }: { user: User; escaloes: Escalao[] }) {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(upsertUserSchema.partial()),
    defaultValues: {
      name: user.name || "",
      numeroSocio: user.numeroSocio || "",
      nif: user.nif || "",
      cartaoCidadao: user.cartaoCidadao || "",
      email: user.email || "",
      contacto: user.contacto || "",
      dataNascimento: user.dataNascimento || "",
      sexo: user.sexo || undefined,
      morada: user.morada || "",
      codigoPostal: user.codigoPostal || "",
      localidade: user.localidade || "",
      empresa: user.empresa || "",
      escola: user.escola || "",
      estadoCivil: user.estadoCivil || undefined,
      ocupacao: user.ocupacao || "",
      nacionalidade: user.nacionalidade || "",
      numeroIrmaos: user.numeroIrmaos || 0,
      menor: user.menor || false,
      escalaoId: user.escalaoId || undefined,
      estadoUtilizador: user.estadoUtilizador || "ativo",
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", `/api/pessoas/${user.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas"] });
      toast({
        title: "Dados atualizados",
        description: "Dados pessoais atualizados com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar dados pessoais.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateUserMutation.mutate(data))} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroSocio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Sócio</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-numero-socio" />
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
                      <Input {...field} maxLength={9} data-testid="input-nif" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cartaoCidadao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cartão Cidadão</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-cartao-cidadao" />
                    </FormControl>
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
                      <Input type="date" {...field} data-testid="input-data-nascimento" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-sexo">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
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
                      <Input type="email" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacto</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contacto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="morada"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Morada</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-morada" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigoPostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0000-000" data-testid="input-codigo-postal" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidade</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-localidade" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estadoCivil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Civil</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-estado-civil">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao_facto">União de Facto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-empresa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="escola"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-escola" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ocupacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ocupação</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-ocupacao" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nacionalidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nacionalidade</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-nacionalidade" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroIrmaos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Irmãos</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} data-testid="input-numero-irmaos" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="escalaoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escalão</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))} 
                      value={field.value?.toString() || "none"}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-escalao">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
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
                name="estadoUtilizador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "ativo"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-estado">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="suspenso">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateUserMutation.isPending} data-testid="button-save-pessoais">
                <Save className="h-4 w-4 mr-2" />
                {updateUserMutation.isPending ? "A guardar..." : "Guardar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function DadosDesportivosTab({ 
  userId, 
  dadosDesportivos,
  treinos,
  resultados 
}: { 
  userId: string; 
  dadosDesportivos?: DadosDesportivos;
  treinos: Treino[];
  resultados: Resultado[];
}) {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertDadosDesportivosSchema.partial()),
    defaultValues: {
      numeroFederacao: dadosDesportivos?.numeroFederacao || "",
      pmb: dadosDesportivos?.pmb || "",
      dataInscricao: dadosDesportivos?.dataInscricao || "",
      altura: dadosDesportivos?.altura || "",
      peso: dadosDesportivos?.peso || "",
      atestadoMedico: dadosDesportivos?.atestadoMedico || false,
      dataAtestado: dadosDesportivos?.dataAtestado || "",
      informacoesMedicas: dadosDesportivos?.informacoesMedicas || "",
      observacoes: dadosDesportivos?.observacoes || "",
      patologias: dadosDesportivos?.patologias || "",
      medicamentos: dadosDesportivos?.medicamentos || "",
    },
  });

  const updateDadosMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", `/api/pessoas/${userId}/dados-desportivos`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas", userId, "dados-desportivos"] });
      toast({
        title: "Dados atualizados",
        description: "Dados desportivos atualizados com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar dados desportivos.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Desportivas</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateDadosMutation.mutate(data))} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="numeroFederacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº Federação</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-numero-federacao" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pmb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PMB</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-pmb" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataInscricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inscrição Clube</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-data-inscricao" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="altura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} data-testid="input-altura" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} data-testid="input-peso" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataAtestado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Atestado Médico</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-data-atestado" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="informacoesMedicas"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Informações Médicas</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="textarea-informacoes-medicas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patologias"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Patologias</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="textarea-patologias" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicamentos"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Medicamentos</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="textarea-medicamentos" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="textarea-observacoes" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateDadosMutation.isPending} data-testid="button-save-desportivos">
                  <Save className="h-4 w-4 mr-2" />
                  {updateDadosMutation.isPending ? "A guardar..." : "Guardar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Treinos Section */}
      <Card>
        <CardHeader>
          <CardTitle>Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          {treinos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Sem treinos registados</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Nº Treino</th>
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Sessão</th>
                  </tr>
                </thead>
                <tbody>
                  {treinos.map((treino) => (
                    <tr key={treino.id} className="border-t">
                      <td className="p-3">{treino.numero}</td>
                      <td className="p-3">{treino.data}</td>
                      <td className="p-3">{treino.sessao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados Section */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          {resultados.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Sem resultados registados</p>
          ) : (
            <div className="space-y-4">
              {resultados.map((resultado) => (
                <div key={resultado.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{resultado.competicao}</h4>
                      <p className="text-sm text-muted-foreground">{resultado.prova}</p>
                      <p className="text-sm">{resultado.local} - {resultado.piscina}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{resultado.tempo}</p>
                      <p className="text-sm text-muted-foreground">{resultado.data}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DadosFinanceirosTab({ userId, faturas }: { userId: string; faturas: Fatura[] }) {
  const estadoFaturaColors = {
    futuro: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    em_divida: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    paga: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelada: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  const estadoFaturaLabels = {
    futuro: "Futuro",
    pendente: "Pendente",
    em_divida: "Em Dívida",
    paga: "Paga",
    cancelada: "Cancelada",
  };

  const totalPendente = faturas
    .filter((f) => f.estado === "pendente" || f.estado === "em_divida")
    .reduce((sum, f) => sum + parseFloat(f.valor as any), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faturas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(totalPendente)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Faturas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {faturas.filter((f) => f.estado === "paga").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          {faturas.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Sem faturas registadas</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Nº Fatura</th>
                    <th className="text-left p-3">Mês</th>
                    <th className="text-left p-3">Valor</th>
                    <th className="text-left p-3">Estado</th>
                    <th className="text-left p-3">Vencimento</th>
                  </tr>
                </thead>
                <tbody>
                  {faturas.map((fatura) => (
                    <tr key={fatura.id} className="border-t">
                      <td className="p-3">{fatura.id}</td>
                      <td className="p-3">{fatura.mes}</td>
                      <td className="p-3">
                        {new Intl.NumberFormat("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        }).format(parseFloat(fatura.valor as any))}
                      </td>
                      <td className="p-3">
                        <Badge className={estadoFaturaColors[fatura.estado as keyof typeof estadoFaturaColors]}>
                          {estadoFaturaLabels[fatura.estado as keyof typeof estadoFaturaLabels]}
                        </Badge>
                      </td>
                      <td className="p-3">{fatura.dataVencimento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ConfiguracaoTab({ 
  userId, 
  dadosConfiguracao,
  userRole 
}: { 
  userId: string; 
  dadosConfiguracao?: DadosConfiguracao;
  userRole?: string;
}) {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertDadosConfiguracaoSchema.partial()),
    defaultValues: {
      consentimento: dadosConfiguracao?.consentimento || false,
      dataConsentimento: dadosConfiguracao?.dataConsentimento ? new Date(dadosConfiguracao.dataConsentimento).toISOString().split('T')[0] : "",
      ficheiroConsentimento: dadosConfiguracao?.ficheiroConsentimento || "",
      declaracaoTransporte: dadosConfiguracao?.declaracaoTransporte || false,
      dataTransporte: dadosConfiguracao?.dataTransporte ? new Date(dadosConfiguracao.dataTransporte).toISOString().split('T')[0] : "",
      ficheiroTransporte: dadosConfiguracao?.ficheiroTransporte || "",
      afiliacao: dadosConfiguracao?.afiliacao || false,
      dataAfiliacao: dadosConfiguracao?.dataAfiliacao ? new Date(dadosConfiguracao.dataAfiliacao).toISOString().split('T')[0] : "",
      ficheiroAfiliacao: dadosConfiguracao?.ficheiroAfiliacao || "",
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", `/api/pessoas/${userId}/dados-configuracao`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas", userId, "dados-configuracao"] });
      toast({
        title: "Configuração atualizada",
        description: "Dados de configuração atualizados com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar configuração.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração RGPD e Permissões</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateConfigMutation.mutate(data))} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* RGPD Consent */}
              <div className="col-span-2 border-b pb-4">
                <h3 className="font-semibold mb-4">Consentimento RGPD</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dataConsentimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Consentimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-data-consentimento" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ficheiroConsentimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ficheiro Consentimento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Caminho do ficheiro" data-testid="input-ficheiro-consentimento" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Transport Declaration */}
              <div className="col-span-2 border-b pb-4">
                <h3 className="font-semibold mb-4">Declaração de Transporte</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dataTransporte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Transporte</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-data-transporte" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ficheiroTransporte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ficheiro Transporte</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Caminho do ficheiro" data-testid="input-ficheiro-transporte" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Affiliation */}
              <div className="col-span-2 border-b pb-4">
                <h3 className="font-semibold mb-4">Afiliação</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dataAfiliacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Afiliação</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-data-afiliacao" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ficheiroAfiliacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ficheiro Afiliação</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Caminho do ficheiro" data-testid="input-ficheiro-afiliacao" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="col-span-2">
                <h3 className="font-semibold mb-4">Perfil de Permissões</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Perfil Atual:</p>
                  <Badge className="mt-2">{userRole || "membro"}</Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Para alterar permissões, contacte o administrador do sistema.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateConfigMutation.isPending} data-testid="button-save-configuracao">
                <Save className="h-4 w-4 mr-2" />
                {updateConfigMutation.isPending ? "A guardar..." : "Guardar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
