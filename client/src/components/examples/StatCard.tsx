import { StatCard } from "../StatCard";
import { Users, Activity, CreditCard, TrendingUp } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-8">
      <StatCard
        title="Total de Atletas"
        value="84"
        icon={Users}
        trend={{ value: "+5 este mês", isPositive: true }}
        testId="stat-athletes"
      />
      <StatCard
        title="Atividades do Mês"
        value="23"
        icon={Activity}
        trend={{ value: "+12% vs mês anterior", isPositive: true }}
        testId="stat-activities"
      />
      <StatCard
        title="Receita Mensal"
        value="€5,240"
        icon={CreditCard}
        trend={{ value: "+8% vs mês anterior", isPositive: true }}
        testId="stat-revenue"
      />
      <StatCard
        title="Taxa de Presença"
        value="87%"
        icon={TrendingUp}
        trend={{ value: "-2% vs mês anterior", isPositive: false }}
        testId="stat-attendance"
      />
    </div>
  );
}
