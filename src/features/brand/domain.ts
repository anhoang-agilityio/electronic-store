import { Schema } from 'effect';

export class Brand extends Schema.Class<Brand>('Brand')({
  id: Schema.String.pipe(Schema.nonEmptyString()),
  name: Schema.Trim.pipe(Schema.nonEmptyString()),
  categoryId: Schema.String.pipe(Schema.nonEmptyString()),
}) {}
