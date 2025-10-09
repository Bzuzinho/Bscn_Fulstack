import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Pencil, Trash2, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertUserSchema, type User, type Escalao } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

// Schema de validação para formulário de utilizador
const userFormSchema = upsertUserSchema.pick({
  name: true,
  email: true,
  contacto: true,
  nif: true,
  dataNascimento: true,
  morada: true,
  codigoPostal: true,
  localidade: true,
  numeroSocio: true,
  escalaoId: true,
  estadoUtilizador: true,
  observacoesConfig: true,
}).extend({
  name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  contacto: z.string().min(9, "Contacto deve ter pelo menos 9 dígitos").optional().or(z.literal("")),
  nif: z.string().length(9, "NIF deve ter 9 dígitos").optional().or(z.literal("")),
  dataNascimento: z.string().optional().or(z.literal("")),
  escalaoId: z.number().nullable().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function Pessoas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      contacto: "",
      nif: "",
      dataNascimento: "",
      morada: "",
      codigoPostal: "",
      localidade: "",
      numeroSocio: "",
      escalaoId: null,
      estadoUtilizador: "ativo",
      observacoesConfig: "",
    },
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["/api/pessoas"],
  });

  const { data: escaloes = [] } = useQuery<Escalao[]>({
    queryKey: ["/api/escaloes"],
  });

  const saveUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      await apiRequest("POST", "/api/pessoas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas"] });
      toast({
        title: "Utilizador criado",
        description: "Novo utilizador adicionado com sucesso.",
      });
      setIsDialogOpen(false);
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
        description: "Falha ao guardar utilizador.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/pessoas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pessoas"] });
      toast({
        title: "Utilizador eliminado",
        description: "Utilizador eliminado com sucesso.",
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
        description: "Falha ao eliminar utilizador.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = () => {
    form.reset({
      name: "",
      email: "",
      contacto: "",
      nif: "",
      dataNascimento: "",
      morada: "",
      codigoPostal: "",
      localidade: "",
      numeroSocio: "",
      escalaoId: null,
      estadoUtilizador: "ativo",
      observacoesConfig: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: UserFormData) => {
    saveUserMutation.mutate(data);
  };

  const getEscalaoNome = (escalaoId: number | null | undefined) => {
    if (!escalaoId) return null;
    const escalao = escaloes.find(e => e.id === escalaoId);
    return escalao?.nome || null;
  };

  const estadoColors: Record<string, string> = {
    ativo: "bg-chart-2 text-white",
    inativo: "bg-muted text-muted-foreground",
    suspenso: "bg-destructive text-destructive-foreground",
  };

  const estadoLabels: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
    suspenso: "Suspenso",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pessoas</h1>
          <p className="text-muted-foreground mt-1">Gerir atletas e utilizadores</p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-new-user">
          <Plus className="h-4 w-4 mr-2" />
          Novo Utilizador
        </Button>
      </div>

      {isUsersLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum utilizador encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione o primeiro utilizador
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card 
              key={user.id} 
              className="hover-elevate cursor-pointer" 
              onClick={() => navigate(`/pessoas/${user.id}`)}
              role="button"
              data-testid={`card-user-${user.id}`}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base" data-testid={`user-${user.id}-name`}>
                    {user.name || "Sem nome"}
                  </h3>
                  {user.numeroSocio && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Sócio nº {user.numeroSocio}
                    </p>
                  )}
                </div>
                <Badge 
                  className={estadoColors[user.estadoUtilizador || "ativo"]}
                  data-testid={`user-${user.id}-status`}
                >
                  {estadoLabels[user.estadoUtilizador || "ativo"]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate" data-testid={`user-${user.id}-email`}>{user.email}</span>
                  </div>
                )}
                {user.contacto && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span data-testid={`user-${user.id}-phone`}>{user.contacto}</span>
                  </div>
                )}
                {user.localidade && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span data-testid={`user-${user.id}-location`}>{user.localidade}</span>
                  </div>
                )}
                {user.dataNascimento && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(user.dataNascimento), "dd/MM/yyyy", { locale: pt })}</span>
                  </div>
                )}
                {getEscalaoNome(user.escalaoId) && (
                  <div className="mt-2">
                    <Badge variant="outline" data-testid={`user-${user.id}-escalao`}>
                      {getEscalaoNome(user.escalaoId)}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUserMutation.mutate(user.id);
                    }}
                    data-testid={`user-${user.id}-delete`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" data-testid="dialog-user">
          <DialogHeader>
            <DialogTitle>
              Novo Utilizador
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="João Silva" 
                          {...field}
                          data-testid="input-name"
                        />
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
                        <Input 
                          type="email" 
                          placeholder="joao@email.com" 
                          {...field}
                          data-testid="input-email"
                        />
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
                        <Input 
                          placeholder="912345678" 
                          {...field}
                          data-testid="input-contacto"
                        />
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
                      <FormLabel>Número de Sócio</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="001" 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-numero-socio"
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
                          placeholder="123456789" 
                          maxLength={9}
                          {...field}
                          data-testid="input-nif"
                        />
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
                        <Input 
                          type="date" 
                          {...field}
                          data-testid="input-data-nascimento"
                        />
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
                        value={field.value ? field.value.toString() : "none"}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="input-escalao">
                            <SelectValue placeholder="Selecione um escalão" />
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
                          <SelectTrigger data-testid="input-estado">
                            <SelectValue placeholder="Selecione o estado" />
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

                <FormField
                  control={form.control}
                  name="morada"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Morada</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Rua Example, nº 123" 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-morada"
                        />
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
                        <Input 
                          placeholder="1000-001" 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-codigo-postal"
                        />
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
                        <Input 
                          placeholder="Lisboa" 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-localidade"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoesConfig"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações adicionais..." 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-observacoes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  disabled={saveUserMutation.isPending}
                  data-testid="button-save"
                >
                  {saveUserMutation.isPending ? "A guardar..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
