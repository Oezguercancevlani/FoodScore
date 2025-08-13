export default function ScoreBadge({ value }) {
    if (value == null) return <span>–</span>;

    const v = Math.round(value);
    let label = "Mäßig";
    let cls = "bg-yellow-100 text-yellow-800";

    if (v >= 90) { label = "Ausgezeichnet"; cls = "bg-green-100 text-green-800"; }
    else if (v >= 80) { label = "Sehr gut"; cls = "bg-emerald-100 text-emerald-800"; }
    else if (v >= 60) { label = "Gut"; cls = "bg-lime-100 text-lime-800"; }

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium ${cls}`}>
      {v} <span className="ml-1 hidden sm:inline">{label}</span>
    </span>
    );
}
