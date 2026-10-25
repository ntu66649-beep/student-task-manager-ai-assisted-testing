# Danh sách Test Cases do AI hỗ trợ xây dựng (AI-Assisted Test Cases)

Tài liệu này lưu trữ toàn bộ **24 kịch bản kiểm thử tự động End-to-End (Playwright)** và **15 kịch bản kiểm thử REST API** được AI trong Antigravity phân tích và đề xuất sau khi khám phá trực tiếp ứng dụng **Student Task Manager** thông qua **Microsoft Playwright MCP (`@playwright/mcp`)**.

---

## 1. Quy trình AI khám phá Website và trích xuất Test Cases

1. **Khởi chạy Playwright MCP Server:** AI kết nối với `@playwright/mcp` qua giao thức Model Context Protocol (Stdio Transport) và gọi các công cụ `browser_navigate`, `browser_snapshot`, `browser_click`.
2. **Đọc Accessibility Tree & DOM thực tế:**
   - Phát hiện màn hình xác thực (`#auth-section`) gồm: `#login-username`, `#login-password`, `#show-password` (`aria-pressed`), `#btn-login-submit`, `#login-error`.
   - Sau khi đăng nhập (`student` / `password123`), AI chụp Accessibility Tree của `#app-shell`, phát hiện thanh điều hướng (`#overview`, `#tasks`, `#completed`), 4 thẻ thống kê (`#stat-total`, `#stat-todo`, `#stat-inprogress`, `#stat-completed`), bộ công cụ lọc/tìm kiếm (`#task-search`, `#filter-status`, `#filter-priority`, `#sort-tasks`, `[data-view="list"]`, `[data-view="board"]`), và 3 hộp thoại `<dialog>` (`#task-dialog`, `#detail-dialog`, `#delete-dialog`).
3. **Phân tích mã nguồn REST API & Frontend (`src/` & `public/js/app.js`):**
   - Xác định cơ chế bảo mật Bearer Token (`Authorization: Bearer mock-token-swt301-xyz123`).
   - Phát hiện cách giao diện xử lý lỗi HTTP 401 (tự động xóa phiên và quay về màn hình đăng nhập kèm thông báo toast) và lỗi HTTP 400/500 (hiển thị `#tasks-error` kèm nút `#retry-tasks` hoặc `#task-form-error` trong biểu mẫu).

---

## 2. Ma trận 24 Playwright E2E Test Cases (`tests/e2e/student-task-manager.spec.js`)

### Nhóm 1: Xác thực & Quản lý phiên đăng nhập (Authentication & Session Flow)

| Mã TC | Tên Test Case | Phân loại | Các bước thực hiện (AI-Generated Steps) | Locator chính sử dụng | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC01** | Đăng nhập thành công với tài khoản hợp lệ | Positive | 1. Mở trang chủ `/`<br>2. Nhập `student` / `password123`<br>3. Bấm nút đăng nhập | `#login-username`<br>`#login-password`<br>`#btn-login-submit`<br>`#app-shell` | Ẩn `#auth-section`, hiển thị `#app-shell`, tên `Nguyen Van A`, email `student@fpt.edu.vn`, tổng nhiệm vụ `3`. |
| **TC02** | Đăng nhập thất bại khi sai mật khẩu | Negative | 1. Mở trang chủ `/`<br>2. Nhập `student` / `wrong_password_123`<br>3. Bấm nút đăng nhập | `#login-error`<br>`#app-shell` | Hiển thị lỗi `#login-error` với nội dung `"Tên đăng nhập hoặc mật khẩu chưa đúng."`, không mở `#app-shell`. |
| **TC03** | Kiểm tra ràng buộc khi tên đăng nhập chỉ chứa khoảng trắng | Validation | 1. Mở trang chủ `/`<br>2. Nhập `"   "` vào ô username<br>3. Bấm nút đăng nhập | `#login-username`<br>`#login-error` | Chặn gửi API, hiển thị lỗi `"Vui lòng nhập tên đăng nhập và mật khẩu."`. |
| **TC04** | Bật/tắt hiển thị mật khẩu (Show/Hide Password) | UI / A11y | 1. Mở trang chủ `/`<br>2. Bấm nút `Hiện` (`#show-password`)<br>3. Bấm lại nút `Ẩn` | `#login-password`<br>`#show-password` | Thuộc tính `type` chuyển từ `password` -> `text` -> `password`; `aria-pressed` chuyển `false` -> `true` -> `false`. |
| **TC05** | Đăng xuất xóa phiên làm việc và quay về màn hình Login | Positive | 1. Đăng nhập hợp lệ<br>2. Bấm nút `#btn-logout` ở thanh bên | `#btn-logout`<br>`#toast-message`<br>`#auth-section` | `sessionStorage.getItem('token')` bị xóa (`null`), hiển thị `#auth-section` và toast `"Bạn đã đăng xuất"`. |
| **TC06** | Duy trì phiên đăng nhập khi tải lại trang (Reload) | Positive | 1. Đăng nhập hợp lệ<br>2. Gọi `page.reload()` | `#app-shell`<br>`#user-name`<br>`#stat-total` | Vẫn giữ trạng thái đăng nhập trong `#app-shell`, hiển thị đúng `Nguyen Van A` và `3` nhiệm vụ. |

