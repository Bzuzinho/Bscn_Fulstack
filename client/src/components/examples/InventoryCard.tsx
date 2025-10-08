import { InventoryCard } from "../InventoryCard";

export default function InventoryCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-8">
      <InventoryCard
        name="Pranchas de Natação"
        category="Equipamento de Treino"
        quantity={25}
        location="Armazém Principal"
        status="disponivel"
        testId="inventory-1"
      />
      <InventoryCard
        name="Cronómetros Digitais"
        category="Material Técnico"
        quantity={8}
        location="Sala de Treinadores"
        status="emprestado"
        testId="inventory-2"
      />
      <InventoryCard
        name="Pull Buoys"
        category="Equipamento de Treino"
        quantity={5}
        location="Armazém Principal"
        status="disponivel"
        lowStock={true}
        testId="inventory-3"
      />
    </div>
  );
}
