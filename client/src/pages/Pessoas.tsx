import { useState } from "react";
import { AthleteCard } from "@/components/AthleteCard";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, TableIcon } from "lucide-react";

const athletes = [
  { id: 1, name: "João Silva", escalao: "Juvenis A", email: "joao.silva@email.pt", phone: "+351 912 345 678", status: "active" },
  { id: 2, name: "Maria Santos", escalao: "Seniores", email: "maria.santos@email.pt", phone: "+351 913 456 789", status: "active" },
  { id: 3, name: "Pedro Costa", escalao: "Infantis B", email: "pedro.costa@email.pt", phone: "+351 914 567 890", status: "pending" },
  { id: 4, name: "Ana Oliveira", escalao: "Juvenis B", email: "ana.oliveira@email.pt", phone: "+351 915 678 901", status: "active" },
  { id: 5, name: "Rui Ferreira", escalao: "Seniores", email: "rui.ferreira@email.pt", phone: "+351 916 789 012", status: "active" },
  { id: 6, name: "Sofia Martins", escalao: "Infantis A", email: "sofia.martins@email.pt", phone: "+351 917 890 123", status: "inactive" },
];

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

export default function Pessoas() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const tableColumns = [
    { key: "name", header: "Nome" },
    { key: "escalao", header: "Escalão" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Telefone" },
    {
      key: "status",
      header: "Estado",
      render: (item: any) => (
        <Badge className={statusColors[item.status as keyof typeof statusColors]}>
          {statusLabels[item.status as keyof typeof statusLabels]}
        </Badge>
      ),
    },
  ];

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
          <Button data-testid="button-new-person">
            <Plus className="h-4 w-4 mr-2" />
            Novo Atleta
          </Button>
        </div>
      </div>

      <Tabs defaultValue="atletas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="atletas" data-testid="tab-athletes">Atletas</TabsTrigger>
          <TabsTrigger value="treinadores" data-testid="tab-coaches">Treinadores</TabsTrigger>
          <TabsTrigger value="encarregados" data-testid="tab-guardians">Encarregados</TabsTrigger>
        </TabsList>

        <TabsContent value="atletas" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {athletes.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  name={athlete.name}
                  escalao={athlete.escalao}
                  email={athlete.email}
                  phone={athlete.phone}
                  status={athlete.status as any}
                  testId={`athlete-${athlete.id}`}
                />
              ))}
            </div>
          ) : (
            <DataTable
              data={athletes}
              columns={tableColumns}
              searchPlaceholder="Pesquisar atletas..."
              onRowClick={(item) => console.log("Clicked:", item)}
              testId="athletes-table"
            />
          )}
        </TabsContent>

        <TabsContent value="treinadores">
          <div className="text-center py-12 text-muted-foreground">
            <p>Gestão de treinadores será implementada aqui</p>
          </div>
        </TabsContent>

        <TabsContent value="encarregados">
          <div className="text-center py-12 text-muted-foreground">
            <p>Gestão de encarregados será implementada aqui</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
