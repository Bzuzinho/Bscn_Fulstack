import { FinanceCard } from "../FinanceCard";

export default function FinanceCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-8">
      <FinanceCard
        athleteName="João Silva"
        amount={45.00}
        dueDate={new Date(2025, 9, 5)}
        status="pago"
        description="Mensalidade Outubro 2025"
        testId="finance-1"
      />
      <FinanceCard
        athleteName="Maria Santos"
        amount={45.00}
        dueDate={new Date(2025, 9, 15)}
        status="pendente"
        description="Mensalidade Outubro 2025"
        testId="finance-2"
      />
      <FinanceCard
        athleteName="Pedro Costa"
        amount={45.00}
        dueDate={new Date(2025, 8, 25)}
        status="atrasado"
        description="Mensalidade Setembro 2025"
        testId="finance-3"
      />
    </div>
  );
}
