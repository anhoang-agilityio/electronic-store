import { z } from 'zod';
// User Store Types
export type CartItem = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
};

export type Address = {
  id: string;
  address: string;
  phone: string;
  title: string;
  tag?: string;
};

export type ShipmentInfo = {
  id: string;
  description: string;
  price: number;
};

// Zod schema for CreditCardInfo
export const creditCardInfoSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().regex(/^[0-9]{10}$/, 'Card number must be 10 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, 'Format MM/YY'),
  cvv: z.string().regex(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export type CreditCardInfo = z.infer<typeof creditCardInfoSchema>;

export type Checkout = {
  products: CartItem[];
  address: Address | null;
  shipment: ShipmentInfo | null;
  creditCard: CreditCardInfo | null;
};

export type UserData = {
  cart: CartItem[];
  addresses: Address[];
  checkout?: Checkout;
};
