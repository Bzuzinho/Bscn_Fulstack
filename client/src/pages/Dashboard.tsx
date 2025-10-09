import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { ActivityCard } from "@/components/ActivityCard";
import { Users, Activity, CreditCard, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalAtletas: number;
  atividadesMes: number;
  receitaMensal: string;
  taxaPresenca: string;
}

export default function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const recentActivities = [
    {
      title: "Treino de Técnica - Livres",
      type: "treino" as const,
      date: new Date(2025, 9, 15),
      time: "18:00 - 20:00",
      location: "Piscina Municipal",
      participants: 24,
    },
    {
      title: "Campeonato Regional",
      type: "prova" as const,
      date: new Date(2025, 9, 22),
      time: "09:00 - 16:00",
      location: "Centro Desportivo Nacional",
      participants: 18,
    },
    {
      title: "Estágio de Verão",
      type: "estagio" as const,
      date: new Date(2025, 10, 5),
      time: "10:00 - 17:00",
      location: "Complexo Aquático",
      participants: 32,
    },
  ];

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do clube</p>
        </div>
        <Button data-testid="button-new-activity">
          <Plus className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isStatsLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatCard
              title="Total de Atletas"
              value={stats?.totalAtletas.toString() || "0"}
              icon={Users}
              trend={{ value: "Atletas ativos", isPositive: true }}
              testId="stat-athletes"
            />
            <StatCard
              title="Atividades do Mês"
              value={stats?.atividadesMes.toString() || "0"}
              icon={Activity}
              trend={{ value: "Eventos este mês", isPositive: true }}
              testId="stat-activities"
            />
            <StatCard
              title="Receita Mensal"
              value={formatCurrency(stats?.receitaMensal || "0")}
              icon={CreditCard}
              trend={{ value: "Faturas pagas", isPositive: true }}
              testId="stat-revenue"
            />
            <StatCard
              title="Taxa de Presença"
              value={`${stats?.taxaPresenca || "0"}%`}
              icon={TrendingUp}
              trend={{ value: "Média do mês", isPositive: parseInt(stats?.taxaPresenca || "0") >= 80 }}
              testId="stat-attendance"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Atividades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityCard key={index} {...activity} testId={`activity-${index}`} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm border-b pb-3">
                <div>
                  <p className="font-medium">João Silva registado</p>
                  <p className="text-muted-foreground text-xs">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm border-b pb-3">
                <div>
                  <p className="font-medium">Pagamento recebido - Maria Santos</p>
                  <p className="text-muted-foreground text-xs">Há 3 horas</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm border-b pb-3">
                <div>
                  <p className="font-medium">Nova atividade criada</p>
                  <p className="text-muted-foreground text-xs">Há 5 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
