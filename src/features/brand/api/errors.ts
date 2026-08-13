import { Schema } from 'effect';

export class BrandApiError extends Schema.TaggedError<BrandApiError>(
  'BrandApiError',
)('BrandApiError', {
  operation: Schema.String,
  cause: Schema.Defect,
}) {}

export type Error = BrandApiError;
