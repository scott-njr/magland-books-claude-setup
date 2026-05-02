import { expect, test } from '@playwright/test';

/**
 * Checkout smoke test — verifies the page renders with a cart and shows the
 * shipping form + Square card placeholder. We do NOT actually submit (Square
 * sandbox needs real test cards from the dev dashboard, and we don't want to
 * couple smoke tests to live network state).
 *
 * To exercise an actual sandbox checkout, run by hand against a dev server
 * with NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID
 * set, using a test card from the Square Developer dashboard.
 */

const CART_FIXTURE = [
  { bookId: 'pirate-flu', slug: 'pirate-flu', quantity: 1 },
];

test('checkout page renders order summary + shipping form when cart has items', async ({
  page,
}) => {
  // Seed localStorage before visiting /checkout so the cart hook reads it.
  await page.addInitScript((items) => {
    window.localStorage.setItem('magland.cart.v1', JSON.stringify(items));
  }, CART_FIXTURE);

  await page.goto('/checkout');

  await expect(
    page.getByRole('heading', { name: /Let's get this on its way/i }),
  ).toBeVisible();

  // Order summary
  await expect(page.getByRole('heading', { name: 'Your bag' })).toBeVisible();
  await expect(page.getByText('Pirate Flu', { exact: false }).first()).toBeVisible();

  // Shipping fields
  await expect(page.getByLabel('Your name')).toBeVisible();
  await expect(page.getByLabel(/^Email$/i)).toBeVisible();
  await expect(page.getByLabel('Street address')).toBeVisible();
  await expect(page.getByLabel('City')).toBeVisible();
  await expect(page.getByLabel('State')).toBeVisible();
  await expect(page.getByLabel('ZIP')).toBeVisible();

  // Place-order button rendered (disabled until card field initializes — Square
  // SDK won't load without env vars in CI, so we don't assert it's enabled).
  await expect(page.getByRole('button', { name: /Place order/i })).toBeVisible();
});

test('checkout page shows empty bag message when cart is empty', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem('magland.cart.v1');
  });
  await page.goto('/checkout');
  await expect(page.getByText('Your bag is empty.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Browse the bookshelf/i })).toBeVisible();
});
