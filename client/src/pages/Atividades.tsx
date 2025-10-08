import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ActivityCard } from "@/components/ActivityCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, CalendarIcon, Users, Pencil, Trash2, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertAtividadeSchema, insertPresencaSchema, type Atividade, type Pessoa, type Presenca } from "@shared/schema";
import { z } from "zod";

const atividadeFormSchema = insertAtividadeSchema.extend({
  data: z.string().min(1, "Data é obrigatória"),
});

type AtividadeFormData = z.infer<typeof atividadeFormSchema>;

export default function Atividades() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState<Atividade | null>(null);
  const [deletingAtividade, setDeletingAtividade] = useState<Atividade | null>(null);
  const [attendanceAtividade, setAttendanceAtividade] = useState<Atividade | null>(null);

  // Fetch activities
  const { data: atividades = [], isLoading: isLoadingAtividades } = useQuery<Atividade[]>({
    queryKey: ["/api/atividades"],
    meta: {
      onError: (error: Error) => {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Não autorizado",
            description: "Por favor, faça login novamente.",
            variant: "destructive",
          });
          setLocation("/");
        }
      },
    },
  });

  // Fetch pessoas for attendance
  const { data: pessoas = [] } = useQuery<Pessoa[]>({
    queryKey: ["/api/pessoas"],
    enabled: !!attendanceAtividade,
  });

  // Fetch presencas for selected activity
  const { data: presencas = [] } = useQuery<Presenca[]>({
    queryKey: ["/api/presencas", { atividadeId: attendanceAtividade?.id }],
    queryFn: () => fetch(`/api/presencas?atividadeId=${attendanceAtividade?.id}`).then(res => res.json()),
    enabled: !!attendanceAtividade,
  });

  const form = useForm<AtividadeFormData>({
    resolver: zodResolver(atividadeFormSchema),
    defaultValues: {
      titulo: "",
      tipo: "treino",
      data: "",
      hora: "",
      local: "",
      descricao: "",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: AtividadeFormData) => apiRequest("/api/atividades", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/atividades"] });
      toast({ title: "Atividade criada com sucesso!" });
      setIsCreateOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        });
        setLocation("/");
      } else {
        toast({
          title: "Erro ao criar atividade",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AtividadeFormData> }) =>
      apiRequest(`/api/atividades/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/atividades"] });
      toast({ title: "Atividade atualizada com sucesso!" });
      setEditingAtividade(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar atividade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/atividades/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/atividades"] });
      toast({ title: "Atividade excluída com sucesso!" });
      setDeletingAtividade(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir atividade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Attendance mutations
  const toggleAttendanceMutation = useMutation({
    mutationFn: ({ presencaId, presente, atividadeId, pessoaId }: { presencaId?: number; presente: boolean; atividadeId: number; pessoaId: number }) => {
      if (presencaId) {
        return apiRequest(`/api/presencas/${presencaId}`, "PUT", { presente });
      } else {
        return apiRequest("/api/presencas", "POST", { atividadeId, pessoaId, presente });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presencas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/atividades"] });
    },
  });

  const handleSubmit = (data: AtividadeFormData) => {
    if (editingAtividade) {
      updateMutation.mutate({ id: editingAtividade.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (atividade: Atividade) => {
    setEditingAtividade(atividade);
    form.reset({
      titulo: atividade.titulo,
      tipo: atividade.tipo,
      data: atividade.data,
      hora: atividade.hora ?? "",
      local: atividade.local ?? "",
      descricao: atividade.descricao ?? "",
    });
  };

  const handleToggleAttendance = (pessoa: Pessoa, presente: boolean) => {
    const existingPresenca = presencas.find(p => p.pessoaId === pessoa.id);
    toggleAttendanceMutation.mutate({
      presencaId: existingPresenca?.id,
      presente,
      atividadeId: attendanceAtividade!.id,
      pessoaId: pessoa.id,
    });
  };

  const treinos = atividades.filter((a) => a.tipo === "treino");
  const provas = atividades.filter((a) => a.tipo === "prova");
  const estagios = atividades.filter((a) => a.tipo === "estagio");

  // Calculate attendance stats
  const attendanceStats = attendanceAtividade ? {
    total: pessoas.length,
    presente: presencas.filter(p => p.presente).length,
    percentage: pessoas.length > 0 ? Math.round((presencas.filter(p => p.presente).length / pessoas.length) * 100) : 0,
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Atividades & Eventos</h1>
          <p className="text-muted-foreground mt-1">Gerir treinos, provas e eventos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendário
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="button-new-activity">
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos" data-testid="tab-all">Todos</TabsTrigger>
          <TabsTrigger value="treinos" data-testid="tab-trainings">Treinos</TabsTrigger>
          <TabsTrigger value="provas" data-testid="tab-competitions">Provas</TabsTrigger>
          <TabsTrigger value="estagios" data-testid="tab-camps">Estágios</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {isLoadingAtividades ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : atividades.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-activities">
                  Nenhuma atividade encontrada. Crie a primeira atividade!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {atividades.map((activity) => {
                return (
                  <div key={activity.id} className="relative">
                    <ActivityCard
                      title={activity.titulo}
                      type={activity.tipo as any}
                      date={parseISO(activity.data)}
                      time={activity.hora || ""}
                      location={activity.local || ""}
                      participants={(activity as any).participantsCount || 0}
                      testId={`activity-${activity.id}`}
                      onViewDetails={() => setAttendanceAtividade(activity)}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(activity)}
                        data-testid={`button-edit-${activity.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setDeletingAtividade(activity)}
                        data-testid={`button-delete-${activity.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="treinos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {treinos.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.titulo}
                type={activity.tipo as any}
                date={parseISO(activity.data)}
                time={activity.hora || ""}
                location={activity.local || ""}
                participants={(activity as any).participantsCount || 0}
                testId={`activity-${activity.id}`}
                onViewDetails={() => setAttendanceAtividade(activity)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="provas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {provas.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.titulo}
                type={activity.tipo as any}
                date={parseISO(activity.data)}
                time={activity.hora || ""}
                location={activity.local || ""}
                participants={(activity as any).participantsCount || 0}
                testId={`activity-${activity.id}`}
                onViewDetails={() => setAttendanceAtividade(activity)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="estagios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {estagios.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.titulo}
                type={activity.tipo as any}
                date={parseISO(activity.data)}
                time={activity.hora || ""}
                location={activity.local || ""}
                participants={(activity as any).participantsCount || 0}
                testId={`activity-${activity.id}`}
                onViewDetails={() => setAttendanceAtividade(activity)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingAtividade} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingAtividade(null);
          form.reset();
        }
      }}>
        <DialogContent data-testid="dialog-activity-form">
          <DialogHeader>
            <DialogTitle>{editingAtividade ? "Editar Atividade" : "Nova Atividade"}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da atividade abaixo.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-titulo" />
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
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-tipo">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="treino">Treino</SelectItem>
                        <SelectItem value="prova">Prova</SelectItem>
                        <SelectItem value="estagio">Estágio</SelectItem>
                        <SelectItem value="reuniao">Reunião</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-data" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value ?? ""} data-testid="input-hora" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} data-testid="input-local" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value ?? ""} data-testid="input-descricao" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingAtividade(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {editingAtividade ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingAtividade} onOpenChange={() => setDeletingAtividade(null)}>
        <AlertDialogContent data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a atividade "{deletingAtividade?.titulo}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingAtividade && deleteMutation.mutate(deletingAtividade.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Attendance Dialog */}
      <Dialog open={!!attendanceAtividade} onOpenChange={() => setAttendanceAtividade(null)}>
        <DialogContent className="max-w-2xl" data-testid="dialog-attendance">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <span>Presenças - {attendanceAtividade?.titulo}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setAttendanceAtividade(null)}
                data-testid="button-close-attendance"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            {attendanceStats && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{attendanceStats.presente} / {attendanceStats.total} presentes</span>
                </div>
                <div>({attendanceStats.percentage}%)</div>
              </div>
            )}
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pessoas.map((pessoa) => {
              const presenca = presencas.find(p => p.pessoaId === pessoa.id);
              const isPresent = presenca?.presente || false;
              return (
                <div
                  key={pessoa.id}
                  className="flex items-center justify-between p-3 rounded-md border hover-elevate"
                  data-testid={`attendance-row-${pessoa.id}`}
                >
                  <div>
                    <p className="font-medium">{pessoa.nome}</p>
                    <p className="text-sm text-muted-foreground">{pessoa.tipo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isPresent}
                      onCheckedChange={(checked) => handleToggleAttendance(pessoa, !!checked)}
                      data-testid={`checkbox-attendance-${pessoa.id}`}
                    />
                    <span className="text-sm">{isPresent ? "Presente" : "Ausente"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
