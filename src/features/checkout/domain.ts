import { Schema } from 'effect';

import { Address } from '@/features/address/domain';
import { CartItem } from '@/features/cart/domain';
import { ShipmentInfo } from '@/features/shipment/domain';

const ESTIMATED_TAX_RATE = 0.08;

export class CreditCardInfo extends Schema.Class<CreditCardInfo>(
  'CreditCardInfo',
)({
  cardholderName: Schema.String.pipe(
    Schema.nonEmptyString({ message: () => 'Cardholder name is required' }),
  ),
  cardNumber: Schema.String.pipe(
    Schema.pattern(/^[0-9]{10}$/, {
      message: () => 'Card number must be 10 digits',
    }),
  ),
  expiryDate: Schema.String.pipe(
    Schema.pattern(/^(0[1-9]|1[0-2])\/(\d{2})$/, {
      message: () => 'Format MM/YY',
    }),
  ),
  cvv: Schema.String.pipe(
    Schema.pattern(/^[0-9]{3,4}$/, {
      message: () => 'CVV must be 3 or 4 digits',
    }),
  ),
}) {}

export class Checkout extends Schema.Class<Checkout>('Checkout')({
  products: Schema.Array(CartItem),
  address: Schema.NullOr(Address),
  shipment: Schema.NullOr(ShipmentInfo),
  creditCard: Schema.NullOr(CreditCardInfo),
}) {
  static empty(): Checkout {
    return new Checkout({
      products: [],
      address: null,
      shipment: null,
      creditCard: null,
    });
  }

  static getEstimatedTax(subtotal: number): number {
    return subtotal > 0 ? Math.round(subtotal * ESTIMATED_TAX_RATE) : 0;
  }

  setProducts(products: readonly CartItem[]): Checkout {
    return this.copy({ products });
  }

  setAddress(address: Address | null): Checkout {
    return this.copy({ address });
  }

  setShipment(shipment: ShipmentInfo | null): Checkout {
    return this.copy({ shipment });
  }

  setCreditCard(creditCard: CreditCardInfo | null): Checkout {
    return this.copy({ creditCard });
  }

  clearProducts(): Checkout {
    return this.setProducts([]);
  }

  clearAddress(): Checkout {
    return this.setAddress(null);
  }

  clearShipment(): Checkout {
    return this.setShipment(null);
  }

  clearCreditCard(): Checkout {
    return this.setCreditCard(null);
  }

  getSubtotal(): number {
    return this.products.reduce(
      (subtotal, item) => subtotal + item.getSubtotal(),
      0,
    );
  }

  getEstimatedTax(): number {
    return Checkout.getEstimatedTax(this.getSubtotal());
  }

  getShippingFee(): number {
    return this.shipment?.price ?? 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getEstimatedTax() + this.getShippingFee();
  }

  private copy(
    changes: Partial<{
      products: readonly CartItem[];
      address: Address | null;
      shipment: ShipmentInfo | null;
      creditCard: CreditCardInfo | null;
    }>,
  ): Checkout {
    return new Checkout({
      products: changes.products ?? this.products,
      address: changes.address === undefined ? this.address : changes.address,
      shipment:
        changes.shipment === undefined ? this.shipment : changes.shipment,
      creditCard:
        changes.creditCard === undefined ? this.creditCard : changes.creditCard,
    });
  }
}

export type CreditCardInfoData = typeof CreditCardInfo.Encoded;
export type CheckoutData = typeof Checkout.Encoded;
