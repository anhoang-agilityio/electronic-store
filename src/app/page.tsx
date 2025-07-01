import { BrandList } from '@/features/brands/components';
import AirpodsMaxBanner from '@/features/products/components/banners/airpods-max';
import Iphone14Banner from '@/features/products/components/banners/iphone-14-pro';
import MacbookAirBanner from '@/features/products/components/banners/macbook-air';
import Playstation5Banner from '@/features/products/components/banners/playstation-5';
import SummerSaleBanner from '@/features/products/components/banners/summer-sale';
import VisionProBanner from '@/features/products/components/banners/vision-pro';
import { ProductCard } from '@/features/products/components/product-card';

export default function Home() {
  return (
    <>
      <div>
        <Iphone14Banner />
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
      </div>
      <div className="w-65 rounded-md">
        <ProductCard
          product={{
            id: '1',
            name: 'Apple iPhone 6 Plus',
            price: 100,
            image:
              'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6-plus2.jpg',
            isFavorite: false,
          }}
        />
      </div>
      <SummerSaleBanner />
      <BrandList />
    </>
  );
}
