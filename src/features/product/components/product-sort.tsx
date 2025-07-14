'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { withSuspense } from '@/components/utils/with-suspense';

export const ProductSort = withSuspense(function () {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') ?? '';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'rating_asc' || value === 'rating_desc') {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }

    // Reset to page 1 when sorting changes
    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger
        className="w-[164px] h-[56px] rounded-[8px] border border-[#D4D4D4] bg-white px-4 py-2 text-black text-base font-normal"
        size="default"
      >
        <SelectValue placeholder="By rating" />
      </SelectTrigger>
      <SelectContent className="w-[164px]">
        <SelectItem value="rating_desc">Highest rating</SelectItem>
        <SelectItem value="rating_asc">Lowest rating</SelectItem>
      </SelectContent>
    </Select>
  );
});
