import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface ActivityCardProps {
  title: string;
  type: "treino" | "prova" | "estagio" | "reuniao";
  date: Date;
  time: string;
  location: string;
  participants: number;
  testId?: string;
}

const typeColors = {
  treino: "bg-chart-1 text-white",
  prova: "bg-chart-3 text-white",
  estagio: "bg-chart-2 text-white",
  reuniao: "bg-muted text-muted-foreground",
};

const typeLabels = {
  treino: "Treino",
  prova: "Prova",
  estagio: "Estágio",
  reuniao: "Reunião",
};

export function ActivityCard({ title, type, date, time, location, participants, testId }: ActivityCardProps) {
  return (
    <Card className="hover-elevate" data-testid={testId}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <CardTitle className="text-base font-semibold flex-1" data-testid={`${testId}-title`}>
          {title}
        </CardTitle>
        <Badge className={typeColors[type]}>{typeLabels[type]}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(date, "PPP", { locale: pt })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participants} participantes</span>
          </div>
          <Button variant="outline" size="sm" data-testid={`${testId}-view`}>
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