---

### Nhóm 2: Thao tác CRUD Nhiệm vụ học tập (CRUD Tasks Operations)

| Mã TC | Tên Test Case | Phân loại | Các bước thực hiện (AI-Generated Steps) | Locator chính sử dụng | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC07** | Tải danh sách nhiệm vụ mẫu và thống kê tiến độ ban đầu | Positive | 1. Đăng nhập vào Dashboard<br>2. Kiểm tra các thẻ thống kê và vòng tròn tiến độ | `#stat-total`, `#stat-todo`, `#stat-inprogress`, `#stat-completed`, `#progress-percent` | Tổng: `3`, Cần bắt đầu: `1`, Đang thực hiện: `1`, Đã hoàn thành: `1`, Tiến độ: `33%`. |
| **TC08** | Tạo nhiệm vụ mới thành công qua hộp thoại Modal | Positive | 1. Bấm `#btn-new-task`<br>2. Điền tên, mô tả, môn học, hạn, ưu tiên `HIGH`<br>3. Bấm `#btn-save-task` | `#btn-new-task`<br>`#task-dialog`<br>`#task-title`<br>`#btn-save-task` | Modal đóng lại, hiển thị toast `"Đã tạo nhiệm vụ"`, tổng nhiệm vụ tăng lên `4`, nhiệm vụ mới xuất hiện trên danh sách. |
| **TC09** | Xem chi tiết nhiệm vụ trong hộp thoại Detail Modal | Positive | 1. Bấm vào tiêu đề nhiệm vụ ID 1<br>2. Kiểm tra nội dung trong `#detail-dialog`<br>3. Đóng hộp thoại | `.task-row[data-id="1"]`<br>`[data-action="detail"]`<br>`#detail-dialog` | Hiển thị đầy đủ tiêu đề `"On tap ly thuyet SWT301"`, mô tả `"Black-box testing"`, mã `#1`, đóng modal bình thường. |
| **TC10** | Chỉnh sửa nhiệm vụ hiện có và cập nhật giao diện | Positive | 1. Bấm nút `Sửa` ở nhiệm vụ ID 1<br>2. Đổi tên và chuyển trạng thái sang `COMPLETED`<br>3. Bấm `Lưu thay đổi` | `[data-action="edit"]`<br>`#task-title`<br>`#task-status`<br>`#btn-save-task` | Hiển thị toast `"Đã lưu thay đổi nhiệm vụ"`, tên nhiệm vụ cập nhật ngay trên danh sách, thống kê hoàn thành tăng lên `2`. |
| **TC11** | Chuyển nhanh trạng thái nhiệm vụ theo vòng lặp (Quick Advance) | Positive | 1. Bấm nút tròn `[data-action="advance"]` trên nhiệm vụ ID 1 (3 lần liên tiếp) | `.task-row[data-id="1"]`<br>`[data-action="advance"]`<br>`.status-tag` | Trạng thái chuyển tuần tự: `Cần làm` (`TODO`) -> `Đang làm` (`IN_PROGRESS`) -> `Hoàn thành` (`COMPLETED`) -> `Cần làm`. |
| **TC12** | Xóa nhiệm vụ sau khi xác nhận trong hộp thoại Delete Modal | Positive | 1. Tạo 1 nhiệm vụ tạm thời<br>2. Bấm `Xóa` (`[data-action="delete"]`)<br>3. Bấm `#confirm-delete` | `[data-action="delete"]`<br>`#delete-dialog`<br>`#confirm-delete` | Hộp thoại xác nhận hiển thị đúng tên nhiệm vụ, sau khi bấm xác nhận thì nhiệm vụ biến mất khỏi DOM và cập nhật thống kê. |

