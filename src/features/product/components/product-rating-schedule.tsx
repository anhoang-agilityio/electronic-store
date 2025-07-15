import React from 'react';

import { Progress } from '@/components/ui/progress';

type ProductRatingScheduleProps = {
  excellent: number;
  good: number;
  average: number;
  belowAverage: number;
  poor: number;
};

export function ProductRatingSchedule({
  excellent,
  good,
  average,
  belowAverage,
  poor,
}: ProductRatingScheduleProps) {
  const total = excellent + good + average + belowAverage + poor;
  const levels = [
    {
      label: 'Excellent',
      value: excellent,
      percent: total ? (excellent / total) * 100 : 0,
    },
    {
      label: 'Good',
      value: good,
      percent: total ? (good / total) * 100 : 0,
    },
    {
      label: 'Average',
      value: average,
      percent: total ? (average / total) * 100 : 0,
    },
    {
      label: 'Below Average',
      value: belowAverage,
      percent: total ? (belowAverage / total) * 100 : 0,
    },
    {
      label: 'Poor',
      value: poor,
      percent: total ? (poor / total) * 100 : 0,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full product-rating-schedule-root">
      {levels.map((level) => (
        <div key={level.label} className="flex items-center gap-4 w-full">
          <span id={level.label} className="w-[150px] text-sm">
            {level.label}
          </span>
          <div className="flex-1">
            <Progress
              aria-labelledby={level.label}
              value={level.percent}
              className="h-[5px]"
            />
          </div>
          <span className="w-7 text-sm text-right">{level.value}</span>
        </div>
      ))}
    </div>
  );
}
