import { Schema } from 'effect';

export class Category extends Schema.Class<Category>('Category')({
  id: Schema.String.pipe(Schema.nonEmptyString()),
  name: Schema.Trim.pipe(Schema.nonEmptyString()),
  image: Schema.String,
}) {
  static toPlain(self: Category): typeof Category.Encoded {
    return Schema.encodeSync(Category)(self);
  }
}
