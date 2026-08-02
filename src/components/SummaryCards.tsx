type Props = {
  totalCredits: number;
  totalEntries: number;
  averagePercentage: number;
  currentReward: string;
};

export default function SummaryCards({
  totalCredits,
  totalEntries,
  averagePercentage,
  currentReward,
}: Props) {
  const cards = [
    { label: "Total Credits", value: totalCredits },
    { label: "Marks Entered", value: totalEntries },
    { label: "Average Score", value: `${averagePercentage.toFixed(1)}%` },
    { label: "Reward Level", value: currentReward },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <article className="summary-card" key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </div>
  );
}
