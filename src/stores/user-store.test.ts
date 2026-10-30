import { beforeEach, describe, expect, it } from 'vitest';

import { useUserStore } from './user-store';

const USER_ID = 'user-1';

const laptop = { id: 'laptop', name: 'Laptop', price: 100, image: '/l.png' };
const mouse = { id: 'mouse', name: 'Mouse', price: 50, image: '/m.png' };
const address = {
  id: 'addr-1',
  address: '1 Main St',
  phone: '123',
  title: 'Home',
};
const shipment = { id: 'express', description: 'Express', price: 8.5 };

function fillCheckout() {
  const store = useUserStore.getState();
  store.setCheckoutProducts([
    { product: laptop, quantity: 2 },
    { product: mouse, quantity: 1 },
  ]);
  store.setCheckoutAddress(address);
  store.setCheckoutShipment(shipment);
}

const orders = () => useUserStore.getState().userData[USER_ID]?.orders ?? [];

describe('placeOrder', () => {
  beforeEach(() => {
    useUserStore.setState({ currentUserId: null, userData: {} });
    useUserStore.getState().setCurrentUser(USER_ID);
  });

  it('returns null when nobody is signed in', () => {
    useUserStore.getState().clearCurrentUser();

    expect(useUserStore.getState().placeOrder()).toBeNull();
  });

  it('returns null while the checkout is incomplete', () => {
    const { setCheckoutProducts, setCheckoutAddress, placeOrder } =
      useUserStore.getState();

    expect(placeOrder()).toBeNull();

    setCheckoutProducts([{ product: laptop, quantity: 1 }]);
    expect(placeOrder()).toBeNull(); // no address or shipment

    setCheckoutAddress(address);
    expect(placeOrder()).toBeNull(); // no shipment
    expect(orders()).toHaveLength(0);
  });

  it('saves a snapshot of the checkout as the newest order', () => {
    fillCheckout();

    const order = useUserStore.getState().placeOrder();

    expect(order).not.toBeNull();
    expect(order?.number).toMatch(/^ES-/);
    expect(order?.items).toEqual([
      { product: laptop, quantity: 2 },
      { product: mouse, quantity: 1 },
    ]);
    expect(order?.address).toEqual(address);
    expect(order?.shipment).toEqual(shipment);
    expect(order?.totals).toEqual({
      subtotal: 250,
      tax: 20,
      shipping: 8.5,
      discount: 0,
      total: 278.5,
    });
    expect(orders()[0]).toEqual(order);
  });

  it('puts the newest order first', () => {
    fillCheckout();
    const first = useUserStore.getState().placeOrder();
    const second = useUserStore.getState().placeOrder();

    expect(orders().map((o) => o.id)).toEqual([second?.id, first?.id]);
  });

  it('keeps the order totals when the checkout changes later', () => {
    fillCheckout();
    const order = useUserStore.getState().placeOrder();

    useUserStore.getState().clearCheckout();

    expect(orders()[0]?.totals.total).toBe(order?.totals.total);
  });

  it('never stores credit card details on the order', () => {
    fillCheckout();
    useUserStore.getState().setCheckoutCreditCard({
      cardholderName: 'John Doe',
      cardNumber: '1234567890',
      expiryDate: '12/30',
      cvv: '123',
    });

    const order = useUserStore.getState().placeOrder();

    expect(JSON.stringify(order)).not.toContain('1234567890');
  });
});
