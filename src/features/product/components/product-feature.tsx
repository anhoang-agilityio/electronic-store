import React from 'react';

export type ProductFeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function ProductFeature({
  icon,
  title,
  description,
}: ProductFeatureProps) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center justify-center size-14 rounded-lg bg-input [&_svg]:size-6">
        {icon}
      </div>
      <div className="flex flex-col justify-center gap-2">
        <span className="text-muted-foreground font-medium" title={title}>
          {title}
        </span>
        <span className="text-foreground" title={description}>
          {description}
        </span>
      </div>
    </div>
  );
}
