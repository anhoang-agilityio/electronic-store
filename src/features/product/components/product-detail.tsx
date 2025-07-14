'use client';

import React from 'react';

import { ExpandableArea } from '@/components/ui/expandable-area';

type ProductDetailProps = {
  title?: string;
  detailDescription: string;
  details: Record<string, Record<string, string>>;
};

export function ProductDetail({
  title = 'Details',
  detailDescription,
  details,
}: ProductDetailProps) {
  return (
    <section className="w-full bg-background rounded-md shadow-sm flex flex-col gap-8 px-6 py-12">
      {/* Title */}
      <h2 className="text-2xl font-medium">{title}</h2>

      {/* Description */}
      <p className="text-muted-foreground font-medium">{detailDescription}</p>

      {/* Details Sections */}
      <ExpandableArea
        maxHeight="500px"
        expandedClassName="flex flex-col gap-10"
        collapsedClassName="flex flex-col gap-10"
      >
        {Object.entries(details).map(([section, sectionDetails]) => (
          <div key={section} className="flex flex-col gap-4">
            <h3 className="text-xl font-medium mb-2 capitalize">
              {section.replace(/([A-Z])/g, ' $1')}
            </h3>
            <div className="flex flex-col divide-y divide-border">
              {Object.entries(sectionDetails).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                >
                  <span className="text-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ExpandableArea>
    </section>
  );
}
