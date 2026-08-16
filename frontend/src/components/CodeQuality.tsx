import type { LucideIcon } from "lucide-react";

interface CardsProps {
  overview: string;
  score: string;
  icon: LucideIcon;
  color: string;
  lightColor: string;
}

export const ScoreCards: React.FC<CardsProps> = ({
  overview,
  score,
  icon: Icon,
  color,
  lightColor,
}) => {
  const numericScore = Number(score);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#F0F0F6] bg-white p-4 transition-all duration-200 hover:border-[#E0E0EA] hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: lightColor }}
        >
          <Icon className="h-5 w-5" style={{ color }} strokeWidth={2.2} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[12px] font-medium text-[#777791]">
            {overview}
          </h3>

          <p
            className="mt-0.5 text-[18px] font-semibold leading-none"
            style={{ color }}
          >
            {score}
            <span className="ml-1 text-[11px] font-normal text-[#A0A0B4]">
              / 100
            </span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F2F2F7]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, numericScore))}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};