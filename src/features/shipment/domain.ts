import { Schema } from 'effect';

export class ShipmentInfo extends Schema.Class<ShipmentInfo>('ShipmentInfo')({
  id: Schema.String.pipe(Schema.nonEmptyString()),
  description: Schema.String.pipe(Schema.nonEmptyString()),
  price: Schema.Number.pipe(Schema.nonNegative()),
}) {}

export type ShipmentInfoData = typeof ShipmentInfo.Encoded;
