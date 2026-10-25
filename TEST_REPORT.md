# Báo cáo Kết quả Kiểm thử Thực tế (Test Execution Report)

- **Dự án:** Student Task Manager – AI-Assisted Testing
- **Môn học:** SWT301 – Software Testing
- **Môi trường kiểm thử:**
  - Hệ điều hành: Windows (x64)
  - Runtime: Node.js `v24.21.0`, npm `11.19.0`
  - Công cụ kiểm thử: `@playwright/test` `v1.50+` (Trình duyệt Chromium), `@playwright/mcp` (Microsoft Official Playwright MCP)
  - Thời gian thực thi kiểm chứng: `2026-10-22`

---

## 1. Tổng hợp Kết quả Kiểm thử (Executive Summary)

| Bộ Kiểm thử (Test Suite) | Lệnh thực thi | Tổng số Test Cases | Passed | Failed | Flaky / Skipped | Tỷ lệ thành công | Tổng thời gian |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Playwright E2E Browser Tests** | `npm test` | **24** | **24** | **0** | 0 | **100%** | `21.3s – 23.2s` |
| **Backend REST API Tests** | `npm run test:api` | **15** | **15** | **0** | 0 | **100%** | `0.8s` |
| **Playwright MCP Exploration** | `npm run mcp:explore` | **1 (25 MCP Tools)** | **1** | **0** | 0 | **100%** | `4.5s` |
| **Tổng cộng toàn dự án** | — | **40** | **40** | **0** | **0** | **100%** | **`~26.6s`** |

---

## 2. Kết quả chi tiết 24 Playwright E2E Test Cases (`tests/e2e/student-task-manager.spec.js`)

