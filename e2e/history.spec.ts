import { expect, test, type Page } from "@playwright/test";

async function openFresh(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.removeItem("choicebox:choices");
    localStorage.removeItem("choicebox:history");
  });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "ChoiceBox", level: 1 }),
  ).toBeVisible();
}

async function addChoice(page: Page, label: string) {
  await page.getByLabel("新しい選択肢").fill(label);
  await page.getByRole("button", { name: "追加", exact: true }).click();
}

async function spin(page: Page) {
  await page.getByRole("button", { name: "ルーレットを回す" }).click();
}

function historyItems(page: Page) {
  return page.getByRole("list", { name: "抽選履歴" }).getByRole("listitem");
}

test("shows the empty result and history", async ({ page }) => {
  await openFresh(page);
  await expect(
    page.getByText("ルーレットを回して結果を表示します。"),
  ).toBeVisible();
  await expect(page.getByText("抽選履歴はまだありません。")).toBeVisible();
});

test("shows the same label in the result and the first history row", async ({
  page,
}) => {
  await openFresh(page);
  await addChoice(page, "ラーメン");
  await spin(page);

  const result = page.locator(".draw-result");
  await expect(result).toContainText("ラーメン");
  const items = historyItems(page);
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText("ラーメン");
});

test("prepends a newer draw and keeps the previous one", async ({ page }) => {
  await openFresh(page);
  await addChoice(page, "ラーメン");
  await spin(page);

  const items = historyItems(page);
  await expect(items).toHaveCount(1);
  const firstTime = await items.first().locator("time").innerText();

  await page.waitForTimeout(1100);
  await spin(page);

  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("ラーメン");
  await expect(items.nth(1)).toContainText("ラーメン");
  const newestTime = await items.nth(0).locator("time").innerText();
  const olderTime = await items.nth(1).locator("time").innerText();
  expect(olderTime).toBe(firstTime);
  expect(newestTime).not.toBe(olderTime);
});

test("keeps history order and the latest result after reload", async ({
  page,
}) => {
  await openFresh(page);
  await addChoice(page, "ラーメン");
  await spin(page);
  const items = historyItems(page);
  const firstTime = await items.first().locator("time").innerText();

  await page.waitForTimeout(1100);
  await spin(page);
  const newestTime = await items.nth(0).locator("time").innerText();
  const olderTime = await items.nth(1).locator("time").innerText();

  await page.reload();

  await expect(items).toHaveCount(2);
  await expect(items.nth(0).locator("time")).toHaveText(newestTime);
  await expect(items.nth(1).locator("time")).toHaveText(olderTime);
  const result = page.locator(".draw-result");
  await expect(result).toContainText("ラーメン");
  await expect(result.locator("time")).toHaveText(newestTime);
  expect(olderTime).toBe(firstTime);
});

test("keeps the recorded label after the choice is deleted", async ({
  page,
}) => {
  await openFresh(page);
  await addChoice(page, "ラーメン");
  await spin(page);
  await page.getByRole("button", { name: "「ラーメン」を削除" }).click();
  await expect(historyItems(page).first()).toContainText("ラーメン");
});
