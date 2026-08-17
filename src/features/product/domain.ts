import { Schema } from 'effect';

const ReviewSchema = Schema.Struct({
  rating: Schema.Number,
  comment: Schema.String,
  date: Schema.String,
  reviewerName: Schema.String,
});

const ProductDetailSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Record({ key: Schema.String, value: Schema.String }),
});

export class Product extends Schema.Class<Product>('Product')({
  id: Schema.String.pipe(Schema.nonEmptyString()),
  name: Schema.Trim.pipe(Schema.nonEmptyString()),
  images: Schema.mutable(Schema.Array(Schema.String)),
  price: Schema.Number,
  discountPercent: Schema.Number,
  description: Schema.String,
  shippingInfo: Schema.String,
  availability: Schema.Literal('in_stock', 'out_of_stock', 'preorder'),
  warranty: Schema.String,
  relatedProductIds: Schema.mutable(Schema.Array(Schema.String)),
  detailDescription: Schema.String,
  details: ProductDetailSchema,
  reviews: Schema.mutable(Schema.Array(ReviewSchema)),
  brandId: Schema.String.pipe(Schema.nonEmptyString()),
  categoryId: Schema.String.pipe(Schema.nonEmptyString()),
  rating: Schema.optional(Schema.Number),
  isNewArrival: Schema.optional(Schema.Boolean),
  isBestseller: Schema.optional(Schema.Boolean),
  isFeatured: Schema.optional(Schema.Boolean),
  isDiscount: Schema.optional(Schema.Boolean),
}) {
  static toPlain(self: Product): typeof Product.Encoded {
    return Schema.encodeSync(Product)(self);
  }
}
