import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, TrendingUp, Users, Activity, Euro } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Relatorios() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios & Análises</h1>
          <p className="text-muted-foreground mt-1">Estatísticas e indicadores do clube</p>
        </div>
        <Button data-testid="button-export-report">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          trend={{ value: "+12%", isPositive: true }}
          testId="stat-activities"
        />
        <StatCard
          title="Receita Mensal"
          value="€5,240"
          icon={Euro}
          trend={{ value: "+8%", isPositive: true }}
          testId="stat-revenue"
        />
        <StatCard
          title="Taxa de Presença"
          value="87%"
          icon={TrendingUp}
          trend={{ value: "-2%", isPositive: false }}
          testId="stat-attendance"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Atletas</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Gráfico de evolução será implementado aqui</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Gráfico financeiro será implementado aqui</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presenças por Escalão</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Gráfico de presenças será implementado aqui</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Gráfico de atividades será implementado aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">Relatório Mensal de Atividades</p>
              <p className="text-sm text-muted-foreground">Outubro 2025</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-download-monthly">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">Relatório Financeiro Trimestral</p>
              <p className="text-sm text-muted-foreground">Q3 2025</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-download-quarterly">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md hover-elevate">
            <div>
              <p className="font-medium">Lista de Atletas Ativos</p>
              <p className="text-sm text-muted-foreground">Atualizado hoje</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-download-athletes">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
