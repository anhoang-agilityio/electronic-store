import Image from 'next/image';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RatingStars } from '@/components/ui/rating-stars';
import { getInitials } from '@/utils/string';

export type ProductReviewProps = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  avatar?: string;
  images?: string[];
  className?: string;
};

export function ProductReview({
  rating,
  comment,
  date,
  reviewerName,
  avatar,
  images = [],
}: ProductReviewProps) {
  return (
    <div className="flex flex-col gap-2 p-6 bg-muted rounded-lg">
      {/* Date */}
      <p className="flex justify-end text-sm text-muted-foreground shrink-0">
        {date}
      </p>

      <div className="flex flex-row items-start gap-4">
        {/* User Avatar */}
        <Avatar className="size-14 shrink-0">
          <AvatarImage src={avatar} alt={reviewerName} />
          <AvatarFallback className="text-sm font-medium">
            {getInitials(reviewerName, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-base font-semibold">{reviewerName}</h3>

          {/* Rating Stars */}
          <RatingStars rating={rating} size={20} color="#FFB646" />

          {/* Review Text */}
          <p>{comment}</p>

          {/* Review Images */}
          {images.length > 0 && (
            <div className="flex flex-row gap-2 mt-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-[118px] h-[88px] rounded-md overflow-hidden shrink-0"
                >
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-fill"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
