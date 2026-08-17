// components/MetricCard.tsx

interface MetricCardProps {
  label: string;
  value: number | string;
  description?: string;
}

export default function MetricCard({
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-[#ECECF4] bg-white p-5">
      <p className="text-sm text-[#777791]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold text-[#202033]">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-[#9999AA]">
          {description}
        </p>
      )}
    </div>
  );
}