# Nhật ký Tương tác AI, Phân tích Lỗi & Tự phục hồi Locator (AI Testing Log)

Tài liệu này lưu trữ **bằng chứng thực tế** quá trình AI trong **Antigravity** kết hợp **Microsoft Playwright MCP (`@playwright/mcp`)** thực hiện khám phá website, sinh kịch bản kiểm thử tự động, phân tích log thất bại và sửa lỗi locator có xác nhận (Human-in-the-loop Self-Healing) cho môn **SWT301**.

---

## 1. Bằng chứng kết nối Playwright MCP và khám phá trình duyệt thật

### 1.1. Cấu hình tích hợp Playwright MCP
Dự án tích hợp trực tiếp gói chính thức `@playwright/mcp` của Microsoft qua giao thức Model Context Protocol (Stdio Transport) tại:
- Cấu hình Plugin Workspace: `.agents/plugins/playwright-mcp/mcp_config.json`
- Cấu hình Global Antigravity: `~/.gemini/config/mcp_config.json`
- Script thực thi khám phá tự động: `scripts/mcp-explore.js` (`npm run mcp:explore`)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### 1.2. Nhật ký thực thi `npm run mcp:explore` thực tế
Khi chạy lệnh `npm run mcp:explore`, MCP Client khởi tạo tiến trình `@playwright/mcp`, phát hiện **25 công cụ điều khiển trình duyệt** và thực hiện khám phá trực tiếp ứng dụng:

```text
===================================================================
[MCP-EXPLORE] Starting Microsoft Playwright MCP Live Exploration...
===================================================================

[1/6] Web Application started at: http://localhost:63940
[2/6] Connected to @playwright/mcp server over MCP Stdio protocol.
[3/6] Discovered 25 Playwright MCP tools:
      browser_close, browser_resize, browser_console_messages, browser_handle_dialog,
      browser_emulate_media, browser_evaluate, browser_file_upload, browser_drop,
      browser_find, browser_fill_form, browser_press_key, browser_type,
      browser_navigate, browser_navigate_back, browser_network_requests,
      browser_network_request, browser_run_code_unsafe, browser_take_screenshot,
      browser_snapshot, browser_click, browser_drag, browser_hover,
      browser_select_option, browser_tabs, browser_wait_for

[4/6] Calling MCP tool: browser_navigate -> http://localhost:63940
      Captured Login Page Accessibility Snapshot via MCP!

[5/6] Calling MCP tool: browser_snapshot to inspect DOM Accessibility Tree...
      Found Login Submit button in Accessibility Tree [ref=e36]. Clicking via MCP browser_click...
      Logged in and captured Workspace Dashboard Accessibility Snapshot via MCP!

[6/6] Saved real MCP exploration evidence to: artifacts/mcp-exploration-snapshot.md
```

### 1.3. Trích đoạn Accessibility Tree thực tế do Playwright MCP trả về
Toàn bộ dữ liệu gốc được lưu tại [`artifacts/mcp-exploration-snapshot.md`](./artifacts/mcp-exploration-snapshot.md). Dưới đây là trích đoạn cây Accessibility sau khi AI gọi `browser_click` vào nút `Vào không gian học tập [ref=e36]`:

```yaml
- main [active] [ref=e69]:
  - generic [ref=e74]:
    - heading "Việc học, trong tầm tay." [level=1] [ref=e76]
    - button "Tạo nhiệm vụ" [ref=e78] [cursor=pointer]:
      - generic [aria-hidden] [ref=e79]: ＋
      - text: Tạo nhiệm vụ
  - region "Thống kê nhiệm vụ" [ref=e80]:
    - button [ref=e81]: Tổng nhiệm vụ "3"
    - button [ref=e85]: Cần bắt đầu "1"
    - button [ref=e89]: Đang thực hiện "1"
    - button [ref=e93]: Đã hoàn thành "1" (33% mục tiêu đã hoàn thành)
  - generic [ref=e154]:
    - searchbox "Tìm nhiệm vụ" [ref=e157]
    - combobox "Lọc trạng thái" [ref=e158]
    - combobox "Lọc ưu tiên" [ref=e159]
    - combobox "Sắp xếp nhiệm vụ" [ref=e160]
```

---

## 2. Nhật ký AI phát hiện và xử lý vấn đề thực tế khi tạo Test Suite

