// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Helper to reset backend mock data and log in as student via UI
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function resetAndLogin(page, request) {
  const res = await request.post('/api/reset');
  expect(res.ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.locator('#auth-section')).toBeVisible();
  await page.locator('#login-username').fill('student');
  await page.locator('#login-password').fill('password123');
  await page.locator('#btn-login-submit').click();

  await expect(page.locator('#app-shell')).toBeVisible();
  await expect(page.locator('#result-count')).toContainText('3 / 3 nhiệm vụ');
}

test.describe('1. Authentication & Session Flow (TC01 - TC06)', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/reset');
  });

  test('TC01: Login successfully with valid student credentials', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#auth-section')).toBeVisible();

    await page.locator('#login-username').fill('student');
    await page.locator('#login-password').fill('password123');
    await page.locator('#btn-login-submit').click();

    await expect(page.locator('#app-shell')).toBeVisible();
    await expect(page.locator('#auth-section')).toBeHidden();
    await expect(page.locator('#user-name')).toHaveText('Nguyen Van A');
    await expect(page.locator('#user-email')).toHaveText('student@fpt.edu.vn');
    await expect(page.locator('#stat-total')).toHaveText('3');
  });

  test('TC02: Login fails with invalid password and displays inline error', async ({ page }) => {
    await page.goto('/');
    await page.locator('#login-username').fill('student');
    await page.locator('#login-password').fill('wrong_password_123');
    await page.locator('#btn-login-submit').click();

    const errorAlert = page.locator('#login-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText('Tên đăng nhập hoặc mật khẩu chưa đúng.');
    await expect(page.locator('#app-shell')).toBeHidden();
  });

  test('TC03: Login validation when submitting whitespace/empty username', async ({ page }) => {
    await page.goto('/');
    await page.locator('#login-username').fill('   ');
    await page.locator('#login-password').fill('password123');
    await page.locator('#btn-login-submit').click();

    const errorAlert = page.locator('#login-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText('Vui lòng nhập tên đăng nhập và mật khẩu.');
    await expect(page.locator('#app-shell')).toBeHidden();
  });

  test('TC04: Toggle show/hide password button updates input type and aria-pressed', async ({ page }) => {
    await page.goto('/');
    const passwordInput = page.locator('#login-password');
    const toggleBtn = page.locator('#show-password');

    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(toggleBtn).toHaveText('Hiện');

    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(toggleBtn).toHaveText('Ẩn');

    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('TC05: Logout clears session storage and returns to login screen with toast', async ({ page, request }) => {
    await resetAndLogin(page, request);

    await page.locator('#btn-logout').click();
    await expect(page.locator('#auth-section')).toBeVisible();
    await expect(page.locator('#app-shell')).toBeHidden();
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast-message')).toContainText('Bạn đã đăng xuất');

    const tokenInStorage = await page.evaluate(() => sessionStorage.getItem('token'));
    expect(tokenInStorage).toBeNull();
  });

  test('TC06: Session persists across page reload when token is valid in sessionStorage', async ({ page, request }) => {
    await resetAndLogin(page, request);
    await page.reload();

    await expect(page.locator('#app-shell')).toBeVisible();
    await expect(page.locator('#auth-section')).toBeHidden();
    await expect(page.locator('#user-name')).toHaveText('Nguyen Van A');
    await expect(page.locator('#stat-total')).toHaveText('3');
  });
});

test.describe('2. CRUD Tasks Operations (TC07 - TC12)', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetAndLogin(page, request);
  });

  test('TC07: Dashboard loads initial 3 tasks and accurate statistics', async ({ page }) => {
    await expect(page.locator('#stat-total')).toHaveText('3');
    await expect(page.locator('#stat-todo')).toHaveText('1');
    await expect(page.locator('#stat-inprogress')).toHaveText('1');
    await expect(page.locator('#stat-completed')).toHaveText('1');
    await expect(page.locator('#progress-percent')).toHaveText('33%');
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(3);
  });

  test('TC08: Create a new task successfully via modal dialog', async ({ page }) => {
    // [SELF-HEALING-TARGET-START]
    const createTaskBtn = page.locator('#btn-new-task');
    // [SELF-HEALING-TARGET-END]
    await createTaskBtn.click();

    const dialog = page.locator('#task-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#task-dialog-title')).toHaveText('Tạo nhiệm vụ');

    await page.locator('#task-title').fill('Kiem thu E2E voi Playwright MCP');
    await page.locator('#task-description').fill('Tich hop AI va Playwright MCP de tu dong hoa kiem thu');
    await page.locator('#task-course').fill('SWT301');
    await page.locator('#task-due-date').fill('2026-10-30');
    await page.locator('#task-priority').selectOption('HIGH');
    await page.locator('#task-status').selectOption('TODO');

    await page.locator('#btn-save-task').click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('#toast-message')).toContainText('Đã tạo nhiệm vụ');
    await expect(page.locator('#stat-total')).toHaveText('4');
    await expect(page.locator('#stat-todo')).toHaveText('2');
    await expect(page.locator('#tasks-list')).toContainText('Kiem thu E2E voi Playwright MCP');

    // Clean up created task #4 so in-memory array returns to 3 tasks
    const newRow = page.locator('.task-row', { hasText: 'Kiem thu E2E voi Playwright MCP' });
    await newRow.locator('[data-action="delete"]').click();
    await page.locator('#confirm-delete').click();
    await expect(page.locator('#stat-total')).toHaveText('3');
  });

  test('TC09: View task detail modal displays full metadata', async ({ page }) => {
    const taskRow = page.locator('.task-row[data-id="1"]');
    await taskRow.locator('[data-action="detail"]').click();

    const detailDialog = page.locator('#detail-dialog');
    await expect(detailDialog).toBeVisible();
    await expect(page.locator('#detail-title')).toHaveText('On tap ly thuyet SWT301');
    await expect(page.locator('#detail-content')).toContainText('Black-box testing');
    await expect(page.locator('#detail-content')).toContainText('#1');

    await detailDialog.locator('[data-close="detail-dialog"]').first().click();
    await expect(detailDialog).toBeHidden();
  });

  test('TC10: Edit an existing task and verify updated fields in UI', async ({ page }) => {
    const taskRow = page.locator('.task-row[data-id="1"]');
    await taskRow.locator('[data-action="edit"]').click();

    const dialog = page.locator('#task-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#task-dialog-title')).toHaveText('Chỉnh sửa nhiệm vụ');

    await page.locator('#task-title').fill('On tap ly thuyet SWT301 - Da cap nhat');
    await page.locator('#task-status').selectOption('COMPLETED');
    await page.locator('#btn-save-task').click();

    await expect(dialog).toBeHidden();
    await expect(page.locator('#toast-message')).toContainText('Đã lưu thay đổi nhiệm vụ');
    await expect(page.locator('.task-row[data-id="1"] .task-name')).toHaveText('On tap ly thuyet SWT301 - Da cap nhat');
    await expect(page.locator('#stat-completed')).toHaveText('2');

    // Restore original title and status of task #1 for subsequent tests
    await taskRow.locator('[data-action="edit"]').click();
    await page.locator('#task-title').fill('On tap ly thuyet SWT301');
    await page.locator('#task-status').selectOption('TODO');
    await page.locator('#btn-save-task').click();
    await expect(dialog).toBeHidden();
  });

  test('TC11: Quick status advance cycles TODO -> IN_PROGRESS -> COMPLETED -> TODO', async ({ page }) => {
    const taskRow = page.locator('.task-row[data-id="1"]');
    const advanceBtn = taskRow.locator('[data-action="advance"]');

    // Initial state of task 1 is TODO
    await expect(taskRow.locator('.status-tag')).toHaveText('Cần làm');

    // Click 1: TODO -> IN_PROGRESS
    await advanceBtn.click();
    await expect(taskRow.locator('.status-tag')).toHaveText('Đang làm');
    await expect(page.locator('#stat-inprogress')).toHaveText('2');

    // Click 2: IN_PROGRESS -> COMPLETED
    await advanceBtn.click();
    await expect(taskRow.locator('.status-tag')).toHaveText('Hoàn thành');
    await expect(page.locator('#stat-completed')).toHaveText('2');

    // Click 3: COMPLETED -> TODO
    await advanceBtn.click();
    await expect(taskRow.locator('.status-tag')).toHaveText('Cần làm');
    await expect(page.locator('#stat-todo')).toHaveText('1');
  });

  test('TC12: Delete a task after confirmation removes it from list and updates stats', async ({ page }) => {
    // First create a temporary task so deleting it leaves the 3 initial tasks intact
    await page.locator('#btn-new-task').click();
    await page.locator('#task-title').fill('Nhiem vu tam thoi de xoa');
    await page.locator('#btn-save-task').click();
    await expect(page.locator('#stat-total')).toHaveText('4');

    const tempRow = page.locator('.task-row', { hasText: 'Nhiem vu tam thoi de xoa' });
    await tempRow.locator('[data-action="delete"]').click();

    const deleteDialog = page.locator('#delete-dialog');
    await expect(deleteDialog).toBeVisible();
    await expect(page.locator('#delete-description')).toHaveText('Nhiem vu tam thoi de xoa');

    await page.locator('#confirm-delete').click();
    await expect(deleteDialog).toBeHidden();
    await expect(page.locator('#toast-message')).toContainText('Đã xóa nhiệm vụ');
    await expect(page.locator('.task-row', { hasText: 'Nhiem vu tam thoi de xoa' })).toHaveCount(0);
    await expect(page.locator('#stat-total')).toHaveText('3');
  });
});

