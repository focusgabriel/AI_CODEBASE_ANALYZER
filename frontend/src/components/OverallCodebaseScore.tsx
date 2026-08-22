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
  const safeMaxScore =
    Number.isFinite(maxScore) && maxScore > 0 ? maxScore : 100;
  const safeScore = Number.isFinite(score)
    ? Math.max(0, Math.min(score, safeMaxScore))
    : 0;

  const config = getScoreConfig(safeScore);

  const percentage = (safeScore / safeMaxScore) * 100;

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
        <div className="flex w-full min-w-0 flex-col items-center gap-6 rounded-[14px] border border-[#F0F0F6] bg-white px-4 py-6 sm:min-h-[228px] sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-5 lg:gap-6">
          {/* Score circle */}
          <div className="flex w-full shrink-0 items-center justify-center sm:w-[42%] sm:min-w-0">
            <div className="relative aspect-square h-auto w-[min(100%,150px)] sm:h-[190px] sm:w-[190px]">
              <svg
                viewBox="0 0 190 190"
                className="h-full w-full -rotate-90"
                aria-hidden="true"
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
                  className="text-[40px] font-semibold leading-none tracking-[-2px] sm:text-[50px]"
                  style={{
                    color: config.color,
                  }}
                >
                  {Math.round(safeScore)}
                </span>

                <span className="mt-2 text-[13px] font-medium text-[#777791]">
                  / {safeMaxScore}
                </span>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex min-w-0 w-full flex-1 flex-col items-center justify-center text-center sm:items-start sm:text-left">
            {/* Rating */}
            <h3
              className="text-[18px] font-semibold leading-tight sm:text-[21px]"
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