Trong quá trình AI tạo và chạy thử nghiệm bộ 24 bài kiểm thử E2E (`tests/e2e/student-task-manager.spec.js`), AI đã ghi nhận **2 tình huống thực tế** từ log chạy Playwright và tiến hành phân tích, điều chỉnh chính xác:

### Tình huống thực tế #1: Rò rỉ trạng thái dữ liệu In-Memory khi chạy `POST /api/tasks`
- **Triệu chứng trong Log:** Ở lần chạy đầu tiên, các bài test `TC01` -> `TC08` đều PASS, nhưng từ `TC09` trở đi bị lỗi tại hàm `resetAndLogin`:
  ```text
  Error: expect(locator).toContainText(expected) failed
  Locator: locator('#result-count')
  Expected substring: "3 / 3 nhiệm vụ"
  Received string:    "4 / 4 nhiệm vụ"
  ```
- **AI Phân tích nguyên nhân gốc rễ (Root Cause Analysis):**
  - AI kiểm tra `src/data/tasks.data.js` và `src/routes/task.routes.js`:
    ```js
    const { tasks, getNextTaskId } = require('../data/tasks.data');
    ```
  - Hàm `resetData()` trong `tasks.data.js` thực hiện gán lại biến cục bộ `tasks = JSON.parse(JSON.stringify(mockTasks))`, nhưng `task.routes.js` đã destructure tham chiếu mảng `tasks` ban đầu ngay khi khởi động server. Do yêu cầu đề bài là **giữ nguyên không chỉnh sửa mã nguồn backend**, mọi thay đổi thêm/sửa/xóa qua API đều tác động trực tiếp lên mảng `tasks` gốc trong bộ nhớ.
