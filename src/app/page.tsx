import { type Metadata } from 'next';

import { CategoryList } from '@/features/category/components/category-list/category-list';
import { AirpodsMaxBanner } from '@/features/product/components/banners/airpods-max';
import { Iphone14ProBanner } from '@/features/product/components/banners/iphone-14-pro';
import { MacbookAirBanner } from '@/features/product/components/banners/macbook-air';
import { Playstation5Banner } from '@/features/product/components/banners/playstation-5';
import { SummerSaleBanner } from '@/features/product/components/banners/summer-sale';
import { VisionProBanner } from '@/features/product/components/banners/vision-pro';
import { ProductDiscount } from '@/features/product/components/product-discount';
import { ProductTab } from '@/features/product/components/product-tab';

export const metadata: Metadata = {
  title: 'Electronic Store - Modern Electronics Shop',
  description:
    'Discover the latest, genuine electronics at the best prices at Electronic Store.',
  openGraph: {
    title: 'Electronic Store - Modern Electronics Shop',
    description:
      'Discover the latest, genuine electronics at the best prices at Electronic Store.',
    images: [
      {
        url: '/summer-sale.png',
        width: 1200,
        height: 630,
        alt: 'Electronic Store Summer Sale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electronic Store - Modern Electronics Shop',
    description:
      'Discover the latest, genuine electronics at the best prices at Electronic Store.',
    images: {
      url: '/summer-sale.png',
      width: 1200,
      height: 630,
      alt: 'Electronic Store Summer Sale',
    },
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  return (
    <main>
      <section>
        <Iphone14ProBanner />
        <div className="grid grid-cols-1 md:grid-cols-[25%_25%_50%]">
          <div className="md:col-span-2">
            <Playstation5Banner />
          </div>
          <div className="md:row-span-2">
            <MacbookAirBanner />
          </div>
          <div className="order-first md:order-none">
            <AirpodsMaxBanner />
          </div>
          <div className="order-first md:order-none">
            <VisionProBanner />
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <CategoryList />
      </section>

      <section>
        <ProductTab tab={tab} />
      </section>

      <section className="py-14">
        <ProductDiscount />
      </section>

      <section>
        <SummerSaleBanner />
      </section>
    </main>
  );
}
