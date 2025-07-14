'use client';

import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Dispatch, SetStateAction } from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useBreakpoints } from '@/hooks/use-breakpoints';

// Brand type definition
type Brand = {
  brandId: string;
  brandName: string;
};

type ProductFilterPanelProps = {
  price: [number, number];
  setPrice: Dispatch<SetStateAction<[number, number]>>;
  brandSearch: string;
  setBrandSearch: Dispatch<SetStateAction<string>>;
  selectedBrands: Brand[];
  setSelectedBrands: Dispatch<SetStateAction<Brand[]>>;
  brands: Brand[];
  onApply?: () => void;
};

function ProductFilterPanel({
  price,
  setPrice,
  brandSearch,
  setBrandSearch,
  selectedBrands,
  setSelectedBrands,
  brands,
  onApply,
}: ProductFilterPanelProps) {
  // Filter brands by search
  const filteredBrands = brands.filter((brand: Brand) =>
    brand.brandName.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  return (
    <div className="px-8 flex flex-col gap-4">
      <Accordion type="multiple" className="divide-y">
        {/* Price filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="h-12 text-base font-medium cursor-pointer">
            Price
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="flex justify-between text-sm mb-2">
              <span>From</span>
              <span>To</span>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 border rounded px-2 py-1 text-center text-base">
                {price[0].toLocaleString()}
              </div>
              <span className="h-0.5 w-5 bg-muted rounded-full" />
              <div className="flex-1 border rounded px-2 py-1 text-center text-base">
                {price[1].toLocaleString()}
              </div>
            </div>
            <Slider
              min={0}
              max={12999}
              value={price}
              onValueChange={(v) => setPrice(v as [number, number])}
              className="mt-4"
            />
          </AccordionContent>
        </AccordionItem>
        {/* Brand filter */}
        <AccordionItem value="brand">
          <AccordionTrigger className="h-12 text-base font-medium cursor-pointer">
            Brand
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <Input
              placeholder="Search"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="mb-2 bg-muted rounded-lg px-3 py-2 text-sm"
            />
            <ScrollArea className="h-40 pr-2">
              <div className="flex flex-col gap-2">
                {filteredBrands.map((brand: Brand) => (
                  <label
                    key={brand.brandId}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedBrands.some(
                        (b) => b.brandId === brand.brandId,
                      )}
                      onCheckedChange={(checked) => {
                        setSelectedBrands(
                          checked
                            ? [...selectedBrands, brand]
                            : selectedBrands.filter(
                                (b) => b.brandId !== brand.brandId,
                              ),
                        );
                      }}
                    />
                    <span className="text-sm">{brand.brandName}</span>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button className="w-full mt-10" onClick={onApply}>
        Apply
      </Button>
    </div>
  );
}

type ProductFilterProps = {
  brands?: Brand[];
};

export function ProductFilter({ brands = [] }: ProductFilterProps) {
  const { isSmScreen, isMdScreen } = useBreakpoints();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') ?? '0'),
    parseInt(searchParams.get('maxPrice') ?? '12999'),
  ]);
  const [brandSearch, setBrandSearch] = useState('');

  // Initialize selected brands from URL params
  const initialSelectedBrands: Brand[] = [];
  const brandsParam = searchParams.get('brands');
  if (brandsParam) {
    const brandIds = brandsParam.split(',');
    brandIds.forEach((brandId) => {
      const brand = brands.find((b) => b.brandId === brandId);
      if (brand) {
        initialSelectedBrands.push(brand);
      }
    });
  }
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>(
    initialSelectedBrands,
  );

  // Function to apply filters and navigate
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset page when applying new filters

    // Update price params
    params.set('minPrice', price[0].toString());
    params.set('maxPrice', price[1].toString());

    // Update brands param
    if (selectedBrands.length > 0) {
      const brandIds = selectedBrands.map((brand) => brand.brandId).join(',');
      params.set('brands', brandIds);
    } else {
      params.delete('brands');
    }

    // Navigate to current page with new params
    router.push(`?${params.toString()}`, { scroll: false });

    // Close mobile sheet if open
    if (open) {
      setOpen(false);
    }
  };

  // Mobile: show sheet
  if (isSmScreen || isMdScreen) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="px-4 py-2 h-9 tracking-wide flex justify-between gap-10 text-base font-normal rounded-md border-border"
          >
            Filter
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="pl-2 py-8 w-full">
          {/* Header */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-circle"
              onClick={() => setOpen(false)}
              aria-label="Back"
            >
              <ChevronLeft />
            </Button>
            <SheetTitle>Filters</SheetTitle>
          </div>
          <ProductFilterPanel
            price={price}
            setPrice={setPrice}
            brandSearch={brandSearch}
            setBrandSearch={setBrandSearch}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            brands={brands}
            onApply={handleApplyFilters}
          />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: show sidebar
  return (
    <aside className="hidden md:flex flex-col">
      <div className="text-xl font-semibold mb-6">Filters</div>
      <ProductFilterPanel
        price={price}
        setPrice={setPrice}
        brandSearch={brandSearch}
        setBrandSearch={setBrandSearch}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        brands={brands}
        onApply={handleApplyFilters}
      />
    </aside>
  );
}
