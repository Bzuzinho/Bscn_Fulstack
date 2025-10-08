import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, AlertCircle } from "lucide-react";

interface InventoryCardProps {
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: "disponivel" | "emprestado" | "manutencao";
  lowStock?: boolean;
  testId?: string;
}

const statusColors = {
  disponivel: "bg-chart-2 text-white",
  emprestado: "bg-chart-3 text-white",
  manutencao: "bg-destructive text-destructive-foreground",
};

const statusLabels = {
  disponivel: "Disponível",
  emprestado: "Emprestado",
  manutencao: "Manutenção",
};

export function InventoryCard({ name, category, quantity, location, status, lowStock, testId }: InventoryCardProps) {
  return (
    <Card className="hover-elevate" data-testid={testId}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1">
          <CardTitle className="text-base font-semibold" data-testid={`${testId}-name`}>{name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{category}</p>
        </div>
        <Badge className={statusColors[status]} data-testid={`${testId}-status`}>
          {statusLabels[status]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-semibold" data-testid={`${testId}-quantity`}>{quantity}</span>
          <span className="text-muted-foreground">unidades</span>
          {lowStock && (
            <div className="flex items-center gap-1 text-destructive ml-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Stock baixo</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1" data-testid={`${testId}-edit`}>
            Editar
          </Button>
          <Button variant="outline" size="sm" className="flex-1" data-testid={`${testId}-loan`}>
            Emprestar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
