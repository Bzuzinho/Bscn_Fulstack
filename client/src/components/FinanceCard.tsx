import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Euro, FileText } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface FinanceCardProps {
  athleteName: string;
  amount: number;
  dueDate: Date;
  status: "pago" | "pendente" | "atrasado";
  description: string;
  testId?: string;
}

const statusColors = {
  pago: "bg-chart-2 text-white",
  pendente: "bg-chart-3 text-white",
  atrasado: "bg-destructive text-destructive-foreground",
};

const statusLabels = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

export function FinanceCard({ athleteName, amount, dueDate, status, description, testId }: FinanceCardProps) {
  return (
    <Card className="hover-elevate" data-testid={testId}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base" data-testid={`${testId}-athlete`}>{athleteName}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Badge className={statusColors[status]} data-testid={`${testId}-status`}>
          {statusLabels[status]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Euro className="h-4 w-4" />
          <span className="font-mono font-semibold text-foreground" data-testid={`${testId}-amount`}>
            €{amount.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Vencimento: {format(dueDate, "dd/MM/yyyy", { locale: pt })}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <Button variant="outline" size="sm" data-testid={`${testId}-receipt`}>
            <FileText className="h-4 w-4 mr-2" />
            Recibo
          </Button>
          {status === "pendente" && (
            <Button size="sm" data-testid={`${testId}-pay`}>
              Registar Pagamento
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
