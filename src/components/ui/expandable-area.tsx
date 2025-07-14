'use client';

import { ChevronDown } from 'lucide-react';
import React, { useRef, useState, useEffect, ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type ExpandableAreaProps = {
  children: ReactNode;
  maxHeight?: string;
  expandedClassName?: string;
  collapsedClassName?: string;
  buttonText?: {
    expand: string;
    collapse: string;
  };
  buttonClassName?: string;
  showIcon?: boolean;
  onToggle?: (expanded: boolean) => void;
};

export const ExpandableArea: React.FC<ExpandableAreaProps> = ({
  children,
  maxHeight = '500px',
  expandedClassName = '',
  collapsedClassName = '',
  buttonText = {
    expand: 'View More',
    collapse: 'View Less',
  },
  buttonClassName = 'border-gray-500 text-black flex items-center gap-2 px-8 py-3 rounded-lg text-base font-medium',
  showIcon = true,
  onToggle,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const el = contentRef.current;
      if (el) {
        setShowButton(el.scrollHeight > el.clientHeight);
      }
    };

    // Use a small delay to ensure the content is rendered
    const timeoutId = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [children]);

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const renderIcon = () => {
    if (!showIcon) return null;

    return (
      <span className="inline-block">
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={contentRef}
        className={`transition-all duration-300 ${
          expanded ? expandedClassName : `${collapsedClassName} overflow-hidden`
        }`}
        style={{
          maxHeight: expanded ? 'none' : maxHeight,
        }}
      >
        {children}
      </div>

      {showButton && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className={buttonClassName}
            onClick={handleToggle}
          >
            {expanded ? buttonText.collapse : buttonText.expand}
            {renderIcon()}
          </Button>
        </div>
      )}
    </div>
  );
};
