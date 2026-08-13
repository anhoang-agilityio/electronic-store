import { Schema } from 'effect';

import { HttpResponseError } from '@/lib/http-client';

export class CategoryNotFoundError extends Schema.TaggedError<CategoryNotFoundError>(
  'CategoryNotFoundError',
)('CategoryNotFoundError', { categoryId: Schema.String }) {}

export class CategoryApiError extends Schema.TaggedError<CategoryApiError>(
  'CategoryApiError',
)('CategoryApiError', {
  operation: Schema.String,
  cause: Schema.Defect,
}) {}

export type Error = CategoryNotFoundError | CategoryApiError;

export function mapError(
  operation: string,
  categoryId?: string,
): (error: unknown) => Error {
  return (error) =>
    categoryId !== undefined &&
    error instanceof HttpResponseError &&
    error.status === 404
      ? new CategoryNotFoundError({ categoryId })
      : new CategoryApiError({ operation, cause: error });
}
