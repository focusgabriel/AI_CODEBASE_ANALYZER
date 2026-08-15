type ScoreCircleProps = {
  score: number;
};

export default function ScoreCircle({
  score,
}: ScoreCircleProps) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getScoreStyles = () => {
    if (score >= 70) {
      return {
        color: "#16B86A",
        background: "#ECFAF3",
      };
    }

    if (score >= 50) {
      return {
        color: "#F59E0B",
        background: "#FFF7E8",
      };
    }

    return {
      color: "#FF4D4D",
      background: "#FFF0F0",
    };
  };

  const { color, background } = getScoreStyles();

  return (
    <div
      className="relative flex h-9 w-9 items-center justify-center"
      style={{
        backgroundColor: background,
        borderRadius: "50%",
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        className="absolute inset-0"
      >
        {/* Background ring */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="#DDE9E4"
          strokeWidth="2"
        />

        {/* Score ring */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 18 18)"
        />
      </svg>

      <span
        className="relative z-10 text-[11px] font-semibold leading-none"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}