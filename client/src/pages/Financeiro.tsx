import { FinanceCard } from "@/components/FinanceCard";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Euro, TrendingUp, AlertCircle } from "lucide-react";

const finances = [
  {
    id: 1,
    athleteName: "João Silva",
    amount: 45.00,
    dueDate: new Date(2025, 9, 5),
    status: "pago" as const,
    description: "Mensalidade Outubro 2025",
  },
  {
    id: 2,
    athleteName: "Maria Santos",
    amount: 45.00,
    dueDate: new Date(2025, 9, 15),
    status: "pendente" as const,
    description: "Mensalidade Outubro 2025",
  },
  {
    id: 3,
    athleteName: "Pedro Costa",
    amount: 45.00,
    dueDate: new Date(2025, 8, 25),
    status: "atrasado" as const,
    description: "Mensalidade Setembro 2025",
  },
  {
    id: 4,
    athleteName: "Ana Oliveira",
    amount: 45.00,
    dueDate: new Date(2025, 9, 10),
    status: "pago" as const,
    description: "Mensalidade Outubro 2025",
  },
  {
    id: 5,
    athleteName: "Rui Ferreira",
    amount: 45.00,
    dueDate: new Date(2025, 9, 20),
    status: "pendente" as const,
    description: "Mensalidade Outubro 2025",
  },
];

export default function Financeiro() {
  const totalPago = finances.filter((f) => f.status === "pago").reduce((sum, f) => sum + f.amount, 0);
  const totalPendente = finances.filter((f) => f.status === "pendente").reduce((sum, f) => sum + f.amount, 0);
  const totalAtrasado = finances.filter((f) => f.status === "atrasado").reduce((sum, f) => sum + f.amount, 0);

  const pagos = finances.filter((f) => f.status === "pago");
  const pendentes = finances.filter((f) => f.status === "pendente");
  const atrasados = finances.filter((f) => f.status === "atrasado");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Gerir mensalidades e pagamentos</p>
        </div>
        <Button data-testid="button-new-payment">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pagamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Receita Recebida"
          value={`€${totalPago.toFixed(2)}`}
          icon={Euro}
          testId="stat-revenue-received"
        />
        <StatCard
          title="Pagamentos Pendentes"
          value={`€${totalPendente.toFixed(2)}`}
          icon={TrendingUp}
          testId="stat-revenue-pending"
        />
        <StatCard
          title="Pagamentos Atrasados"
          value={`€${totalAtrasado.toFixed(2)}`}
          icon={AlertCircle}
          testId="stat-revenue-overdue"
        />
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos" data-testid="tab-all">Todos</TabsTrigger>
          <TabsTrigger value="pagos" data-testid="tab-paid">Pagos</TabsTrigger>
          <TabsTrigger value="pendentes" data-testid="tab-pending">Pendentes</TabsTrigger>
          <TabsTrigger value="atrasados" data-testid="tab-overdue">Atrasados</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {finances.map((finance) => (
              <FinanceCard key={finance.id} {...finance} testId={`finance-${finance.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pagos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pagos.map((finance) => (
              <FinanceCard key={finance.id} {...finance} testId={`finance-${finance.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendentes.map((finance) => (
              <FinanceCard key={finance.id} {...finance} testId={`finance-${finance.id}`} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="atrasados" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {atrasados.map((finance) => (
              <FinanceCard key={finance.id} {...finance} testId={`finance-${finance.id}`} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