test.describe('3. Input Validation & Edge Cases (TC13 - TC15)', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetAndLogin(page, request);
  });

  test('TC13: Prevent creating task with whitespace-only title (client validation)', async ({ page }) => {
    await page.locator('#btn-new-task').click();
    const dialog = page.locator('#task-dialog');
    await expect(dialog).toBeVisible();

    await page.locator('#task-title').fill('     ');
    await page.locator('#btn-save-task').click();

    // Dialog should remain open because validation blocked submission
    await expect(dialog).toBeVisible();
    const validationMsg = await page.locator('#task-title').evaluate((el) => /** @type {HTMLInputElement} */ (el).validationMessage);
    expect(validationMsg).toContain('Vui lòng nhập tên nhiệm vụ');
  });

  test('TC14: Cancel task deletion keeps the task intact', async ({ page }) => {
    const taskRow = page.locator('.task-row[data-id="1"]');
    await taskRow.locator('[data-action="delete"]').click();

    const deleteDialog = page.locator('#delete-dialog');
    await expect(deleteDialog).toBeVisible();
    await deleteDialog.locator('[data-close="delete-dialog"]').click();

    await expect(deleteDialog).toBeHidden();
    await expect(page.locator('.task-row[data-id="1"]')).toBeVisible();
    await expect(page.locator('#stat-total')).toHaveText('3');
  });

  test('TC15: API validation rejects POST /api/tasks with empty title or invalid priority', async ({ request }) => {
    const loginRes = await request.post('/api/login', {
      data: { username: 'student', password: 'password123' }
    });
    const { data } = await loginRes.json();
    const token = data.token;

    const emptyTitleRes = await request.post('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: '   ', priority: 'HIGH' }
    });
    expect(emptyTitleRes.status()).toBe(400);

    const badPriorityRes = await request.post('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Valid Title', priority: 'CRITICAL_INVALID' }
    });
    expect(badPriorityRes.status()).toBe(400);
  });
});

