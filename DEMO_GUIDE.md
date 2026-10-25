# Hướng dẫn Trình diễn Demo & Câu hỏi Vấn đáp Bảo vệ (SWT301 Demo Guide)

Tài liệu này cung cấp kịch bản trình diễn **6 bước** mạch lạc, trực quan trước giảng viên môn **SWT301 (Software Testing)**, kèm theo bộ câu hỏi – trả lời vấn đáp chuyên sâu về **AI-Assisted Testing**, **Playwright**, và **Microsoft Playwright MCP**.

---

## Phần 1: Chuẩn bị trước buổi Bảo vệ (1 phút)

Mở Terminal tại thư mục dự án:
```powershell
cd G:\Projects\student-task-manager-ai-assisted-testing
```

Kiểm tra nhanh trạng thái locator hiện tại đang ở mức chuẩn (`HEALTHY`):
```powershell
npm run demo:status
```
*(Nếu muốn mở sẵn website để giới thiệu giao diện, chạy `npm start` ở một cửa sổ terminal phụ và mở `http://localhost:3000`. Khi chạy Playwright test, Playwright sẽ tự động dùng server đang chạy hoặc tự khởi động server).*

---

## Phần 2: Kịch bản Demo 6 Bước chuẩn SWT301 (7 – 10 phút)

### Bước 1: AI khám phá Website thực tế qua Microsoft Playwright MCP
**Mục tiêu:** Chứng minh với giảng viên rằng dự án kết nối trực tiếp với **Microsoft Playwright MCP (`@playwright/mcp`)** trên trình duyệt thật để đọc cây Accessibility (Accessibility Tree) thay vì mô phỏng.

**Lệnh thực thi:**
```powershell
npm run mcp:explore
```

