import { ActivityCard } from "../ActivityCard";

export default function ActivityCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-8">
      <ActivityCard
        title="Treino de Técnica - Livres"
        type="treino"
        date={new Date(2025, 9, 15)}
        time="18:00 - 20:00"
        location="Piscina Municipal"
        participants={24}
        testId="activity-1"
      />
      <ActivityCard
        title="Campeonato Regional"
        type="prova"
        date={new Date(2025, 9, 22)}
        time="09:00 - 16:00"
        location="Centro Desportivo Nacional"
        participants={18}
        testId="activity-2"
      />
      <ActivityCard
        title="Estágio de Verão"
        type="estagio"
        date={new Date(2025, 10, 5)}
        time="10:00 - 17:00"
        location="Complexo Aquático"
        participants={32}
        testId="activity-3"
      />
    </div>
  );
}