test.describe('4. Search, Filter, Sort & View Modes (TC16 - TC20)', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetAndLogin(page, request);
  });

  test('TC16: Search tasks by keyword (case & accent insensitive) and empty state', async ({ page }) => {
    const searchInput = page.locator('#task-search');

    await searchInput.fill('newman');
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(1);
    await expect(page.locator('#tasks-list .task-name')).toContainText('Cai dat Postman va Newman');
    await expect(page.locator('#result-count')).toContainText('1 / 3 nhiệm vụ');

    // Search with keyword matching both title and description ("postman" matches Task 2 and Task 3)
    await searchInput.fill('postman');
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(2);
    await expect(page.locator('#result-count')).toContainText('2 / 3 nhiệm vụ');

    // Search with non-existent keyword -> Empty state
    await searchInput.fill('khong_ton_tai_xyz_999');
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(0);
    await expect(page.locator('#tasks-empty')).toBeVisible();
    await expect(page.locator('#empty-title')).toHaveText('Không có nhiệm vụ phù hợp');

    // Clear filters via button
    await page.locator('#clear-filters').click();
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(3);
  });

  test('TC17: Filter tasks by Status and Priority dropdowns', async ({ page }) => {
    await page.locator('#filter-status').selectOption('TODO');
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(1);
    await expect(page.locator('#tasks-list .task-name')).toHaveText('On tap ly thuyet SWT301');

    await page.locator('#filter-status').selectOption('');
    await page.locator('#filter-priority').selectOption('HIGH');
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(2);
  });

  test('TC18: Sort tasks by Title A-Z and Newest', async ({ page }) => {
    await page.locator('#sort-tasks').selectOption('title');
    const titlesAZ = await page.locator('#tasks-list .task-name').allTextContents();
    expect(titlesAZ[0]).toBe('Cai dat Postman va Newman');
    expect(titlesAZ[1]).toBe('Lam bai tap Assignment 1');
    expect(titlesAZ[2]).toBe('On tap ly thuyet SWT301');

    await page.locator('#sort-tasks').selectOption('newest');
    const titlesNewest = await page.locator('#tasks-list .task-name').allTextContents();
    expect(titlesNewest[0]).toBe('Lam bai tap Assignment 1'); // id 3
  });

  test('TC19: Switch between List view and Kanban Board view', async ({ page }) => {
    const boardBtn = page.locator('[data-view="board"]');
    const listBtn = page.locator('[data-view="list"]');

    await boardBtn.click();
    await expect(boardBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#tasks-list')).toHaveClass(/board/);
    await expect(page.locator('.board-column')).toHaveCount(3);

    await listBtn.click();
    await expect(listBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#tasks-list')).not.toHaveClass(/board/);
  });

  test('TC20: Navigation tabs (#overview, #tasks, #completed) and theme toggle', async ({ page }) => {
    await page.locator('nav a[data-page="completed"]').click();
    await expect(page.locator('#breadcrumb')).toHaveText('Đã hoàn thành');
    await expect(page.locator('#insights')).toBeHidden();
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(1);

    await page.locator('nav a[data-page="overview"]').click();
    await expect(page.locator('#breadcrumb')).toHaveText('Tổng quan');
    await expect(page.locator('#insights')).toBeVisible();

    // Theme toggle check
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');
    await page.locator('#theme-toggle').click();
    const nextTheme = await html.getAttribute('data-theme');
    expect(nextTheme).not.toBe(initialTheme);
  });
});

