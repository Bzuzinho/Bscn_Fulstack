import { AthleteCard } from "../AthleteCard";

export default function AthleteCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-8">
      <AthleteCard
        name="João Silva"
        escalao="Juvenis A"
        email="joao.silva@email.pt"
        phone="+351 912 345 678"
        status="active"
        testId="athlete-1"
      />
      <AthleteCard
        name="Maria Santos"
        escalao="Seniores"
        email="maria.santos@email.pt"
        phone="+351 913 456 789"
        status="active"
        testId="athlete-2"
      />
      <AthleteCard
        name="Pedro Costa"
        escalao="Infantis B"
        email="pedro.costa@email.pt"
        phone="+351 914 567 890"
        status="pending"
        testId="athlete-3"
      />
    </div>
  );
}
