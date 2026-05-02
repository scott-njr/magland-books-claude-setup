import { expect, test } from '@playwright/test';

// Lightweight smoke tests — no form submissions, no network mutations.
// `test:e2e:live` env flag (E2E_SUBMIT_FORM=1) is reserved for integration
// tests that hit the real Apps Script endpoint.

test('home page renders the family letter and a book row', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /We are/i, level: 1 })).toBeVisible();
  await expect(page.getByText('Pirate Flu', { exact: false })).toBeVisible();
  await expect(page.getByText('Mags & MarMar', { exact: false })).toBeVisible();
});

test('primary nav has all five flat links visible on desktop', async ({ page }) => {
  await page.goto('/');
  for (const label of ['Bookshelf', 'Our Family', 'Publishing', 'Letters', 'Write to Us']) {
    await expect(
      page.getByRole('link', { name: label, exact: true }).first(),
    ).toBeVisible();
  }
});

test('bookshelf page shows both titles + coming-soon card', async ({ page }) => {
  await page.goto('/bookshelf');
  await expect(page.getByRole('heading', { name: /Every Magland title/i })).toBeVisible();
  await expect(page.getByText('Pirate Flu', { exact: false })).toBeVisible();
  await expect(page.getByText('Coming soon', { exact: false })).toBeVisible();
});

test('book detail page renders cover, byline, and add to bag', async ({ page }) => {
  await page.goto('/bookshelf/pirate-flu');
  await expect(page.getByRole('heading', { name: /Pirate Flu/i, level: 1 })).toBeVisible();
  await expect(page.getByText(/Leigh Gardener/)).toBeVisible();
  await expect(page.getByRole('button', { name: /Add Pirate Flu to bag/i })).toBeVisible();
});

test('write-to-us page shows the contact form', async ({ page }) => {
  await page.goto('/write-to-us');
  await expect(page.getByLabel(/Your name/i)).toBeVisible();
  await expect(page.getByLabel(/^Email$/i)).toBeVisible();
  await expect(page.getByLabel(/What would you like to tell us/i)).toBeVisible();
});

test('newsletter form is reachable from the home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
});

test('404 page renders brand-consistent copy', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await expect(page.getByText(/this page got lost/i)).toBeVisible();
});