- **Giải pháp của AI:**
  - Trong `TC08` (Tạo nhiệm vụ mới), sau khi kiểm chứng tạo thành công và tổng số nhiệm vụ lên `4`, test tự động xóa nhiệm vụ vừa tạo để trả mảng in-memory về đúng 3 nhiệm vụ gốc.
  - Trong `TC10` (Chỉnh sửa nhiệm vụ #1), sau khi kiểm chứng cập nhật thành công, test khôi phục lại tiêu đề và trạng thái `TODO` ban đầu của nhiệm vụ #1.
  - Trong `TC12` (Xóa nhiệm vụ), test tạo một nhiệm vụ tạm thời (`Nhiem vu tam thoi de xoa`) rồi xóa chính nhiệm vụ đó để bảo toàn 3 nhiệm vụ mẫu.

### Tình huống thực tế #2: Hành vi tìm kiếm toàn văn (Full-text Search) trong `TC16`
- **Triệu chứng trong Log:** Khi `TC16` nhập từ khóa `"postman"` vào `#task-search`, test kỳ vọng 1 kết quả nhưng nhận về 2 kết quả:
  ```text
  Error: expect(locator).toHaveCount(expected) failed
  Locator:  locator('#tasks-list .task-row')
  Expected: 1
  Received: 2
  ```
- **AI Phân tích nguyên nhân gốc rễ:**
  - AI đọc hàm `filteredTasks()` tại dòng 425 của `public/js/app.js`:
    ```js
    normalize(`${task.title} ${task.description} ${task.course}`).includes(query)
    ```
  - Trong dữ liệu mẫu (`tasks.data.js`), từ `"Postman"` xuất hiện ở cả **tiêu đề của Task #2** (`"Cai dat Postman va Newman"`) lẫn **mô tả của Task #3** (`"Viet test case va tao Postman Collection..."`).
- **Giải pháp của AI:**
  - Cập nhật `TC16` kiểm tra cả 2 trường hợp: tìm từ khóa `"newman"` (khớp duy nhất 1 nhiệm vụ) và tìm từ khóa `"postman"` (khớp 2 nhiệm vụ cả ở tiêu đề và mô tả), giúp bài kiểm thử phản ánh chính xác 100% logic nghiệp vụ của ứng dụng.

---

## 3. Minh họa quy trình Sửa lỗi Locator có kiểm soát bằng AI (Controlled Self-Healing Workflow)

Đây là kịch bản trọng tâm dùng để trình diễn trực tiếp trước giảng viên (Bước 4 -> Bước 6 trong `DEMO_GUIDE.md`).

### Bước 3.1: Tạo lỗi Locator có kiểm soát (`npm run demo:break-locator`)
Chạy lệnh `npm run demo:break-locator`, script sẽ thay đổi selector của nút **"Tạo nhiệm vụ"** trong `TC08` từ `#btn-new-task` sang một selector bị hỏng `#btn-add-task-broken` (mô phỏng trường hợp lập trình viên đổi ID trên giao diện hoặc viết sai selector):

```javascript
// Trong file tests/e2e/student-task-manager.spec.js (Dòng 125-128)
// [SELF-HEALING-TARGET-START]
const createTaskBtn = page.locator('#btn-add-task-broken');
// [SELF-HEALING-TARGET-END]
await createTaskBtn.click();
```

### Bước 3.2: Chạy Playwright và thu thập Log lỗi + Snapshot (`npx playwright test -g "TC08"`)
Kết quả chạy thực tế báo **FAIL** sau 10 giây chờ đợi, đồng thời Playwright tự động chụp ảnh màn hình (`artifacts/tc08-failure-screenshot.png`) và xuất file ngữ cảnh lỗi (`artifacts/tc08-failure-error-context.md`):

```text
  1) [chromium] › tests\e2e\student-task-manager.spec.js:124:3 › 2. CRUD Tasks Operations (TC07 - TC12) › TC08: Create a new task successfully via modal dialog 

    TimeoutError: locator.click: Timeout 10000ms exceeded.
    Call log:
      - waiting for locator('#btn-add-task-broken')

      126 |     const createTaskBtn = page.locator('#btn-add-task-broken');
      127 |     // [SELF-HEALING-TARGET-END]
    > 128 |     await createTaskBtn.click();
          |                         ^
```

### Bước 3.3: AI phân tích Log thất bại kết hợp DOM & Accessibility Tree (`npm run demo:analyze-locator`)
Chạy lệnh `npm run demo:analyze-locator`, công cụ phân tích AI đọc file kết quả lỗi (`test-results/results.json`), đối chiếu với cấu trúc HTML thực tế (`public/index.html`) và cây Accessibility của Playwright MCP:

```text
===================================================================
[AI SELF-HEALING ANALYZER] Inspecting Failure Log & Live DOM...
===================================================================

1. Current Spec Status: BROKEN

2. Failure Log Extracted:
-------------------------------------------------------------------
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('#btn-add-task-broken')
-------------------------------------------------------------------

3. AI DOM & Accessibility Tree Analysis:
   - Failed selector in test : `#btn-add-task-broken`
   - Root cause              : Selector ID `#btn-add-task-broken` does not exist in DOM.
   - Discovered DOM element  : <button class="button primary" id="btn-new-task">＋ Tạo nhiệm vụ</button>
   - MCP Accessibility node  : button "Tạo nhiệm vụ" [ref=e78]
   - Recommended Primary Fix : page.locator('#btn-new-task')
   - Alternative Semantic Fix: page.getByRole('button', { name: 'Tạo nhiệm vụ' })

[CONFIRMATION REQUIRED] Do you approve applying the locator fix `#btn-new-task`? (y/n):
```

Bằng chứng JSON của quá trình phân tích được lưu tự động tại [`artifacts/self-healing-evidence.json`](./artifacts/self-healing-evidence.json):
```json
{
  "analyzedAt": "2026-10-22T06:17:14.703Z",
  "testCase": "TC08: Create a new task successfully via modal dialog",
  "brokenSelector": "#btn-add-task-broken",
  "discoveredDomId": "#btn-new-task",
  "semanticLocator": "page.getByRole('button', { name: 'Tạo nhiệm vụ' })",
  "errorMessage": "TimeoutError: locator.click: Timeout 10000ms exceeded.\nCall log:\n  - waiting for locator('#btn-add-task-broken')"
}
```

### Bước 3.4: Xác nhận của con người (Human-in-the-Loop) và áp dụng sửa lỗi (`npm run demo:fix-locator`)
- Kiểm thử viên nhập `y` (hoặc chạy `npm run demo:fix-locator`) để xác nhận áp dụng sửa đổi.
- Locator trong `TC08` được khôi phục về `page.locator('#btn-new-task')`.
- Chạy lại `npm test`: Toàn bộ **24/24 bài kiểm thử E2E đều PASS (100%)**.