| STT | Mã TC | Nhóm chức năng | Tên kịch bản kiểm thử | Thời gian chạy | Trạng thái |
| :---: | :---: | :--- | :--- | :---: | :---: |
| 1 | **TC01** | Authentication | Login successfully with valid student credentials | `599ms` | **PASS** |
| 2 | **TC02** | Authentication | Login fails with invalid password and displays inline error | `399ms` | **PASS** |
| 3 | **TC03** | Authentication | Login validation when submitting whitespace/empty username | `448ms` | **PASS** |
| 4 | **TC04** | Authentication | Toggle show/hide password button updates input type and aria-pressed | `492ms` | **PASS** |
| 5 | **TC05** | Authentication | Logout clears session storage and returns to login screen with toast | `536ms` | **PASS** |
| 6 | **TC06** | Authentication | Session persists across page reload when token is valid in sessionStorage | `976ms` | **PASS** |
| 7 | **TC07** | CRUD Tasks | Dashboard loads initial 3 tasks and accurate statistics | `853ms` | **PASS** |
| 8 | **TC08** | CRUD Tasks | Create a new task successfully via modal dialog (Self-Healing Target) | `1800ms` | **PASS** |
| 9 | **TC09** | CRUD Tasks | View task detail modal displays full metadata | `1000ms` | **PASS** |
| 10 | **TC10** | CRUD Tasks | Edit an existing task and verify updated fields in UI | `1300ms` | **PASS** |
| 11 | **TC11** | CRUD Tasks | Quick status advance cycles TODO -> IN_PROGRESS -> COMPLETED -> TODO | `978ms` | **PASS** |
| 12 | **TC12** | CRUD Tasks | Delete a task after confirmation removes it from list and updates stats | `1100ms` | **PASS** |
| 13 | **TC13** | Validation | Prevent creating task with whitespace-only title (client validation) | `1000ms` | **PASS** |
| 14 | **TC14** | Validation | Cancel task deletion keeps the task intact | `805ms` | **PASS** |
| 15 | **TC15** | Validation | API validation rejects POST /api/tasks with empty title or invalid priority | `692ms` | **PASS** |
| 16 | **TC16** | Search & Filter | Search tasks by keyword (case & accent insensitive) and empty state | `915ms` | **PASS** |
| 17 | **TC17** | Search & Filter | Filter tasks by Status and Priority dropdowns | `772ms` | **PASS** |
| 18 | **TC18** | Search & Filter | Sort tasks by Title A-Z and Newest | `781ms` | **PASS** |
| 19 | **TC19** | Search & Filter | Switch between List view and Kanban Board view | `781ms` | **PASS** |
| 20 | **TC20** | Search & Filter | Navigation tabs (#overview, #tasks, #completed) and theme toggle | `956ms` | **PASS** |
| 21 | **TC21** | Auth & Error | Unauthorized API response (401) automatically ends session and redirects to Login | `728ms` | **PASS** |
| 22 | **TC22** | Auth & Error | Server 500 error during task fetch displays error state box and allows Retry | `815ms` | **PASS** |
| 23 | **TC23** | Auth & Error | API error (400/500) during Task Creation displays inline error inside modal | `1100ms` | **PASS** |
| 24 | **TC24** | Auth & Error | Direct API request without Authorization header is blocked with 401 | `676ms` | **PASS** |

---

## 3. Kết quả chi tiết 15 Backend REST API Test Cases (`test/api.test.js`)

```text
> student-task-manager-ai-assisted-testing@1.0.0 test:api
> node test/api.test.js

========================================================
Starting Automated API Tests for Student Task Manager
========================================================

  PASS: GET /api/health - returns 200 and UP status
  PASS: POST /api/auth/login - Failure (Missing Fields) returns 400
  PASS: POST /api/auth/login - Failure (Invalid Credentials) returns 401
  PASS: POST /api/auth/login - Success returns 200 and auth token
  PASS: GET /api/tasks - Failure (No Token) returns 401
  PASS: GET /api/tasks - Failure (Invalid Token) returns 401
  PASS: GET /api/tasks - Success returns 200 and list of tasks
  PASS: GET /api/tasks/1 - Success returns 200 and specific task
  PASS: GET /api/tasks/9999 - Failure (Not Found) returns 404
  PASS: POST /api/tasks - Failure (Missing Title) returns 400
  PASS: POST /api/tasks - Success returns 201 and created task
  PASS: PUT /api/tasks/:id - Success returns 200 and updated task
  PASS: PUT /api/tasks/9999 - Failure (Not Found) returns 404
  PASS: DELETE /api/tasks/:id - Success returns 200 and deleted info
  PASS: DELETE /api/tasks/:id - Failure (Not Found) returns 404

========================================================
Test Results: Total: 15 | Passed: 15 | Failed: 0
========================================================
```

---

## 4. Kết quả Kiểm thử Quy trình Sửa lỗi Locator bằng AI (Self-Healing Verification)

| Giai đoạn | Thao tác thực hiện | Selector trong `TC08` | Kết quả chạy `TC08` | Bằng chứng lưu trữ |
| :--- | :--- | :--- | :--- | :--- |
| **1. Trạng thái chuẩn** | Chạy mặc định | `page.locator('#btn-new-task')` | **PASS** (`1.8s`) | `playwright-report/index.html` |
| **2. Tiêm lỗi có kiểm soát** | `npm run demo:break-locator` | `page.locator('#btn-add-task-broken')` | **FAIL** (`Timeout 10000ms`) | `artifacts/tc08-failure-error-context.md`<br>`artifacts/tc08-failure-screenshot.png` |
| **3. AI phân tích & đề xuất** | `npm run demo:analyze-locator` | Phát hiện `<button id="btn-new-task">` từ DOM & MCP Snapshot | Chờ người dùng xác nhận (`y/n`) | `artifacts/self-healing-evidence.json` |
| **4. Xác nhận & Chạy lại** | `npm run demo:fix-locator` -> `npm test` | Khôi phục `page.locator('#btn-new-task')` | **PASS** (`24/24 Passed`) | `test-results/results.json` |

---

## 5. Danh mục Hồ sơ Bằng chứng Thực tế (Artifacts & Evidence)

Toàn bộ kết quả thực thi được lưu trữ trực tiếp trong kho mã nguồn để giảng viên kiểm tra:
1. [`artifacts/mcp-exploration-snapshot.md`](./artifacts/mcp-exploration-snapshot.md): Bản chụp Accessibility Tree thực tế từ trình duyệt qua Microsoft Playwright MCP (`@playwright/mcp`).
2. [`artifacts/tc08-failure-error-context.md`](./artifacts/tc08-failure-error-context.md): Ngữ cảnh lỗi và DOM snapshot do Playwright xuất ra khi `TC08` thất bại vì sai locator.
3. [`artifacts/tc08-failure-screenshot.png`](./artifacts/tc08-failure-screenshot.png): Ảnh chụp màn hình trình duyệt ngay tại thời điểm `TC08` bị lỗi locator.
4. [`artifacts/self-healing-evidence.json`](./artifacts/self-healing-evidence.json): Dữ liệu phân tích nguyên nhân gốc rễ và đề xuất sửa locator của AI.
5. `playwright-report/index.html`: Báo cáo HTML trực quan của Playwright (mở bằng lệnh `npm run test:report`).
6. `test-results/results.json`: Báo cáo JSON chi tiết toàn bộ 24 bài kiểm thử E2E.
