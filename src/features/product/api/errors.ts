import { Schema } from 'effect';

import { HttpResponseError } from '@/lib/http-client';

export class ProductNotFoundError extends Schema.TaggedError<ProductNotFoundError>(
  'ProductNotFoundError',
)('ProductNotFoundError', { productId: Schema.String }) {}

export class ProductApiError extends Schema.TaggedError<ProductApiError>(
  'ProductApiError',
)('ProductApiError', {
  operation: Schema.String,
  cause: Schema.Defect,
}) {}

export type Error = ProductNotFoundError | ProductApiError;

export function mapError(
  operation: string,
  productId?: string,
): (error: unknown) => Error {
  return (error) =>
    productId !== undefined &&
    error instanceof HttpResponseError &&
    error.status === 404
      ? new ProductNotFoundError({ productId })
      : new ProductApiError({ operation, cause: error });
}
