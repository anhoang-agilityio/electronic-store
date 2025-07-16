import React from 'react';

export function PageLoading() {
  return (
    <div className="absolute min-h-[60vh] inset-0 z-50 flex items-center justify-center bg-background">
      {/* SVG spinner */}
      <svg
        className="animate-spin"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="#e5e7eb"
          strokeWidth="6"
          fill="none"
        />
        <path
          d="M44 24c0-11.046-8.954-20-20-20"
          stroke="#6366f1"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
