import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MoreVertical } from "lucide-react";

interface AthleteCardProps {
  name: string;
  escalao: string;
  email: string;
  phone: string;
  imageUrl?: string;
  status: "active" | "inactive" | "pending";
  testId?: string;
}

const statusColors = {
  active: "bg-chart-2 text-white",
  inactive: "bg-muted text-muted-foreground",
  pending: "bg-chart-3 text-white",
};

const statusLabels = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
};

export function AthleteCard({ name, escalao, email, phone, imageUrl, status, testId }: AthleteCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover-elevate" data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate" data-testid={`${testId}-name`}>{name}</h3>
            <p className="text-sm text-muted-foreground truncate">{escalao}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" data-testid={`${testId}-menu`}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{phone}</span>
        </div>
        <div className="pt-2">
          <Badge className={statusColors[status]} data-testid={`${testId}-status`}>
            {statusLabels[status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
