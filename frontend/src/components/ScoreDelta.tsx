/** @format */

type ScoreDeltaProps = {
  delta: number;
  color?: string;
};

export function ScoreDelta({ delta }: ScoreDeltaProps) {
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  const iconColor = isPositive ? "#16B86A" : isNegative ? "#EF4444" : "#777791";

  const backgroundColor = isPositive
    ? "#ECFAF3"
    : isNegative
      ? "#FFF0F0"
      : "#F5F5F8";

  const displayDelta = delta > 0 ? `+${delta}` : `${delta}`;

  return (
    <div className="flex w-fit items-center gap-3 rounded-lg border border-[#EEEEF5] bg-white px-3 py-2">
      {/* Icon */}
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md"
        style={{
          backgroundColor,
        }}
      >
        {isNegative ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 5L5 19" />
            <path d="M6 5h13v13" />
          </svg>
        ) : isPositive ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 19L19 5" />
            <path d="M6 5h13v13" />
          </svg>
        ) : (
          <span className="text-[13px] font-bold" style={{ color: iconColor }}>
            —
          </span>
        )}
      </div>

      {/* Delta */}
      <div className="flex flex-col">
        <span
          className="text-[14px] font-semibold leading-none"
          style={{
            color: iconColor,
          }}
        >
          {displayDelta}
        </span>

        <span className="mt-1 text-[10px] text-[#8A8A9D]">
          vs last analysis
        </span>
      </div>
    </div>
  );
}
