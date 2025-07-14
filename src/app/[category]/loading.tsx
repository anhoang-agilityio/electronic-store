'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export default function CategoryLoading() {
  return (
    <AnimatePresence>
      <motion.div
        key="category-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-white"
        style={{ minHeight: '60vh' }}
      >
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
      </motion.div>
    </AnimatePresence>
  );
}