**Điểm nhấn thuyết trình:**
- Chỉ vào màn hình console: Script khởi chạy ứng dụng web, kết nối MCP Client tới `@playwright/mcp` qua giao thức **Model Context Protocol (Stdio Transport)** và liệt kê **25 MCP tools** (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_fill_form`, v.v.).
- AI tự động điều hướng vào trang chủ, đọc Accessibility Tree để tìm nút `Vào không gian học tập [ref=e36]`, thực hiện click đăng nhập và chụp lại toàn bộ cấu trúc Dashboard lưu vào file [`artifacts/mcp-exploration-snapshot.md`](./artifacts/mcp-exploration-snapshot.md).
- Mở nhanh file `artifacts/mcp-exploration-snapshot.md` để giảng viên xem cây Accessibility thực tế.

---

### Bước 2: AI đề xuất và tạo bộ Playwright Test Cases
**Mục tiêu:** Trình bày cách AI chuyển hóa dữ liệu Accessibility Tree và mã nguồn API thành ma trận kiểm thử toàn diện.

**Thao tác trình diễn:**
1. Mở file [`AI_TEST_CASES.md`](./AI_TEST_CASES.md): Giới thiệu 5 nhóm chức năng gồm **24 kịch bản E2E Playwright** (`TC01` – `TC24`) và **15 kịch bản REST API**:
   - Nhóm 1 (`TC01` – `TC06`): Đăng nhập, sai mật khẩu, kiểm tra khoảng trắng, Hiện/Ẩn mật khẩu, Đăng xuất, Reload giữ phiên.
   - Nhóm 2 (`TC07` – `TC12`): CRUD Nhiệm vụ (Xem thống kê, Tạo mới, Xem chi tiết, Chỉnh sửa, Chuyển nhanh trạng thái, Xóa).
   - Nhóm 3 (`TC13` – `TC15`): Ràng buộc dữ liệu (Validation) trên UI và REST API.
   - Nhóm 4 (`TC16` – `TC20`): Tìm kiếm không dấu, lọc trạng thái/ưu tiên, sắp xếp A–Z, chế độ bảng Kanban, giao diện Sáng/Tối.
   - Nhóm 5 (`TC21` – `TC24`): Phân quyền Bearer Token và xử lý lỗi API (401 tự đăng xuất, 500 hiện nút Thử lại, 400 hiện lỗi trong biểu mẫu).
2. Mở file [`tests/e2e/student-task-manager.spec.js`](./tests/e2e/student-task-manager.spec.js) để giảng viên thấy code Playwright rõ ràng, dễ đọc.

---

### Bước 3: Chạy Playwright Automation trên trình duyệt thật
**Mục tiêu:** Chạy tự động toàn bộ 24 test cases hoặc mở giao diện trình duyệt trực quan (Headed / UI Mode) để giảng viên quan sát thao tác tự động.

**Lệnh thực thi (Chạy toàn bộ 24 E2E tests trên terminal):**
```powershell
npm test
```
*(Hoặc chạy mở trình duyệt trực quan cho giảng viên xem: `npm run test:headed` hoặc mở Playwright UI Mode: `npm run test:ui`)*

**Điểm nhấn thuyết trình:**
- Toàn bộ **24/24 bài kiểm thử E2E** chạy hoàn toàn tự động và đạt **PASS 100%** trong khoảng 22 giây.
- Có thể chạy thêm `npm run test:api` để chứng minh **15/15 bài kiểm thử REST API** kế thừa từ dự án trước cũng đạt **PASS 100%**.

---

### Bước 4: Tạo một lỗi kiểm thử có kiểm soát (Controlled Locator Failure)
**Mục tiêu:** Minh họa tình huống thực tế khi giao diện thay đổi hoặc lập trình viên dùng sai Locator khiến bài kiểm thử tự động bị gãy (Broken Locator).

**Lệnh thực thi:**
```powershell
npm run demo:break-locator
npx playwright test -g "TC08"
```

**Điểm nhấn thuyết trình:**
- Lệnh `npm run demo:break-locator` đổi locator của nút **"Tạo nhiệm vụ"** trong `TC08` từ `#btn-new-task` thành `#btn-add-task-broken`.
- Khi chạy lại `TC08`, Playwright báo **FAIL** với lỗi:
  `TimeoutError: locator.click: Timeout 10000ms exceeded. waiting for locator('#btn-add-task-broken')`.
- Playwright tự động ghi nhận ảnh chụp màn hình lúc lỗi và file `error-context.md` chứa DOM snapshot.

---

### Bước 5: AI phân tích lỗi, đề xuất cách sửa và yêu cầu xác nhận (Human-in-the-loop Self-Healing)
**Mục tiêu:** Chứng minh AI không sửa code một cách mù quáng mà phân tích log lỗi + DOM thực tế, đưa ra giải pháp kèm giải thích và **chờ con người xác nhận** trước khi áp dụng.

**Lệnh thực thi:**
```powershell
npm run demo:analyze-locator
```

**Điểm nhấn thuyết trình:**
- Trên màn hình console, AI hiển thị rõ:
  1. **Log lỗi thu thập được:** `waiting for locator('#btn-add-task-broken')`.
  2. **Nguyên nhân gốc rễ:** ID `#btn-add-task-broken` không tồn tại trong DOM của `public/index.html`.
  3. **Đối chiếu DOM & MCP Accessibility Tree:** Tìm thấy phần tử thực tế `<button class="button primary" id="btn-new-task">＋ Tạo nhiệm vụ</button>` (ứng với nút `button "Tạo nhiệm vụ" [ref=e78]` trên MCP).
  4. **Đề xuất sửa:** Đổi về `page.locator('#btn-new-task')` (hoặc `page.getByRole('button', { name: 'Tạo nhiệm vụ' })`).
- AI dừng lại ở dòng nhắc:
  `[CONFIRMATION REQUIRED] Do you approve applying the locator fix '#btn-new-task'? (y/n):`
- Người trình diễn gõ **`y`** và nhấn **Enter** (hoặc chạy `npm run demo:fix-locator`) để xác nhận áp dụng bản vá.

---

### Bước 6: Chạy lại Test thành công 100% và xem Báo cáo HTML
**Mục tiêu:** Kiểm chứng sau khi AI sửa locator, bài kiểm thử `TC08` và toàn bộ bộ test đã hoạt động trở lại bình thường, đồng thời mở báo cáo HTML chuyên nghiệp.

**Lệnh thực thi:**
```powershell
npx playwright test -g "TC08"
npm test
npm run test:report
```

**Điểm nhấn thuyết trình:**
- `TC08` chuyển từ **FAIL (11s timeout)** sang **PASS (1.8s)**.
- Lệnh `npm run test:report` mở giao diện **Playwright HTML Report** trên trình duyệt, hiển thị đầy đủ 24/24 test cases màu xanh lá, thời gian chạy từng bước (Before Hooks, Action, Assertion, After Hooks).

---

## Phần 3: Bộ Câu hỏi & Trả lời Vấn đáp Bảo vệ SWT301 (Q&A)

### Câu 1: Sự khác biệt cốt lõi giữa dự án API Testing (Postman) trước đó và dự án AI-Assisted Testing (Playwright + MCP) này là gì?
- **Trả lời:**
  - Ở dự án **API Testing**, nhóm chỉ kiểm thử ở tầng giao thức HTTP/JSON (`req`/`res`) bằng Postman và script Node.js, không kiểm tra được việc trình duyệt render giao diện, đóng/mở hộp thoại `<dialog>`, hay cách JavaScript xử lý lỗi mạng trên màn hình.
  - Ở dự án **AI-Assisted Testing**, nhóm kiểm thử **End-to-End (E2E)** trên trình duyệt Chromium thật thông qua **Playwright** kết hợp **Playwright MCP**. AI trực tiếp tương tác với giao diện người dùng, kiểm chứng từ sự kiện bấm nút, hiển thị thông báo lỗi/toast, bộ lọc tìm kiếm tiếng Việt không dấu, cho đến sự phối hợp giữa Frontend và REST API.

### Câu 2: Playwright MCP (`@playwright/mcp`) hoạt động như thế nào? Tại sao nó tốt hơn việc chụp ảnh màn hình gửi cho AI?
- **Trả lời:**
  - `@playwright/mcp` là Model Context Protocol server chính thức của Microsoft. Thay vì gửi ảnh chụp màn hình (tốn dung lượng token, dễ nhận diện sai tọa độ pixel), Playwright MCP trích xuất **Accessibility Tree (Cây khả năng tiếp cận)** của trình duyệt dưới dạng cấu trúc YAML/văn bản nhẹ và chính xác tuyệt đối.
  - Mỗi phần tử tương tác được gán một mã tham chiếu (`[ref=e36]`, `[ref=e78]`), giúp AI hiểu rõ vai trò ngữ nghĩa (`role="button"`, `role="searchbox"`, `aria-pressed`) và đề xuất locator chuẩn xác mà không cần tốn chi phí gọi các mô hình xử lý ảnh trả phí.

### Câu 3: Tại sao trong quy trình Self-Healing Locator (Bước 5), nhóm lại yêu cầu xác nhận của con người (Human-in-the-loop) trước khi sửa?
- **Trả lời:**
  - Trong kiểm thử phần mềm (Software Testing), nếu AI tự động sửa mọi bài test bị lỗi mà không hỏi ý kiến kiểm thử viên, AI có thể vô tình che giấu một **lỗi phần mềm thật (Real Bug)** (ví dụ: nút bấm bị mất do lỗi code frontend nhưng AI lại tự đổi sang bấm một nút khác).
  - Do đó, nguyên tắc **Human-in-the-loop** bắt buộc AI phải đóng vai trò trợ lý: phân tích log, chỉ ra nguyên nhân, đề xuất dòng code thay thế và chờ kiểm thử viên xác nhận (`y/n`) trước khi ghi vào file test.

### Câu 4: Làm thế nào nhóm kiểm thử được các trường hợp Server bị lỗi 500 hoặc hết hạn Token (401) khi Backend dùng dữ liệu In-Memory luôn hoạt động tốt?
- **Trả lời:**
  - Nhóm sử dụng kỹ thuật **Network Interception (`page.route()`)** của Playwright trong các bài test `TC21`, `TC22`, `TC23`.
  - Khi trình duyệt gửi request `fetch('/api/tasks')`, Playwright chặn giữa đường và trả về HTTP 401 hoặc HTTP 500 giả lập. Nhờ vậy, nhóm kiểm chứng được chính xác cách giao diện xử lý sự cố (tự động đăng xuất khi gặp 401, hoặc hiện hộp thoại `#tasks-error` kèm nút `Thử lại` khi gặp 500) mà **không cần chỉnh sửa hay làm hỏng code của Backend**.

### Câu 5: Trong quá trình dùng AI tạo test, có trường hợp nào AI tạo test bị fail và nhóm phải phân tích sửa lại không?
- **Trả lời:**
  - Có 2 trường hợp thực tế đã được nhóm ghi lại đầy đủ trong `AI_TESTING_LOG.md`:
    1. **Vấn đề tham chiếu mảng In-Memory (`tasks.data.js`):** Khi `TC08` tạo thêm task thứ 4, các test sau đó bị fail vì tổng số task là 4 thay vì 3 (do `task.routes.js` giữ tham chiếu mảng ban đầu). Nhóm đã cùng AI phân tích nguyên nhân và bổ sung bước dọn dẹp dữ liệu (cleanup) ngay cuối các test thêm/sửa/xóa mà không cần sửa code gốc của server.
    2. **Vấn đề tìm kiếm toàn văn (`TC16`):** Từ khóa `"postman"` khớp với 2 nhiệm vụ (cả trong tiêu đề Task #2 và mô tả Task #3) thay vì 1 nhiệm vụ. Nhờ chạy test thực tế, AI phát hiện hàm `filteredTasks()` gộp cả `title`, `description`, `course` để tìm kiếm, từ đó cập nhật kỳ vọng test chính xác.
