import { Schema } from 'effect';

export class Address extends Schema.Class<Address>('Address')({
  id: Schema.String.pipe(Schema.nonEmptyString()),
  title: Schema.String.pipe(Schema.nonEmptyString()),
  address: Schema.String.pipe(Schema.nonEmptyString()),
  phone: Schema.String.pipe(Schema.nonEmptyString()),
  tag: Schema.optional(Schema.String),
}) {
  update(input: AddressInput): Address {
    return new Address({ id: this.id, ...input });
  }
}

export type AddressData = typeof Address.Encoded;
export type AddressInput = Omit<AddressData, 'id'>;
