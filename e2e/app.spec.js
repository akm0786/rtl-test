import { test, expect } from '@playwright/test';

test('todo app load hota hai aur naya todo add ho sakta hai', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /todo list/i })).toBeVisible();

  await page.getByPlaceholder(/add a new todo/i).fill('Buy groceries');
  await page.getByRole('button', { name: /add/i }).click();

  await expect(page.getByText('Buy groceries')).toBeVisible();
});
