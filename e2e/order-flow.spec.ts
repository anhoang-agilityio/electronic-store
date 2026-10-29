import { expect, test, type Page } from '@playwright/test';

// Mock user from src/auth.ts
const USER = {
  id: '1',
  email: 'john.doe@example.com',
  password: 'password123',
};

const product = (id: string, name: string, price: number) => ({
  id,
  name,
  price,
  image: '/credit-card.png',
});

// 2 x $100 + 1 x $50 = $250, 8% tax = $20, express shipping = $8.50
const SEEDED_CART = [
  { product: product('laptop', 'Laptop', 100), quantity: 2 },
  { product: product('mouse', 'Mouse', 50), quantity: 1 },
];

// Products come from an external API, so seed the persisted store instead of browsing
async function seedCart(page: Page) {
  await page.addInitScript(
    ({ userId, cart }) => {
      // Only seed once, so later page loads keep what the app saved
      if (localStorage.getItem('user-store')) return;
      localStorage.setItem(
        'user-store',
        JSON.stringify({
          state: { userData: { [userId]: { cart, addresses: [] } } },
          version: 0,
        }),
      );
    },
    { userId: USER.id, cart: SEEDED_CART },
  );
}

async function signIn(page: Page) {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(USER.email);
  await page.getByLabel('Password').fill(USER.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL('/');
}

test('places an order, finds it in the order history and buys it again', async ({
  page,
}) => {
  await seedCart(page);
  await signIn(page);

  // Cart -> checkout
  await page.goto('/cart');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Step 1: address
  await page.getByRole('button', { name: 'Add new address' }).click();
  const dialog = page.getByRole('dialog', { name: 'Add New Address' });
  await dialog.getByLabel('Title').fill('Home');
  await dialog.getByLabel('Address').fill('1 Main Street');
  await dialog.getByLabel('Phone').fill('0123456789');
  await dialog.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('radio').first().click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Step 2: shipment
  await page.getByRole('radio', { name: /as soon as possible/i }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Step 3: payment
  await page.getByPlaceholder('Cardholder Name').fill('John Doe');
  await page.getByPlaceholder('Card Number').fill('1234567890');
  await page.getByPlaceholder('Exp.Date').fill('12/30');
  await page.getByPlaceholder('CVV').fill('123');
  await page.getByRole('button', { name: 'Pay', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Confirm Payment' })
    .getByRole('button', { name: 'Pay' })
    .click();

  // Confirmation page for the new order
  await expect(page).toHaveURL(/\/orders\/[^/]+\?placed=1$/);
  const heading = page.getByRole('heading', { name: /^Order ES-[A-Z0-9]{6}$/ });
  await expect(heading).toBeVisible();
  const orderTitle = (await heading.textContent()) ?? '';
  await expect(page.getByText('$250', { exact: true })).toBeVisible();
  await expect(page.getByText('$20', { exact: true })).toBeVisible();
  await expect(page.getByText('$8.5', { exact: true })).toBeVisible();
  await expect(page.getByText('$278.5', { exact: true })).toBeVisible();

  // The cart was emptied by the purchase
  await page.goto('/cart');
  await expect(page.getByRole('button', { name: 'Checkout' })).toHaveCount(0);

  // Order history lists the order
  await page.goto('/orders');
  await expect(page.getByRole('heading', { name: 'My orders' })).toBeVisible();
  await page.getByRole('link', { name: new RegExp(orderTitle) }).click();
  await expect(page.getByRole('heading', { name: orderTitle })).toBeVisible();

  // Buy again puts the items back in the cart
  await page.getByRole('button', { name: 'Buy again' }).click();
  await expect(page.getByText('3 items added to your cart')).toBeVisible();
  await page.goto('/cart');
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Laptop' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mouse' })).toBeVisible();
});

test('redirects signed-out visitors from the order history to sign-in', async ({
  page,
}) => {
  await page.goto('/orders');

  await expect(page).toHaveURL(/\/auth\/signin\?callbackUrl=%2Forders$/);
});