---

### Nhóm 3: Kiểm tra Ràng buộc dữ liệu & Trường hợp biên (Input Validation & Edge Cases)

| Mã TC | Tên Test Case | Phân loại | Các bước thực hiện (AI-Generated Steps) | Locator chính sử dụng | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC13** | Chặn tạo nhiệm vụ khi tiêu đề chỉ chứa khoảng trắng | Validation | 1. Mở modal tạo nhiệm vụ<br>2. Nhập `"     "` vào `#task-title`<br>3. Bấm `#btn-save-task` | `#task-dialog`<br>`#task-title`<br>`#btn-save-task` | Form không gửi request, hộp thoại vẫn mở, thông báo HTML5 Custom Validity `"Vui lòng nhập tên nhiệm vụ."`. |
| **TC14** | Hủy thao tác xóa nhiệm vụ giữ nguyên dữ liệu | Edge Case | 1. Bấm `Xóa` trên nhiệm vụ ID 1<br>2. Bấm nút `Giữ lại` (`[data-close="delete-dialog"]`) | `#delete-dialog`<br>`[data-close="delete-dialog"]` | Hộp thoại đóng lại, nhiệm vụ ID 1 vẫn hiển thị trong danh sách, tổng số nhiệm vụ vẫn là `3`. |
| **TC15** | Backend API từ chối `POST /api/tasks` thiếu tiêu đề hoặc sai Priority | Negative / API | 1. Gửi `POST /api/tasks` với `title: "   "`<br>2. Gửi `POST /api/tasks` với `priority: "CRITICAL_INVALID"` | Playwright `request.post('/api/tasks')` | Cả 2 request đều nhận mã HTTP `400 Bad Request` và `success: false`. |

---

### Nhóm 4: Tìm kiếm, Bộ lọc, Sắp xếp & Chế độ hiển thị (Search, Filter, Sort & View Modes)

| Mã TC | Tên Test Case | Phân loại | Các bước thực hiện (AI-Generated Steps) | Locator chính sử dụng | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC16** | Tìm kiếm nhiệm vụ theo từ khóa (không phân biệt hoa thường/dấu) & trạng thái rỗng | Positive & Edge | 1. Nhập `"newman"` vào `#task-search`<br>2. Nhập `"postman"`<br>3. Nhập `"khong_ton_tai_xyz_999"`<br>4. Bấm `#clear-filters` | `#task-search`<br>`#tasks-empty`<br>`#empty-title`<br>`#clear-filters` | `"newman"` trả về 1 kết quả; `"postman"` trả về 2 kết quả (khớp cả mô tả); từ khóa lạ hiển thị `#tasks-empty`; xóa lọc trả lại 3 nhiệm vụ. |
| **TC17** | Lọc danh sách nhiệm vụ theo Trạng thái và Mức ưu tiên | Positive | 1. Chọn `#filter-status` = `TODO`<br>2. Đặt lại trạng thái, chọn `#filter-priority` = `HIGH` | `#filter-status`<br>`#filter-priority`<br>`#tasks-list .task-row` | Lọc `TODO` hiển thị 1 nhiệm vụ (`On tap ly thuyet SWT301`); lọc `HIGH` hiển thị 2 nhiệm vụ ưu tiên cao. |
| **TC18** | Sắp xếp nhiệm vụ theo Tên A–Z và Mới nhất | Positive | 1. Chọn `#sort-tasks` = `title`<br>2. Chọn `#sort-tasks` = `newest` | `#sort-tasks`<br>`#tasks-list .task-name` | Sắp xếp A–Z đưa `"Cai dat Postman va Newman"` lên đầu; sắp xếp Mới nhất đưa `"Lam bai tap Assignment 1"` (ID 3) lên đầu. |
| **TC19** | Chuyển đổi chế độ hiển thị Danh sách (List) và Bảng (Kanban Board) | UI | 1. Bấm nút `[data-view="board"]`<br>2. Bấm nút `[data-view="list"]` | `[data-view="board"]`<br>`[data-view="list"]`<br>`.board-column` | Chế độ bảng hiển thị 3 cột trạng thái (`.board-column`), `aria-pressed="true"`; chuyển lại danh sách ẩn các cột board. |
| **TC20** | Điều hướng giữa các trang (`#overview`, `#completed`) và đổi giao diện Sáng/Tối | UI | 1. Bấm menu `Đã hoàn thành`<br>2. Bấm menu `Tổng quan`<br>3. Bấm `#theme-toggle` | `nav a[data-page]`<br>`#breadcrumb`<br>`#insights`<br>`#theme-toggle` | Tab `Đã hoàn thành` ẩn `#insights` và lọc riêng việc đã xong; `#theme-toggle` đổi thuộc tính `data-theme` trên thẻ `<html>`. |

