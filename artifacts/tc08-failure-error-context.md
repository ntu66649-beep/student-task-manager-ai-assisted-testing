# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: student-task-manager.spec.js >> 2. CRUD Tasks Operations (TC07 - TC12) >> TC08: Create a new task successfully via modal dialog
- Location: tests\e2e\student-task-manager.spec.js:124:3

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('#btn-add-task-broken')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - link "Đến nội dung chính" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - button "Chuyển sang giao diện tối" [ref=e3] [cursor=pointer]: ◐
  - generic [ref=e4]:
    - complementary "Điều hướng chính" [ref=e5]:
      - link "✓ Student TASK MANAGER" [ref=e6] [cursor=pointer]:
        - /url: "#overview"
        - generic [ref=e7]: ✓
        - generic [ref=e8]:
          - text: Student
          - generic [ref=e9]: TASK MANAGER
      - generic [ref=e10]: KHÔNG GIAN HỌC TẬP
      - navigation [ref=e11]:
        - link "Tổng quan" [ref=e12] [cursor=pointer]:
          - /url: "#overview"
          - generic [aria-hidden] [ref=e13]: ◫
          - text: Tổng quan
        - link "Nhiệm vụ 2" [ref=e14] [cursor=pointer]:
          - /url: "#tasks"
          - generic [aria-hidden] [ref=e15]: ☷
          - text: Nhiệm vụ
          - generic [ref=e16]: "2"
        - link "Đã hoàn thành" [ref=e17] [cursor=pointer]:
          - /url: "#completed"
          - generic [aria-hidden] [ref=e18]: ✓
          - text: Đã hoàn thành
      - generic [ref=e19]:
        - text: TẬP TRUNG VÀO ĐIỀU QUAN TRỌNG
        - paragraph [ref=e20]: Một việc mỗi lúc.Một chút tốt hơn mỗi ngày.
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: VA
          - generic [ref=e25]:
            - strong [ref=e26]: Nguyen Van A
            - generic [ref=e27]: student@fpt.edu.vn
        - button "Đăng xuất" [ref=e28] [cursor=pointer]:
          - text: Đăng xuất
          - generic [aria-hidden] [ref=e29]: ↗
    - main [active] [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - text: Không gian học tập /
          - strong [ref=e33]: Tổng quan
        - generic [ref=e34]: Thứ 5, 22 tháng 10, 2026
      - generic [ref=e35]:
        - generic [ref=e36]:
          - text: MỘT NGÀY MỚI, MỘT BƯỚC TIẾN
          - heading "Việc học, trong tầm tay." [level=1] [ref=e37]
          - paragraph [ref=e38]: Nhìn lại tiến độ và chọn điều bạn muốn hoàn thành tiếp theo.
        - button "Tạo nhiệm vụ" [ref=e39] [cursor=pointer]:
          - generic [aria-hidden] [ref=e40]: ＋
          - text: Tạo nhiệm vụ
      - region "Thống kê nhiệm vụ" [ref=e41]:
        - button [ref=e42] [cursor=pointer]:
          - generic [ref=e43]:
            - text: Tổng nhiệm vụ
            - generic [aria-hidden] [ref=e44]: ↗
          - strong [ref=e45]: "3"
          - text: Trong không gian của bạn
        - button [ref=e46] [cursor=pointer]:
          - generic [ref=e47]: Cần bắt đầu
          - strong [ref=e49]: "1"
          - text: Sẵn sàng cho bước đầu tiên
        - button [ref=e50] [cursor=pointer]:
          - generic [ref=e51]: Đang thực hiện
          - strong [ref=e53]: "1"
          - text: Giữ nhịp, bạn đang tiến bộ
        - button [ref=e54] [cursor=pointer]:
          - generic [ref=e55]:
            - text: Đã hoàn thành
            - generic [aria-hidden] [ref=e56]: ✓
          - strong [ref=e57]: "1"
          - text: 33% mục tiêu đã hoàn thành
      - region "Tổng quan tiến độ" [ref=e58]:
        - generic [ref=e59]:
          - generic [ref=e60]:
            - generic [ref=e61]:
              - text: TỪNG BƯỚC MỘT
              - heading "Nhịp học tập của bạn" [level=2] [ref=e62]
            - generic [ref=e63]: Tiến độ hiện tại
          - generic [ref=e64]:
            - img "1 trên 3 nhiệm vụ đã hoàn thành, 33%" [ref=e65]:
              - generic [ref=e66]:
                - strong [ref=e67]: 33%
                - generic [ref=e68]: hoàn thành
            - generic [ref=e69]:
              - button "Cần làm 1" [ref=e70] [cursor=pointer]:
                - generic [ref=e71]:
                  - text: Cần làm
                  - generic [ref=e73]: "1"
              - button "Đang làm 1" [ref=e76] [cursor=pointer]:
                - generic [ref=e77]:
                  - text: Đang làm
                  - generic [ref=e79]: "1"
              - button "Hoàn thành 1" [ref=e82] [cursor=pointer]:
                - generic [ref=e83]:
                  - text: Hoàn thành
                  - generic [ref=e85]: "1"
        - generic [ref=e88]:
          - generic [ref=e89]:
            - generic [ref=e90]:
              - text: ƯU TIÊN TIẾP THEO
              - heading "Điều cần chú ý" [level=2] [ref=e91]
            - generic [aria-hidden] [ref=e92]: ↗
          - generic [ref=e93]:
            - generic [ref=e94]:
              - generic [ref=e95]:
                - strong [ref=e96]: "01"
                - generic [ref=e97]: nhiệm vụ quá hạn
              - generic [ref=e98]:
                - strong [ref=e99]: "01"
                - generic [ref=e100]: nhiệm vụ ưu tiên cao
            - paragraph [ref=e101]:
              - text: "Gợi ý tiếp theo:"
              - strong [ref=e102]: On tap ly thuyet SWT301
          - button "Xem nhiệm vụ cần chú ý" [ref=e103] [cursor=pointer]:
            - text: Xem nhiệm vụ cần chú ý
            - generic [aria-hidden] [ref=e104]: →
      - region [ref=e105]:
        - generic [ref=e106]:
          - generic [ref=e107]:
            - heading "Nhiệm vụ của bạn" [level=2] [ref=e108]
            - paragraph [ref=e109]: 3 / 3 nhiệm vụ
          - generic [ref=e110]:
            - button "Làm mới nhiệm vụ" [ref=e111] [cursor=pointer]: ↻
            - group "Cách hiển thị" [ref=e112]:
              - button "Dạng danh sách" [pressed] [ref=e113] [cursor=pointer]: ☷
              - button "Dạng bảng" [ref=e114] [cursor=pointer]: ◫
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [aria-hidden] [ref=e117]: ⌕
            - searchbox "Tìm nhiệm vụ" [ref=e118]
          - combobox "Lọc trạng thái" [ref=e119]:
            - option "Tất cả trạng thái" [selected]
            - option "Cần làm"
            - option "Đang làm"
            - option "Hoàn thành"
          - combobox "Lọc ưu tiên" [ref=e120]:
            - option "Tất cả ưu tiên" [selected]
            - option "Ưu tiên cao"
            - option "Trung bình"
            - option "Ưu tiên thấp"
          - combobox "Sắp xếp nhiệm vụ" [ref=e121]:
            - option "Cần chú ý trước" [selected]
            - option "Hạn gần nhất"
            - option "Mới nhất"
            - option "Tên A–Z"
        - generic [ref=e122]:
          - article [ref=e123]:
            - 'button "Bắt đầu nhiệm vụ: On tap ly thuyet SWT301" [ref=e124] [cursor=pointer]'
            - generic [ref=e125]:
              - button "On tap ly thuyet SWT301" [ref=e126] [cursor=pointer]
              - paragraph [ref=e127]: Hoc lai cac ky thuat kiem thu hop den (Black-box testing) va hop trang (White-box testing)
              - generic [ref=e128]:
                - generic [ref=e129]: SWT301
                - generic [ref=e130]: Ưu tiên cao
            - generic [ref=e131]: Cần làm
            - generic [ref=e132]:
              - text: 20/10/2026
              - generic [ref=e133]: Quá hạn
            - generic [ref=e134]:
              - 'button "Sửa nhiệm vụ: On tap ly thuyet SWT301" [ref=e135] [cursor=pointer]': Sửa
              - 'button "Xóa nhiệm vụ: On tap ly thuyet SWT301" [ref=e136] [cursor=pointer]': Xóa
          - article [ref=e137]:
            - 'button "Hoàn thành nhiệm vụ: Cai dat Postman va Newman" [ref=e138] [cursor=pointer]': ◔
            - generic [ref=e139]:
              - button "Cai dat Postman va Newman" [ref=e140] [cursor=pointer]
              - paragraph [ref=e141]: Chuan bi moi truong de kiem thu API tu dong
              - generic [ref=e142]:
                - generic [ref=e143]: SWT301
                - generic [ref=e144]: Ưu tiên trung bình
            - generic [ref=e145]: Đang làm
            - generic [ref=e146]:
              - text: 22/10/2026
              - generic [ref=e147]: Đến hạn hôm nay
            - generic [ref=e148]:
              - 'button "Sửa nhiệm vụ: Cai dat Postman va Newman" [ref=e149] [cursor=pointer]': Sửa
              - 'button "Xóa nhiệm vụ: Cai dat Postman va Newman" [ref=e150] [cursor=pointer]': Xóa
          - article [ref=e151]:
            - 'button "Mở lại nhiệm vụ: Lam bai tap Assignment 1" [ref=e152] [cursor=pointer]': ✓
            - generic [ref=e153]:
              - button "Lam bai tap Assignment 1" [ref=e154] [cursor=pointer]
              - paragraph [ref=e155]: Viet test case va tao Postman Collection cho he thong quan ly nhiem vu sinh vien
              - generic [ref=e156]:
                - generic [ref=e157]: SWT301
                - generic [ref=e158]: Ưu tiên cao
            - generic [ref=e159]: Hoàn thành
            - generic [ref=e160]:
              - text: 25/10/2026
              - generic [ref=e161]: Đã hoàn thành
            - generic [ref=e162]:
              - 'button "Sửa nhiệm vụ: Lam bai tap Assignment 1" [ref=e163] [cursor=pointer]': Sửa
              - 'button "Xóa nhiệm vụ: Lam bai tap Assignment 1" [ref=e164] [cursor=pointer]': Xóa
      - generic [ref=e165]:
        - generic [ref=e166]: Student Task Manager · SWT301
        - generic [ref=e167]: Đồng bộ lúc 13:16
```

# Test source

```ts
  28  |   test('TC01: Login successfully with valid student credentials', async ({ page }) => {
  29  |     await page.goto('/');
  30  |     await expect(page.locator('#auth-section')).toBeVisible();
  31  | 
  32  |     await page.locator('#login-username').fill('student');
  33  |     await page.locator('#login-password').fill('password123');
  34  |     await page.locator('#btn-login-submit').click();
  35  | 
  36  |     await expect(page.locator('#app-shell')).toBeVisible();
  37  |     await expect(page.locator('#auth-section')).toBeHidden();
  38  |     await expect(page.locator('#user-name')).toHaveText('Nguyen Van A');
  39  |     await expect(page.locator('#user-email')).toHaveText('student@fpt.edu.vn');
  40  |     await expect(page.locator('#stat-total')).toHaveText('3');
  41  |   });
  42  | 
  43  |   test('TC02: Login fails with invalid password and displays inline error', async ({ page }) => {
  44  |     await page.goto('/');
  45  |     await page.locator('#login-username').fill('student');
  46  |     await page.locator('#login-password').fill('wrong_password_123');
  47  |     await page.locator('#btn-login-submit').click();
  48  | 
  49  |     const errorAlert = page.locator('#login-error');
  50  |     await expect(errorAlert).toBeVisible();
  51  |     await expect(errorAlert).toHaveText('Tên đăng nhập hoặc mật khẩu chưa đúng.');
  52  |     await expect(page.locator('#app-shell')).toBeHidden();
  53  |   });
  54  | 
  55  |   test('TC03: Login validation when submitting whitespace/empty username', async ({ page }) => {
  56  |     await page.goto('/');
  57  |     await page.locator('#login-username').fill('   ');
  58  |     await page.locator('#login-password').fill('password123');
  59  |     await page.locator('#btn-login-submit').click();
  60  | 
  61  |     const errorAlert = page.locator('#login-error');
  62  |     await expect(errorAlert).toBeVisible();
  63  |     await expect(errorAlert).toHaveText('Vui lòng nhập tên đăng nhập và mật khẩu.');
  64  |     await expect(page.locator('#app-shell')).toBeHidden();
  65  |   });
  66  | 
  67  |   test('TC04: Toggle show/hide password button updates input type and aria-pressed', async ({ page }) => {
  68  |     await page.goto('/');
  69  |     const passwordInput = page.locator('#login-password');
  70  |     const toggleBtn = page.locator('#show-password');
  71  | 
  72  |     await expect(passwordInput).toHaveAttribute('type', 'password');
  73  |     await expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');
  74  |     await expect(toggleBtn).toHaveText('Hiện');
  75  | 
  76  |     await toggleBtn.click();
  77  |     await expect(passwordInput).toHaveAttribute('type', 'text');
  78  |     await expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');
  79  |     await expect(toggleBtn).toHaveText('Ẩn');
  80  | 
  81  |     await toggleBtn.click();
  82  |     await expect(passwordInput).toHaveAttribute('type', 'password');
  83  |     await expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');
  84  |   });
  85  | 
  86  |   test('TC05: Logout clears session storage and returns to login screen with toast', async ({ page, request }) => {
  87  |     await resetAndLogin(page, request);
  88  | 
  89  |     await page.locator('#btn-logout').click();
  90  |     await expect(page.locator('#auth-section')).toBeVisible();
  91  |     await expect(page.locator('#app-shell')).toBeHidden();
  92  |     await expect(page.locator('#toast')).toBeVisible();
  93  |     await expect(page.locator('#toast-message')).toContainText('Bạn đã đăng xuất');
  94  | 
  95  |     const tokenInStorage = await page.evaluate(() => sessionStorage.getItem('token'));
  96  |     expect(tokenInStorage).toBeNull();
  97  |   });
  98  | 
  99  |   test('TC06: Session persists across page reload when token is valid in sessionStorage', async ({ page, request }) => {
  100 |     await resetAndLogin(page, request);
  101 |     await page.reload();
  102 | 
  103 |     await expect(page.locator('#app-shell')).toBeVisible();
  104 |     await expect(page.locator('#auth-section')).toBeHidden();
  105 |     await expect(page.locator('#user-name')).toHaveText('Nguyen Van A');
  106 |     await expect(page.locator('#stat-total')).toHaveText('3');
  107 |   });
  108 | });
  109 | 
  110 | test.describe('2. CRUD Tasks Operations (TC07 - TC12)', () => {
  111 |   test.beforeEach(async ({ page, request }) => {
  112 |     await resetAndLogin(page, request);
  113 |   });
  114 | 
  115 |   test('TC07: Dashboard loads initial 3 tasks and accurate statistics', async ({ page }) => {
  116 |     await expect(page.locator('#stat-total')).toHaveText('3');
  117 |     await expect(page.locator('#stat-todo')).toHaveText('1');
  118 |     await expect(page.locator('#stat-inprogress')).toHaveText('1');
  119 |     await expect(page.locator('#stat-completed')).toHaveText('1');
  120 |     await expect(page.locator('#progress-percent')).toHaveText('33%');
  121 |     await expect(page.locator('#tasks-list .task-row')).toHaveCount(3);
  122 |   });
  123 | 
  124 |   test('TC08: Create a new task successfully via modal dialog', async ({ page }) => {
  125 |     // [SELF-HEALING-TARGET-START]
  126 |     const createTaskBtn = page.locator('#btn-add-task-broken');
  127 |     // [SELF-HEALING-TARGET-END]
> 128 |     await createTaskBtn.click();
      |                         ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  129 | 
  130 |     const dialog = page.locator('#task-dialog');
  131 |     await expect(dialog).toBeVisible();
  132 |     await expect(page.locator('#task-dialog-title')).toHaveText('Tạo nhiệm vụ');
  133 | 
  134 |     await page.locator('#task-title').fill('Kiem thu E2E voi Playwright MCP');
  135 |     await page.locator('#task-description').fill('Tich hop AI va Playwright MCP de tu dong hoa kiem thu');
  136 |     await page.locator('#task-course').fill('SWT301');
  137 |     await page.locator('#task-due-date').fill('2026-10-30');
  138 |     await page.locator('#task-priority').selectOption('HIGH');
  139 |     await page.locator('#task-status').selectOption('TODO');
  140 | 
  141 |     await page.locator('#btn-save-task').click();
  142 | 
  143 |     await expect(dialog).toBeHidden();
  144 |     await expect(page.locator('#toast-message')).toContainText('Đã tạo nhiệm vụ');
  145 |     await expect(page.locator('#stat-total')).toHaveText('4');
  146 |     await expect(page.locator('#stat-todo')).toHaveText('2');
  147 |     await expect(page.locator('#tasks-list')).toContainText('Kiem thu E2E voi Playwright MCP');
  148 | 
  149 |     // Clean up created task #4 so in-memory array returns to 3 tasks
  150 |     const newRow = page.locator('.task-row', { hasText: 'Kiem thu E2E voi Playwright MCP' });
  151 |     await newRow.locator('[data-action="delete"]').click();
  152 |     await page.locator('#confirm-delete').click();
  153 |     await expect(page.locator('#stat-total')).toHaveText('3');
  154 |   });
  155 | 
  156 |   test('TC09: View task detail modal displays full metadata', async ({ page }) => {
  157 |     const taskRow = page.locator('.task-row[data-id="1"]');
  158 |     await taskRow.locator('[data-action="detail"]').click();
  159 | 
  160 |     const detailDialog = page.locator('#detail-dialog');
  161 |     await expect(detailDialog).toBeVisible();
  162 |     await expect(page.locator('#detail-title')).toHaveText('On tap ly thuyet SWT301');
  163 |     await expect(page.locator('#detail-content')).toContainText('Black-box testing');
  164 |     await expect(page.locator('#detail-content')).toContainText('#1');
  165 | 
  166 |     await detailDialog.locator('[data-close="detail-dialog"]').first().click();
  167 |     await expect(detailDialog).toBeHidden();
  168 |   });
  169 | 
  170 |   test('TC10: Edit an existing task and verify updated fields in UI', async ({ page }) => {
  171 |     const taskRow = page.locator('.task-row[data-id="1"]');
  172 |     await taskRow.locator('[data-action="edit"]').click();
  173 | 
  174 |     const dialog = page.locator('#task-dialog');
  175 |     await expect(dialog).toBeVisible();
  176 |     await expect(page.locator('#task-dialog-title')).toHaveText('Chỉnh sửa nhiệm vụ');
  177 | 
  178 |     await page.locator('#task-title').fill('On tap ly thuyet SWT301 - Da cap nhat');
  179 |     await page.locator('#task-status').selectOption('COMPLETED');
  180 |     await page.locator('#btn-save-task').click();
  181 | 
  182 |     await expect(dialog).toBeHidden();
  183 |     await expect(page.locator('#toast-message')).toContainText('Đã lưu thay đổi nhiệm vụ');
  184 |     await expect(page.locator('.task-row[data-id="1"] .task-name')).toHaveText('On tap ly thuyet SWT301 - Da cap nhat');
  185 |     await expect(page.locator('#stat-completed')).toHaveText('2');
  186 | 
  187 |     // Restore original title and status of task #1 for subsequent tests
  188 |     await taskRow.locator('[data-action="edit"]').click();
  189 |     await page.locator('#task-title').fill('On tap ly thuyet SWT301');
  190 |     await page.locator('#task-status').selectOption('TODO');
  191 |     await page.locator('#btn-save-task').click();
  192 |     await expect(dialog).toBeHidden();
  193 |   });
  194 | 
  195 |   test('TC11: Quick status advance cycles TODO -> IN_PROGRESS -> COMPLETED -> TODO', async ({ page }) => {
  196 |     const taskRow = page.locator('.task-row[data-id="1"]');
  197 |     const advanceBtn = taskRow.locator('[data-action="advance"]');
  198 | 
  199 |     // Initial state of task 1 is TODO
  200 |     await expect(taskRow.locator('.status-tag')).toHaveText('Cần làm');
  201 | 
  202 |     // Click 1: TODO -> IN_PROGRESS
  203 |     await advanceBtn.click();
  204 |     await expect(taskRow.locator('.status-tag')).toHaveText('Đang làm');
  205 |     await expect(page.locator('#stat-inprogress')).toHaveText('2');
  206 | 
  207 |     // Click 2: IN_PROGRESS -> COMPLETED
  208 |     await advanceBtn.click();
  209 |     await expect(taskRow.locator('.status-tag')).toHaveText('Hoàn thành');
  210 |     await expect(page.locator('#stat-completed')).toHaveText('2');
  211 | 
  212 |     // Click 3: COMPLETED -> TODO
  213 |     await advanceBtn.click();
  214 |     await expect(taskRow.locator('.status-tag')).toHaveText('Cần làm');
  215 |     await expect(page.locator('#stat-todo')).toHaveText('1');
  216 |   });
  217 | 
  218 |   test('TC12: Delete a task after confirmation removes it from list and updates stats', async ({ page }) => {
  219 |     // First create a temporary task so deleting it leaves the 3 initial tasks intact
  220 |     await page.locator('#btn-new-task').click();
  221 |     await page.locator('#task-title').fill('Nhiem vu tam thoi de xoa');
  222 |     await page.locator('#btn-save-task').click();
  223 |     await expect(page.locator('#stat-total')).toHaveText('4');
  224 | 
  225 |     const tempRow = page.locator('.task-row', { hasText: 'Nhiem vu tam thoi de xoa' });
  226 |     await tempRow.locator('[data-action="delete"]').click();
  227 | 
  228 |     const deleteDialog = page.locator('#delete-dialog');
```