import { InventoryCard } from "@/components/InventoryCard";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, AlertCircle, CheckCircle } from "lucide-react";

const inventory = [
  {
    id: 1,
    name: "Pranchas de Natação",
    category: "Equipamento de Treino",
    quantity: 25,
    location: "Armazém Principal",
    status: "disponivel" as const,
  },
  {
    id: 2,
    name: "Cronómetros Digitais",
    category: "Material Técnico",
    quantity: 8,
    location: "Sala de Treinadores",
    status: "emprestado" as const,
  },
  {
    id: 3,
    name: "Pull Buoys",
    category: "Equipamento de Treino",
    quantity: 5,
    location: "Armazém Principal",
    status: "disponivel" as const,
    lowStock: true,
  },
  {
    id: 4,
    name: "Barbatanas de Treino",
    category: "Equipamento de Treino",
    quantity: 18,
    location: "Armazém Principal",
    status: "disponivel" as const,
  },
  {
    id: 5,
    name: "Paletes de Natação",
    category: "Equipamento de Treino",
    quantity: 3,
    location: "Armazém Secundário",
    status: "manutencao" as const,
  },
];

export default function Inventario() {
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const disponivel = inventory.filter((i) => i.status === "disponivel").length;
  const lowStock = inventory.filter((i) => i.lowStock).length;

  const disponiveis = inventory.filter((i) => i.status === "disponivel");
  const emprestados = inventory.filter((i) => i.status === "emprestado");
  const manutencao = inventory.filter((i) => i.status === "manutencao");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventário</h1>
          <p className="text-muted-foreground mt-1">Gerir materiais e equipamentos</p>
        </div>
        <Button data-testid="button-new-item">
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total de Itens"
          value={totalItems}
          icon={Package}
          testId="stat-total-items"
        />
        <StatCard
          title="Itens Disponíveis"
          value={disponivel}
          icon={CheckCircle}
          testId="stat-available-items"
        />
        <StatCard
          title="Stock Baixo"
          value={lowStock}
          icon={AlertCircle}
          testId="stat-low-stock"
        />
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos" data-testid="tab-all">Todos</TabsTrigger>
          <TabsTrigger value="disponivel" data-testid="tab-available">Disponíveis</TabsTrigger>
          <TabsTrigger value="emprestado" data-testid="tab-borrowed">Emprestados</TabsTrigger>
          <TabsTrigger value="manutencao" data-testid="tab-maintenance">Em Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inventory.map((item) => (
              <InventoryCard key={item.id} {...item} testId={`inventory-${item.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disponivel" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {disponiveis.map((item) => (
              <InventoryCard key={item.id} {...item} testId={`inventory-${item.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emprestado" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {emprestados.map((item) => (
              <InventoryCard key={item.id} {...item} testId={`inventory-${item.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manutencao" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {manutencao.map((item) => (
              <InventoryCard key={item.id} {...item} testId={`inventory-${item.id}`} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
