import { BadgeCheck, House, Truck } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { AddToCart } from '@/features/cart/components/add-to-cart';
import { getProduct } from '@/features/product/api/get-product';
import { ProductDetail } from '@/features/product/components/product-detail';
import { ProductFeature } from '@/features/product/components/product-feature';
import { ProductRating } from '@/features/product/components/product-rating';
import { ProductRatingSchedule } from '@/features/product/components/product-rating-schedule';
import { ProductRelated } from '@/features/product/components/product-related';
import { ProductReview } from '@/features/product/components/product-review';
import { ApiError } from '@/lib/api-client';
import { getDiscountedPrice } from '@/utils/price';
import { snakeToTitleCase } from '@/utils/string';

async function fetchProductOrNotFound(productId: string) {
  try {
    return await getProduct(productId);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const productId = (await params).product;
  const product = await fetchProductOrNotFound(productId);

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0] ?? '',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0] ?? '',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const productId = (await params).product;
  const product = await fetchProductOrNotFound(productId);

  return (
    <main className="bg-muted">
      <section className="bg-background py-9 md:py-28">
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 gap-9 md:gap-8 md:justify-center md:items-center">
          {/* Product Image */}
          <div className="relative w-3/4 max-w-100 aspect-square">
            <Image
              src={product.images[0] ?? ''}
              alt={product.name}
              sizes="400px"
              fill
              priority
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h1 className="text-5xl font-bold">{product.name}</h1>
              <p className="flex gap-2 items-center">
                <span className="text-3xl font-medium">
                  $
                  {getDiscountedPrice(
                    product.price,
                    product.discountPercent,
                  ).toLocaleString()}
                </span>
                {!!product.discountPercent && (
                  <span className="text-2xl text-muted-foreground font-normal line-through">
                    ${product.price.toLocaleString()}
                  </span>
                )}
              </p>
              <div className="flex flex-col gap-3">
                <ProductFeature
                  title="Delivery"
                  icon={<Truck />}
                  description={product.shippingInfo}
                />
                <ProductFeature
                  title="Availability"
                  icon={<House />}
                  description={snakeToTitleCase(product.availability)}
                />
                <ProductFeature
                  title="Quaranteed"
                  icon={<BadgeCheck />}
                  description={product.warranty}
                />
              </div>
              <p>{product.description}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="outline" size="xl" className="w-full" disabled>
                Add to Wishlist
              </Button>
              <AddToCart
                product={{
                  id: product.id,
                  name: product.name,
                  price: getDiscountedPrice(
                    product.price,
                    product.discountPercent,
                  ),
                  image: product.images[0] ?? '',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-4 my-10 md:my-20 max-w-7xl md:mx-auto">
        <ProductDetail
          detailDescription={product.detailDescription}
          details={product.details}
        />
      </section>

      <section className="bg-background py-10 md:py-22">
        <div className="flex flex-col gap-20 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            <h2 className="text-2xl font-medium">Review</h2>
            <div className="flex flex-col md:flex-row gap-15 md:items-center">
              <ProductRating
                rating={product.rating}
                reviewCount={product.reviews.length}
              />
              <ProductRatingSchedule
                excellent={
                  product.reviews.filter((review) => review.rating > 4).length
                }
                good={
                  product.reviews.filter(
                    (review) => review.rating > 3 && review.rating <= 4,
                  ).length
                }
                average={
                  product.reviews.filter(
                    (review) => review.rating > 2 && review.rating <= 3,
                  ).length
                }
                belowAverage={
                  product.reviews.filter(
                    (review) => review.rating > 1 && review.rating <= 2,
                  ).length
                }
                poor={
                  product.reviews.filter((review) => review.rating <= 1).length
                }
              />
            </div>
            <div className="flex flex-col gap-6 pb-6">
              {product.reviews.map((review, index) => (
                <ProductReview
                  key={index}
                  rating={review.rating}
                  comment={review.comment}
                  date={review.date}
                  reviewerName={review.reviewerName}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-10">
          <ProductRelated productId={product.id} />
        </div>
      </section>
    </main>
  );
}
