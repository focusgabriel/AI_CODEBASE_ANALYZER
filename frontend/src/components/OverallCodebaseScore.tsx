/** @format */

import React from "react";
import { ScoreDelta } from "./ScoreDelta";

type OverallCodebaseScoreProps = {
  score: number;
  previousScore?: number | null;
  maxScore?: number;
  title?: string;
};

type ScoreConfig = {
  label: string;
  color: string;
  lightColor: string;
  gradientStart: string;
  gradientEnd: string;
};

function getScoreConfig(score: number): ScoreConfig {
  if (score >= 90) {
    return {
      label: "Excellent",
      color: "#16B86A",
      lightColor: "#ECFAF3",
      gradientStart: "#B9F0D5",
      gradientEnd: "#16B86A",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      color: "#16B86A",
      lightColor: "#ECFAF3",
      gradientStart: "#B9F0D5",
      gradientEnd: "#16B86A",
    };
  }

  if (score >= 50) {
    return {
      label: "Needs Improvement",
      color: "#F58220",
      lightColor: "#FFF4E8",
      gradientStart: "#FFE1A8",
      gradientEnd: "#F58220",
    };
  }

  if (score >= 40) {
    return {
      label: "Poor",
      color: "#F59E0B",
      lightColor: "#FFF7E8",
      gradientStart: "#FFE2A8",
      gradientEnd: "#F59E0B",
    };
  }

  return {
    label: "Very Poor",
    color: "#EF4444",
    lightColor: "#FFF0F0",
    gradientStart: "#FFD0D0",
    gradientEnd: "#EF4444",
  };
}

export default function OverallCodebaseScore({
  score,
  previousScore = null,
  maxScore = 100,
  title = "Overall Codebase Score",
}: OverallCodebaseScoreProps) {
  const safeScore = Math.max(0, Math.min(score, maxScore));

  const config = getScoreConfig(safeScore);

  const percentage = maxScore > 0 ? (safeScore / maxScore) * 100 : 0;

  const delta =
    previousScore !== null && previousScore !== undefined
      ? safeScore - previousScore
      : null;

  const radius = 82;
  const circumference = 2 * Math.PI * radius;

  const dashOffset = circumference - (percentage / 100) * circumference;

  const gradientId = React.useId();

  return (
    <section className="w-full">
      {/* Section title */}
      <h2 className="mb-4 px-1 text-[15px] font-semibold text-[#202033]">
        {title}
      </h2>

      {/* Main card */}
      <div className="w-full rounded-2xl border border-[#ECECF4] bg-white p-3">
        <div className="flex min-h-[228px] w-full items-center rounded-[14px] border border-[#F0F0F6] bg-white px-6 py-5">
          {/* Score circle */}
          <div className="flex w-[42%] min-w-[230px] items-center justify-center">
            <div className="relative h-[190px] w-[190px]">
              <svg
                width="190"
                height="190"
                viewBox="0 0 190 190"
                className="-rotate-90"
              >
                <defs>
                  {/* Progress gradient */}
                  <linearGradient
                    id={gradientId}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={config.gradientStart} />

                    <stop offset="100%" stopColor={config.gradientEnd} />
                  </linearGradient>
                </defs>

                {/* Background ring */}
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke="#F6F6F8"
                  strokeWidth="10"
                />

                {/* Score progress */}
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition: "stroke-dashoffset 700ms ease",
                  }}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-[50px] font-semibold leading-none tracking-[-2px]"
                  style={{
                    color: config.color,
                  }}
                >
                  {Math.round(safeScore)}
                </span>

                <span className="mt-2 text-[13px] font-medium text-[#777791]">
                  / {maxScore}
                </span>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-1 flex-col justify-center">
            {/* Rating */}
            <h3
              className="text-[21px] font-semibold leading-tight"
              style={{
                color: config.color,
              }}
            >
              {config.label}
            </h3>

            {/* Description */}
            <p className="mt-3 max-w-[360px] text-[12px] leading-[1.6] text-[#74748C]">
              Your codebase has significant areas that need attention.
              <br />
              Focus on the key issues below to improve your score.
            </p>

            {/* Comparison */}
            {delta !== null && (
              <div className="mt-4">
                <ScoreDelta delta={delta} color={config.color} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