---

### Nhóm 5: Phân quyền & Xử lý lỗi API trên giao diện (Authorization & API Error Handling)

| Mã TC | Tên Test Case | Phân loại | Các bước thực hiện (AI-Generated Steps) | Locator chính sử dụng | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC21** | Tự động đăng xuất và cảnh báo khi API trả về 401 Unauthorized | Security / Auth | 1. Dùng `page.route('**/api/tasks')` giả lập trả về HTTP 401<br>2. Bấm nút làm mới `#btn-refresh-tasks` | `#btn-refresh-tasks`<br>`#auth-section`<br>`#toast-message` | Ứng dụng tự động đóng `#app-shell`, quay về màn hình `#auth-section` và hiện toast `"Phiên đăng nhập đã hết hạn"`. |
| **TC22** | Hiển thị hộp báo lỗi khi Server gặp sự cố 500 và cho phép Thử lại (Retry) | Error Handling | 1. Dùng `page.route` giả lập lỗi HTTP 500 khi tải nhiệm vụ<br>2. Kiểm tra `#tasks-error`<br>3. Bỏ chặn lỗi và bấm `#retry-tasks` | `#tasks-error`<br>`#tasks-error-message`<br>`#retry-tasks` | Hiển thị trạng thái lỗi `#tasks-error` kèm thông điệp; khi bấm `Thử lại`, danh sách 3 nhiệm vụ được tải lại thành công. |
| **TC23** | Hiển thị lỗi trực tiếp trên biểu mẫu khi API tạo nhiệm vụ trả về lỗi 400 | Error Handling | 1. Dùng `page.route` giả lập lỗi HTTP 400 cho `POST /api/tasks`<br>2. Mở modal, nhập tiêu đề và bấm lưu | `#task-dialog`<br>`#task-form-error` | Modal không bị đóng, hiển thị thông báo lỗi đỏ ngay tại `#task-form-error`. |
| **TC24** | Chặn hoàn toàn các truy cập API trực tiếp không có Bearer Token | Security / API | 1. Gọi trực tiếp `GET /api/tasks`, `POST /api/tasks`, `DELETE /api/tasks/1` không có header `Authorization` | Playwright `request.get`, `request.post`, `request.delete` | Tất cả các request đều bị middleware `authenticateToken` chặn lại với mã HTTP `401 Unauthorized`. |

---

## 3. Bộ 15 Kiểm thử Đơn vị & Tích hợp REST API (`test/api.test.js`)

Bên cạnh 24 kịch bản Playwright E2E trên trình duyệt, dự án giữ nguyên và kiểm chứng toàn bộ 15 kịch bản kiểm thử REST API gốc (`npm run test:api`):

1. `GET /api/health` – Trả về 200 OK và trạng thái `UP`.
2. `POST /api/auth/login` (Thiếu trường) – Trả về 400 Bad Request.
3. `POST /api/auth/login` (Sai mật khẩu) – Trả về 401 Unauthorized.
4. `POST /api/auth/login` (Thành công) – Trả về 200 OK kèm Bearer Token.
5. `GET /api/tasks` (Không có Token) – Trả về 401 Unauthorized.
6. `GET /api/tasks` (Token sai) – Trả về 401 Unauthorized.
7. `GET /api/tasks` (Hợp lệ) – Trả về 200 OK và danh sách nhiệm vụ.
8. `GET /api/tasks/1` (Tìm thấy) – Trả về 200 OK và nhiệm vụ ID 1.
9. `GET /api/tasks/9999` (Không tồn tại) – Trả về 404 Not Found.
10. `POST /api/tasks` (Thiếu tiêu đề) – Trả về 400 Bad Request.
11. `POST /api/tasks` (Tạo thành công) – Trả về 201 Created.
12. `PUT /api/tasks/:id` (Cập nhật thành công) – Trả về 200 OK.
13. `PUT /api/tasks/9999` (Cập nhật ID không tồn tại) – Trả về 404 Not Found.
14. `DELETE /api/tasks/:id` (Xóa thành công) – Trả về 200 OK.
15. `DELETE /api/tasks/:id` (Xóa lại ID đã xóa) – Trả về 404 Not Found.
