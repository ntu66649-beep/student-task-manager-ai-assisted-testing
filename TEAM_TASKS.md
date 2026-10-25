# Phân công công việc Nhóm (Team Tasks – 4 Thành viên)

Dự án **Student Task Manager – AI-Assisted Testing** được thiết kế với khối lượng công việc cân bằng, rõ ràng cho **4 thành viên** trong nhóm môn **SWT301 (Software Testing)**, đảm bảo mỗi thành viên đều nắm vững cả lý thuyết kiểm thử lẫn thực hành AI-Assisted Testing với Playwright và Playwright MCP.

---

## 1. Bảng phân công tổng quan

| Thành viên | Vai trò chính (Role) | Phạm vi phụ trách (Test Cases & Modules) | Sản phẩm bàn giao (Deliverables) | Tỷ lệ đóng góp |
| :--- | :--- | :--- | :--- | :---: |
| **Thành viên 1 (Nhóm trưởng)** | Kiến trúc Test, Tích hợp Playwright MCP & Kiểm thử Xác thực (Auth) | - Cấu hình dự án, Express Server & Playwright MCP (`@playwright/mcp`)<br>- Script khám phá MCP (`scripts/mcp-explore.js`)<br>- **TC01 – TC06** (Login, Show/Hide Password, Logout, Session Reload) | - `playwright.config.js`<br>- `.agents/plugins/playwright-mcp/`<br>- `scripts/mcp-explore.js`<br>- `README.md`, `TEAM_TASKS.md` | **25%** |
| **Thành viên 2** | Kiểm thử Chức năng CRUD Nhiệm vụ & Luồng nghiệp vụ chính | - Phân tích DOM hộp thoại `<dialog>` qua MCP Snapshot<br>- **TC07 – TC12** (Dashboard Stats, Create Task, Detail Modal, Edit Task, Quick Status Advance, Delete Task) | - Nhóm test `2. CRUD Tasks Operations` trong `student-task-manager.spec.js`<br>- `AI_TEST_CASES.md` (Phần CRUD & API) | **25%** |
| **Thành viên 3** | Kiểm thử Validation, Tìm kiếm, Bộ lọc, Sắp xếp & Giao diện | - Thiết kế kịch bản kiểm thử biên (Boundary/Validation) và bộ lọc đa điều kiện<br>- **TC13 – TC20** (Empty/Whitespace Validation, Search không dấu, Filter Status/Priority, Sort, Kanban Board, Dark/Light Theme) | - Nhóm test `3. Validation` & `4. Search, Filter, Sort` trong `student-task-manager.spec.js`<br>- `TEST_REPORT.md` | **25%** |
| **Thành viên 4** | Kiểm thử Phân quyền, Xử lý lỗi API & Quy trình AI Self-Healing Locator | - Giả lập lỗi API (HTTP 401/400/500) bằng `page.route()`<br>- **TC21 – TC24** (Auth Guard, 500 Retry, Form Error)<br>- Xây dựng kịch bản sửa lỗi Locator bằng AI (`scripts/self-healing-demo.js`) | - Nhóm test `5. Authorization & API Error Handling`<br>- `scripts/self-healing-demo.js`<br>- `AI_TESTING_LOG.md`, `DEMO_GUIDE.md` | **25%** |

---

## 2. Chi tiết nhiệm vụ của từng thành viên

### Thành viên 1: Kiến trúc Kiểm thử, Playwright MCP & Authentication (TC01 – TC06)
1. **Thiết lập môi trường & Sao chép hệ thống:**
   - Sao chép nguyên vẹn ứng dụng Web & REST API từ dự án `student-task-manager-api-testing` sang `student-task-manager-ai-assisted-testing`.
   - Tích hợp Microsoft Playwright MCP (`@playwright/mcp`) vào Antigravity (`.agents/plugins/playwright-mcp/mcp_config.json`) và xây dựng script `scripts/mcp-explore.js` để trích xuất Accessibility Tree thực tế.
2. **Kiểm thử luồng Xác thực (TC01 – TC06):**
   - Kiểm thử đăng nhập thành công (`student` / `password123`), đăng nhập sai mật khẩu, kiểm tra ràng buộc khoảng trắng, nút Hiện/Ẩn mật khẩu (`aria-pressed`), đăng xuất xóa `sessionStorage`, và duy trì phiên sau khi tải lại trang (`F5`).
3. **Trình bày khi bảo vệ:**
   - Giới thiệu tổng quan kiến trúc dự án, giải thích cơ chế hoạt động của **Model Context Protocol (MCP)** và thực hiện **Bước 1 & Bước 2** trong kịch bản Demo.

---

### Thành viên 2: Kiểm thử CRUD Nhiệm vụ & Đồng bộ Thống kê (TC07 – TC12)
1. **Phân tích cấu trúc DOM với AI:**
   - Sử dụng dữ liệu snapshot từ Playwright MCP để xác định chính xác các selector của thẻ thống kê (`#stat-total`, `#stat-todo`, `#stat-inprogress`, `#stat-completed`), vòng tròn tiến độ (`#progress-percent`) và biểu mẫu `<dialog id="task-dialog">`.
