import Image from 'next/image';
import * as React from 'react';

export function SearchBar({
  placeholder = 'Search',
  value,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <Image
        src="/search.svg"
        alt="search"
        width={24}
        height={24}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-0.75"
      />
      <input
        type="search"
        className="w-full pl-12 pr-4 py-4 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-primary transition placeholder-gray-400 placeholder:font-medium placeholder:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
