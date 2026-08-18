import { Effect, Schema } from 'effect';

export class InvalidCartQuantity extends Schema.TaggedError<InvalidCartQuantity>(
  'InvalidCartQuantity',
)('InvalidCartQuantity', {
  quantity: Schema.Number,
}) {}

function validateQuantity(
  quantity: number,
): Effect.Effect<number, InvalidCartQuantity> {
  return Number.isSafeInteger(quantity) && quantity > 0
    ? Effect.succeed(quantity)
    : Effect.fail(new InvalidCartQuantity({ quantity }));
}

export class CartProductSnapshot extends Schema.Class<CartProductSnapshot>(
  'CartProductSnapshot',
)({
  id: Schema.String.pipe(Schema.nonEmptyString()),
  name: Schema.String.pipe(Schema.nonEmptyString()),
  price: Schema.Number.pipe(Schema.nonNegative()),
  image: Schema.String,
}) {}

export class CartItem extends Schema.Class<CartItem>('CartItem')({
  product: CartProductSnapshot,
  quantity: Schema.Number.pipe(Schema.int(), Schema.positive()),
}) {
  changeQuantity(
    quantity: number,
  ): Effect.Effect<CartItem, InvalidCartQuantity> {
    return validateQuantity(quantity).pipe(
      Effect.map(
        (validQuantity) =>
          new CartItem({
            product: this.product,
            quantity: validQuantity,
          }),
      ),
    );
  }

  increase(amount: number): Effect.Effect<CartItem, InvalidCartQuantity> {
    return validateQuantity(amount).pipe(
      Effect.flatMap(() => this.changeQuantity(this.quantity + amount)),
    );
  }

  getSubtotal(): number {
    return this.product.price * this.quantity;
  }
}

export class Cart extends Schema.Class<Cart>('Cart')({
  items: Schema.Array(CartItem),
}) {
  static empty(): Cart {
    return new Cart({ items: [] });
  }

  addItem(
    product: CartProductSnapshot,
    quantity: number,
  ): Effect.Effect<Cart, InvalidCartQuantity> {
    return validateQuantity(quantity).pipe(
      Effect.flatMap((validQuantity) => {
        const existingItem = this.items.find(
          (item) => item.product.id === product.id,
        );

        if (!existingItem) {
          return Effect.succeed(
            new Cart({
              items: [
                ...this.items,
                new CartItem({ product, quantity: validQuantity }),
              ],
            }),
          );
        }

        return existingItem.increase(validQuantity).pipe(
          Effect.map(
            (updatedItem) =>
              new Cart({
                items: this.items.map((item) =>
                  item.product.id === product.id ? updatedItem : item,
                ),
              }),
          ),
        );
      }),
    );
  }

  removeItem(productId: string): Cart {
    return new Cart({
      items: this.items.filter((item) => item.product.id !== productId),
    });
  }

  changeQuantity(
    productId: string,
    quantity: number,
  ): Effect.Effect<Cart, InvalidCartQuantity> {
    const item = this.items.find(({ product }) => product.id === productId);
    if (!item) return Effect.succeed(this);

    return item.changeQuantity(quantity).pipe(
      Effect.map(
        (updatedItem) =>
          new Cart({
            items: this.items.map((currentItem) =>
              currentItem.product.id === productId ? updatedItem : currentItem,
            ),
          }),
      ),
    );
  }

  clear(): Cart {
    return Cart.empty();
  }

  getTotalQuantity(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.items.reduce(
      (subtotal, item) => subtotal + item.getSubtotal(),
      0,
    );
  }
}

export type CartProductSnapshotData = typeof CartProductSnapshot.Encoded;
export type CartItemData = typeof CartItem.Encoded;
export type CartData = typeof Cart.Encoded;
