import { expect, test } from "@playwright/test";

test("member manages a vehicle, favorites an event, and updates preferences", async ({ page }) => {
  await page.goto("/signin");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /Welcome back, Alex/i })).toBeVisible();

  await page.getByRole("link", { name: "My garage", exact: true }).click();
  await page.getByRole("button", { name: "Add vehicle" }).click();
  await page.getByLabel("Year").fill("1988");
  await page.getByLabel("Make").fill("BMW");
  await page.getByLabel("Model").fill("M3");
  await page.getByLabel("Nickname").fill("E2E car");
  await page.getByRole("button", { name: "Save vehicle" }).click();
  await expect(page.getByRole("heading", { name: "1988 BMW M3" })).toBeVisible();
  const testCard = page.getByRole("heading", { name: "1988 BMW M3" }).locator("../..");
  await testCard.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Nickname").fill("E2E updated");
  await page.getByRole("button", { name: "Save vehicle" }).click();
  await expect(page.getByText("E2E updated")).toBeVisible();

  await page.getByRole("link", { name: "Events", exact: true }).click();
  const favoriteButton = page.getByRole("button", { name: /^Favorite / }).first();
  if (await favoriteButton.isVisible()) await favoriteButton.click();

  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByLabel("Text messages").check();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toHaveText("Changes saved.");
});
