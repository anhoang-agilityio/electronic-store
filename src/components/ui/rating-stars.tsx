import { Star } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

export type RatingStarsProps = {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
  color?: string;
};

export function RatingStars({
  rating,
  max = 5,
  size = 24,
  className,
  color = '#FFB646',
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasPartial = rating % 1 !== 0;

  return (
    <div className={cn('flex flex-row items-center gap-0', className)}>
      {Array.from({ length: max }).map((_, i) => {
        if (i < fullStars) {
          // Full star
          return (
            <Star
              key={i}
              size={size}
              fill={color}
              stroke={color}
              className="shrink-0"
            />
          );
        } else if (i === fullStars && hasPartial) {
          // Partial star
          return (
            <span
              key={i}
              className="relative inline-block shrink-0"
              style={{ width: size, height: size }}
            >
              <Star
                size={size}
                fill={color}
                stroke={color}
                className="absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`,
                }}
              />
              <Star
                size={size}
                fill="none"
                stroke={color}
                className="absolute top-0 left-0"
              />
            </span>
          );
        } else {
          // Empty star
          return (
            <Star
              key={i}
              size={size}
              fill="none"
              stroke={color}
              className="shrink-0"
            />
          );
        }
      })}
    </div>
  );
}
