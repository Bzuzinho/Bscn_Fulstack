import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Pencil, Trash2, Phone, Mail, MapPin, Calendar, User as UserIcon } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Use local types for the frontend list/form to avoid importing runtime/shared types
// (shared schema imports cause runtime/type mismatches in the browser dev overlay).
type PessoaLocal = {
  id: number;
  firstName?: string;
  lastName?: string;
  nome: string; // Computed field for backwards compatibility
  email?: string | null;
  telemovel?: string | null;
  dataNascimento?: string | null;
  nif?: string | null;
  morada?: string | null;
  cp?: string | null;
  localidade?: string | null;
  sexo?: string | null;
  escalaoId?: number | null;
};

type EscalaoLocal = { id: number; nome: string };
import { z } from "zod";
import { mapPessoaServerToClient, mapPessoaClientToServer } from "@/lib/mappers";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

// Local validation schema for the UI (avoid importing runtime Zod schema from server/shared)
// Updated to use firstName/lastName instead of nome
const userFormSchema = z.object({
  firstName: z.string().min(1, "Primeiro nome é obrigatório"),
  lastName: z.string().min(1, "Último nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telemovel: z.string().optional().or(z.literal("")),
  nif: z.string().optional().or(z.literal("")),
  dataNascimento: z.string().optional().or(z.literal("")),
  morada: z.string().optional().or(z.literal("")),
  cp: z.string().optional().or(z.literal("")),
  localidade: z.string().optional().or(z.literal("")),
  sexo: z.string().optional().or(z.literal("")),
  // UI-only fields (will not be sent to insert Pessoa table directly)
  numeroSocio: z.string().optional().or(z.literal("")),
  escalaoId: z.number().nullable().optional(),
  estadoUtilizador: z.string().optional().or(z.literal("ativo")),
  observacoesConfig: z.string().optional().or(z.literal("")),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function Pessoas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Properly type the resolver so react-hook-form generics line up with Zod schema
  const resolver = zodResolver(userFormSchema) as unknown as Resolver<UserFormData>;

  const form = useForm<UserFormData>({
    resolver,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      telemovel: "",
      nif: "",
      dataNascimento: "",
      morada: "",
      cp: "",
      localidade: "",
      sexo: "",
      numeroSocio: "",
      escalaoId: null,
      estadoUtilizador: "ativo",
      observacoesConfig: "",
    },
  });

  const { data: usersRaw = [], isLoading: isUsersLoading } = useQuery<any[]>({
    queryKey: ["/api/pessoas"],
  });
  // map server shapes to UI shapes
  const users = Array.isArray(usersRaw) ? usersRaw.map((u) => mapPessoaServerToClient(u)) : [];

  const { data: escaloes = [] } = useQuery<EscalaoLocal[]>({
    queryKey: ["/api/escaloes"],
  });

  const saveUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
  // centralize mapping for consistency
  const payload = mapPessoaClientToServer(data as any);
      payload.tipo = "atleta";
      await apiRequest("POST", "/api/pessoas", payload);
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
      firstName: "",
      lastName: "",
      email: "",
      telemovel: "",
      nif: "",
      dataNascimento: "",
      morada: "",
      cp: "",
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
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={(user as any).profileImageUrl ?? undefined} alt={user.nome || ""} />
                    <AvatarFallback>
                      {(user as any).firstName ? (user as any).firstName.charAt(0).toUpperCase() : <UserIcon className="h-6 w-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base" data-testid={`user-${user.id}-name`}>
                      {user.nome || "Sem nome"}
                    </h3>
                    {((user as any).numeroSocio ?? (user as any).numero_socio) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Sócio nº {(user as any).numeroSocio ?? (user as any).numero_socio}
                      </p>
                    )}
                  </div>
                </div>
                <Badge 
                  className={estadoColors[(user as any).estadoUtilizador || "ativo"]}
                  data-testid={`user-${user.id}-status`}
                >
                  {estadoLabels[(user as any).estadoUtilizador || "ativo"]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate" data-testid={`user-${user.id}-email`}>{user.email}</span>
                  </div>
                )}
                {(user as any).telemovel && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span data-testid={`user-${user.id}-phone`}>{(user as any).telemovel}</span>
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
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primeiro Nome *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="João" 
                          {...field}
                          data-testid="input-firstName"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Último Nome *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Silva" 
                          {...field}
                          data-testid="input-lastName"
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
                  name="telemovel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="912345678" 
                          {...field}
                          data-testid="input-telemovel"
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
                  name="cp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1000-001" 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-cp"
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
