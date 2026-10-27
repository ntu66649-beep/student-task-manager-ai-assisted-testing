// @ts-check
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page, request }) => {
  await request.post("/api/reset");
  await page.clock.setFixedTime(new Date("2026-10-27T12:00:00"));
  await page.goto("/");
  await page.locator("#btn-login-submit").click();
  await expect(page.locator("#result-count")).toContainText("3 / 3 nhiệm vụ");
});

test("Course filters use API data, combine with search and update after CRUD", async ({
  page,
}) => {
  await page.locator("#btn-new-task").click();
  await page.locator("#task-title").fill("Ôn tập React");
  // Punctuation must remain text in both the select and the sidebar.
  const course = 'FE <301> & "React"';
  await page.locator("#task-course").fill(course);
  await page.locator("#btn-save-task").click();
  await expect(page.locator("#task-dialog")).toBeHidden();
  await expect(page.locator("#filter-course option")).toHaveCount(3);
  await page.locator("#filter-course").selectOption(course);
  await expect(page.locator("#result-count")).toContainText("1 / 4 nhiệm vụ");
  await page.locator("#task-search").fill("on tap");
  await expect(page.locator("#tasks-list .task-name")).toHaveText(
    "Ôn tập React",
  );
  await page.locator("#filter-priority").selectOption("HIGH");
  await expect(page.locator("#tasks-empty")).toBeVisible();
  await page.locator("#filter-priority").selectOption("");
  await page.locator('[data-action="delete"]').click();
  await page.locator("#confirm-delete").click();
  await expect(page.locator("#filter-course option")).toHaveCount(2);
  await expect(page.locator("#filter-course")).toHaveValue("");
  await expect(page.locator("#course-shortcuts")).not.toContainText(course);
});

test("Sidebar course shortcut navigates and completed-page navigation clears filters", async ({
  page,
}) => {
  await page.locator('#course-shortcuts [data-course="SWT301"]').click();
  await expect(page).toHaveURL(/#tasks$/);
  await expect(page.locator("#filter-course")).toHaveValue("SWT301");
  await expect(page.locator("#course-shortcuts button")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator('[data-page="completed"]').click();
  await expect(page.locator("#filter-course")).toHaveValue("");
  await expect(page.locator("#tasks-list .task-row")).toHaveCount(1);
});

test("Calendar dates filter both list and board, and clear restores all tasks", async ({
  page,
}) => {
  const day = page.locator('[data-calendar-date="2026-10-20"]');
  await expect(day).toHaveClass(/has-deadline/);
  await day.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#tasks$/);
  await expect(day).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#result-count")).toContainText("1 / 3 nhiệm vụ");
  await expect(page.locator("#date-filter-label")).toHaveText(
    "Deadline: 20/10/2026",
  );
  await page.locator('[data-view="board"]').click();
  await expect(page.locator("#tasks-list .task-row")).toHaveCount(1);
  await page.locator('[data-calendar-date="2026-10-21"]').click();
  await expect(page.locator("#tasks-empty")).toBeVisible();
  await page.locator("#clear-filters").click();
  await expect(page.locator("#tasks-list .task-row")).toHaveCount(3);
  await expect(page.locator("#date-filter-label")).toBeHidden();
  await expect(
    page.locator('[data-calendar-date][aria-pressed="true"]'),
  ).toHaveCount(0);
});

test("Calendar handles month/year boundaries and returns to today", async ({
  page,
}) => {
  await page.locator("#calendar-next").click();
  await page.locator("#calendar-next").click();
  await page.locator("#calendar-next").click();
  await expect(page.locator("#calendar-month")).toHaveText("tháng 1 năm 2027");
  await expect(page.locator("[data-calendar-date]")).toHaveCount(31);
  await page.locator("#calendar-next").click();
  await expect(page.locator("[data-calendar-date]")).toHaveCount(28);
  await page.locator("#calendar-prev").click();
  await expect(page.locator("#calendar-month")).toHaveText("tháng 1 năm 2027");
  await page.locator("#calendar-today").click();
  await expect(page.locator("#calendar-month")).toHaveText("tháng 10 năm 2026");
  await expect(page.locator('[aria-current="date"]')).toHaveAttribute(
    "data-calendar-date",
    "2026-10-27",
  );
});

test("Deadline detail and planner counts stay in sync when a task is completed", async ({
  page,
}) => {
  await expect(page.locator("#deadline-count")).toHaveText("2");
  await page.locator('[data-deadline-id="2"]').click();
  await expect(page.locator("#detail-title")).toHaveText(
    "Cai dat Postman va Newman",
  );
  await page.locator("#detail-edit").click();
  await page.locator("#task-status").selectOption("COMPLETED");
  await page.locator("#btn-save-task").click();
  await expect(page.locator("#deadline-count")).toHaveText("1");
  await expect(page.locator('[data-deadline-id="2"]')).toHaveCount(0);
  await expect(page.locator("#welcome-summary")).toContainText(
    "1 nhiệm vụ đang chờ",
  );
  await expect(page.locator("#progress-percent")).toHaveText("67%");
});

test("Mobile and tablet layouts fit the viewport in list, board and task dialog", async ({
  page,
}) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const view of ["list", "board"]) {
      await page.locator(`[data-view="${view}"]`).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      const row = page.locator("#tasks-list .task-row").first();
      const name = await row.locator(".task-name").boundingBox();
      expect(name?.width).toBeGreaterThan(60);
    }
    await page.locator("#btn-new-task").click();
    const box = await page.locator("#task-dialog").boundingBox();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x || 0) + (box?.width || 0)).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await expect(page.locator("#task-dialog")).toBeHidden();
  }
});

test("Theme persists and course/deadline filters reset after logout", async ({
  page,
}) => {
  const initial = await page.locator("html").getAttribute("data-theme");
  await page.locator("#theme-toggle").click();
  const selected = initial === "dark" ? "light" : "dark";
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", selected);
  await expect(page.locator("#stat-total")).toHaveText("3");
  await page.locator("#filter-course").selectOption("SWT301");
  await page.locator('[data-calendar-date="2026-10-20"]').click();
  await expect(page.locator("#result-count")).toContainText("1 / 3 nhiệm vụ");
  await page.locator("#btn-logout").click();
  await page.locator("#btn-login-submit").click();
  await expect(page.locator("#result-count")).toContainText("3 / 3 nhiệm vụ");
  await expect(page.locator("#filter-course")).toHaveValue("");
  await expect(page.locator("#date-filter-label")).toBeHidden();
});
