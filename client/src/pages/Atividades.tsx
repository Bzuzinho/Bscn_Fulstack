import { ActivityCard } from "@/components/ActivityCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Treino de Técnica - Livres",
    type: "treino" as const,
    date: new Date(2025, 9, 15),
    time: "18:00 - 20:00",
    location: "Piscina Municipal",
    participants: 24,
  },
  {
    id: 2,
    title: "Campeonato Regional",
    type: "prova" as const,
    date: new Date(2025, 9, 22),
    time: "09:00 - 16:00",
    location: "Centro Desportivo Nacional",
    participants: 18,
  },
  {
    id: 3,
    title: "Estágio de Verão",
    type: "estagio" as const,
    date: new Date(2025, 10, 5),
    time: "10:00 - 17:00",
    location: "Complexo Aquático",
    participants: 32,
  },
  {
    id: 4,
    title: "Treino de Resistência",
    type: "treino" as const,
    date: new Date(2025, 9, 18),
    time: "19:00 - 21:00",
    location: "Piscina Municipal",
    participants: 20,
  },
  {
    id: 5,
    title: "Reunião Técnica",
    type: "reuniao" as const,
    date: new Date(2025, 9, 20),
    time: "20:00 - 21:30",
    location: "Sala de Reuniões",
    participants: 8,
  },
];

export default function Atividades() {
  const treinos = activities.filter((a) => a.type === "treino");
  const provas = activities.filter((a) => a.type === "prova");
  const estagios = activities.filter((a) => a.type === "estagio");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Atividades & Eventos</h1>
          <p className="text-muted-foreground mt-1">Gerir treinos, provas e eventos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendário
          </Button>
          <Button data-testid="button-new-activity">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} {...activity} testId={`activity-${activity.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="treinos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {treinos.map((activity) => (
              <ActivityCard key={activity.id} {...activity} testId={`activity-${activity.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="provas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {provas.map((activity) => (
              <ActivityCard key={activity.id} {...activity} testId={`activity-${activity.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="estagios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {estagios.map((activity) => (
              <ActivityCard key={activity.id} {...activity} testId={`activity-${activity.id}`} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