test.describe('5. Authorization & API Error Handling in UI (TC21 - TC24)', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetAndLogin(page, request);
  });

  test('TC21: Unauthorized API response (401) automatically ends session and redirects to Login', async ({ page }) => {
    // Intercept next GET /api/tasks and return 401 Unauthorized (simulating expired/revoked token)
    await page.route('**/api/tasks', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized: Invalid or expired token'
        })
      });
    });

    await page.locator('#btn-refresh-tasks').click();

    await expect(page.locator('#auth-section')).toBeVisible();
    await expect(page.locator('#app-shell')).toBeHidden();
    await expect(page.locator('#toast')).toBeVisible();
    await expect(page.locator('#toast-message')).toContainText('Phiên đăng nhập đã hết hạn');
  });

  test('TC22: Server 500 error during task fetch displays error state box and allows Retry', async ({ page }) => {
    let shouldFail = true;
    await page.route('**/api/tasks', async (route) => {
      if (shouldFail) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Internal Server Error: Database connection failed'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('#btn-refresh-tasks').click();

    const errorBox = page.locator('#tasks-error');
    await expect(errorBox).toBeVisible();
    await expect(page.locator('#tasks-error-message')).toContainText('Internal Server Error');

    // Now recover server and click Retry
    shouldFail = false;
    await page.locator('#retry-tasks').click();

    await expect(errorBox).toBeHidden();
    await expect(page.locator('#tasks-list .task-row')).toHaveCount(3);
  });

  test('TC23: API error (400/500) during Task Creation displays inline error inside modal', async ({ page }) => {
    await page.route('**/api/tasks', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Lỗi giả lập từ máy chủ: Không thể lưu nhiệm vụ lúc này.'
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('#btn-new-task').click();
    await page.locator('#task-title').fill('Task kiem thu loi API 400');
    await page.locator('#btn-save-task').click();

    const formError = page.locator('#task-form-error');
    await expect(formError).toBeVisible();
    await expect(formError).toHaveText('Lỗi giả lập từ máy chủ: Không thể lưu nhiệm vụ lúc này.');
    await expect(page.locator('#task-dialog')).toBeVisible();
  });

  test('TC24: Direct API request without Authorization header is blocked with 401', async ({ request }) => {
    const resGet = await request.get('/api/tasks');
    expect(resGet.status()).toBe(401);

    const resPost = await request.post('/api/tasks', {
      data: { title: 'Hack Task' }
    });
    expect(resPost.status()).toBe(401);

    const resDelete = await request.delete('/api/tasks/1');
    expect(resDelete.status()).toBe(401);
  });
});


test.describe('Pomodoro Focus Timer Feature', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetAndLogin(page, request);
  });

  test('TC25: Open Pomodoro widget from task row and verify initial state (task title, 25:00, 0 cycles)', async ({ page }) => {
    const widget = page.locator('#pomodoro-widget');
    await expect(widget).toBeHidden();

    const taskRow = page.locator('.task-row[data-id="1"]');
    const expectedTitle = await taskRow.locator('.task-name').textContent();

    await taskRow.locator('button[data-action="pomodoro"]').click();

    await expect(widget).toBeVisible();
    await expect(page.locator('#pomodoro-task-name')).toHaveText(expectedTitle || 'On tap ly thuyet SWT301');
    await expect(page.locator('#pomodoro-timer-display')).toHaveText('25:00');
    await expect(page.locator('#pomodoro-cycle-count')).toHaveText('0');
    await expect(page.locator('#btn-pomodoro-start')).toBeEnabled();
    await expect(page.locator('#btn-pomodoro-pause')).toBeDisabled();
  });

  test('TC26: Start countdown, Pause timer, and Reset back to 25:00', async ({ page }) => {
    const taskRow = page.locator('.task-row[data-id="1"]');
    await taskRow.locator('button[data-action="pomodoro"]').click();

    const timerDisplay = page.locator('#pomodoro-timer-display');
    const startBtn = page.locator('#btn-pomodoro-start');
    const pauseBtn = page.locator('#btn-pomodoro-pause');
    const resetBtn = page.locator('#btn-pomodoro-reset');

    await expect(timerDisplay).toHaveText('25:00');

    // Click Start and verify countdown begins within 1.5s
    await startBtn.click();
    await expect(startBtn).toBeDisabled();
    await expect(pauseBtn).toBeEnabled();
    await expect(timerDisplay).not.toHaveText('25:00', { timeout: 1500 });

    // Click Pause and verify time remains paused
    await pauseBtn.click();
    await expect(startBtn).toBeEnabled();
    await expect(pauseBtn).toBeDisabled();
    const pausedTime = await timerDisplay.textContent();
    await page.waitForTimeout(1100);
    await expect(timerDisplay).toHaveText(pausedTime || '24:59');

    // Click Reset and verify time returns to 25:00
    await resetBtn.click();
    await expect(timerDisplay).toHaveText('25:00');
    await expect(startBtn).toBeEnabled();
    await expect(pauseBtn).toBeDisabled();

    // Close widget and verify it hides
    await page.locator('#btn-pomodoro-close').click();
    await expect(page.locator('#pomodoro-widget')).toBeHidden();
  });
});