2. **Xây dựng bộ kiểm thử CRUD (TC07 – TC12):**
   - **TC07:** Kiểm tra dữ liệu mẫu ban đầu (3 nhiệm vụ, tiến độ 33%).
   - **TC08:** Tạo nhiệm vụ mới qua modal và kiểm chứng cập nhật danh sách + thống kê.
   - **TC09:** Mở hộp thoại xem chi tiết nhiệm vụ (`#detail-dialog`).
   - **TC10:** Chỉnh sửa tiêu đề và trạng thái nhiệm vụ hiện có.
   - **TC11:** Kiểm thử nút chuyển nhanh trạng thái (`TODO` -> `IN_PROGRESS` -> `COMPLETED` -> `TODO`).
   - **TC12:** Xóa nhiệm vụ có xác nhận qua hộp thoại `#delete-dialog`.
3. **Trình bày khi bảo vệ:**
   - Thực hiện **Bước 3** trong kịch bản Demo (chạy Playwright automation cho nhóm CRUD và giải thích cách đảm bảo tính độc lập dữ liệu giữa các bài test).

---

### Thành viên 3: Kiểm thử Validation, Tìm kiếm, Bộ lọc & Chế độ hiển thị (TC13 – TC20)
1. **Kiểm thử Ràng buộc đầu vào & Trường hợp biên (TC13 – TC15):**
   - Kiểm tra HTML5 Custom Validity khi người dùng chỉ nhập khoảng trắng vào tên nhiệm vụ (`TC13`).
   - Kiểm tra hành vi hủy thao tác xóa (`TC14`) và kiểm tra ràng buộc dữ liệu ở tầng REST API (`TC15`).
2. **Kiểm thử Tìm kiếm, Lọc, Sắp xếp & UI (TC16 – TC20):**
   - Kiểm thử tìm kiếm tiếng Việt không dấu/không phân biệt hoa thường và trạng thái rỗng `#tasks-empty` (`TC16`).
   - Kiểm thử lọc theo trạng thái và mức độ ưu tiên (`TC17`), sắp xếp theo tên A–Z và mới nhất (`TC18`).
   - Kiểm thử chuyển đổi chế độ Danh sách (`list`) sang Bảng (`board` Kanban 3 cột) (`TC19`) và chuyển tab điều hướng kèm chế độ Sáng/Tối (`TC20`).
3. **Trình bày khi bảo vệ:**
   - Giải thích cách AI phát hiện các quy tắc chuẩn hóa chuỗi tiếng Việt (`normalize("NFD")`) trong `public/js/app.js` để sinh test case tìm kiếm chính xác.

---

### Thành viên 4: Kiểm thử Phân quyền, Xử lý lỗi API & AI Self-Healing (TC21 – TC24)
1. **Kiểm thử Phân quyền & Xử lý sự cố mạng/API (TC21 – TC24):**
   - Sử dụng kỹ thuật Network Interception (`page.route()`) của Playwright để giả lập phản hồi lỗi từ máy chủ mà không cần sửa code backend:
     - **TC21:** Giả lập lỗi `401 Unauthorized` khi phiên hết hạn -> Kiểm chứng tự động đăng xuất và thông báo toast.
     - **TC22:** Giả lập lỗi `500 Internal Server Error` -> Kiểm chứng hiển thị `#tasks-error` và chức năng khôi phục khi bấm `#retry-tasks`.
     - **TC23:** Giả lập lỗi `400 Bad Request` khi lưu nhiệm vụ -> Kiểm chứng hiển thị `#task-form-error` ngay trong modal.
     - **TC24:** Kiểm chứng bảo mật API khi gọi trực tiếp không có Bearer Token.
2. **Minh họa quy trình AI Self-Healing Locator (`scripts/self-healing-demo.js`):**
   - Xây dựng quy trình tạo lỗi locator có kiểm soát (`#btn-add-task-broken`), dùng AI phân tích log lỗi kết hợp DOM thực tế để đề xuất `#btn-new-task` và yêu cầu xác nhận từ kiểm thử viên trước khi sửa.
3. **Trình bày khi bảo vệ:**
   - Thực hiện **Bước 4, Bước 5 và Bước 6** trong kịch bản Demo (Tạo lỗi -> AI phân tích & đề xuất sửa -> Xác nhận sửa -> Chạy lại PASS 100% và mở báo cáo HTML).

---

## 3. Quy trình phối hợp nhóm trên GitHub

1. **Quản lý nhánh (Branching Strategy):**
   - `main`: Nhánh chính chứa mã nguồn ổn định, toàn bộ 24 E2E tests và 15 API tests đều đạt trạng thái PASS 100%.
   - Các nhánh thành viên: `feat/mcp-auth-tests`, `feat/crud-tests`, `feat/search-validation-tests`, `feat/error-self-healing`.
2. **Tiêu chuẩn gộp code (Pull Request Checklist):**
   - Không chỉnh sửa giao diện hoặc logic của ứng dụng gốc (`src/` và `public/`).
   - Chạy `npm run test:api` (15/15 PASS) và `npm test` (24/24 PASS) trước khi tạo Pull Request.
   - Lưu đầy đủ bằng chứng log và snapshot vào thư mục `artifacts/` và cập nhật tài liệu Markdown tương ứng.
