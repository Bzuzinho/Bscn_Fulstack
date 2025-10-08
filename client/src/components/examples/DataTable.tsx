import { DataTable } from "../DataTable";
import { Badge } from "@/components/ui/badge";

const sampleAthletes = [
  { id: 1, name: "João Silva", escalao: "Juvenis A", email: "joao@email.pt", status: "active" },
  { id: 2, name: "Maria Santos", escalao: "Seniores", email: "maria@email.pt", status: "active" },
  { id: 3, name: "Pedro Costa", escalao: "Infantis B", email: "pedro@email.pt", status: "pending" },
  { id: 4, name: "Ana Oliveira", escalao: "Juvenis B", email: "ana@email.pt", status: "active" },
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

export default function DataTableExample() {
  const columns = [
    { key: "name", header: "Nome" },
    { key: "escalao", header: "Escalão" },
    { key: "email", header: "Email" },
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
    <div className="p-8">
      <DataTable
        data={sampleAthletes}
        columns={columns}
        searchPlaceholder="Pesquisar atletas..."
        onRowClick={(item) => console.log("Clicked:", item)}
        testId="athletes-table"
      />
    </div>
  );
}
