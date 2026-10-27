# Student Task Manager – AI-Assisted Testing (SWT301)

Dự án **AI-Assisted Software Testing** ứng dụng **Playwright**, **Microsoft Playwright MCP (`@playwright/mcp`)** và **AI trong Antigravity** để tự động khám phá giao diện web thực tế, đề xuất kịch bản kiểm thử, sinh mã kiểm thử End-to-End (E2E), phân tích nhật ký lỗi (Failure Log Analysis) và tự phục hồi Locator có xác nhận (Human-in-the-loop Self-Healing) cho môn học **SWT301 – Software Testing**.

---

## 1. Giới thiệu dự án

Dự án kế thừa nguyên vẹn hệ thống **Student Task Manager** (Backend Express REST API + Frontend quản lý nhiệm vụ học tập) từ dự án `student-task-manager-api-testing`, đồng thời mở rộng sang phương pháp **Kiểm thử tự động có sự hỗ trợ của AI (AI-Assisted E2E Testing)**:

- **Frontend được nâng cấp:** Dashboard tím–trắng, giao diện sáng/tối, lịch deadline tương tác, bộ lọc môn học và bố cục responsive. Các luồng đăng nhập, CRUD nhiệm vụ và REST API tiếp tục được sử dụng.
- **Khám phá trình duyệt thật bằng AI (Live Browser Exploration):** Kết nối trực tiếp với **Microsoft Playwright MCP (`@playwright/mcp`)** qua giao thức Model Context Protocol để đọc cấu trúc Accessibility Tree của trang web.
- **Tự động hóa 31 kịch bản E2E Playwright & 15 kịch bản REST API:** Gồm 24 kịch bản gốc và 7 kịch bản bổ sung cho lịch, môn học, đồng bộ deadline, responsive và tùy chọn giao diện.
- **Minh họa quy trình AI phân tích lỗi & sửa Locator (Self-Healing):** Tích hợp kịch bản tạo lỗi locator có kiểm soát, dùng AI đối chiếu log lỗi với DOM/Accessibility Tree để đề xuất cách sửa và yêu cầu kiểm thử viên xác nhận trước khi áp dụng.
- **100% Công cụ miễn phí, mã nguồn mở:** Không yêu cầu bất kỳ API key trả phí nào.

---

## 2. Công nghệ sử dụng

### Không gian học tập mới

- **Tổng quan cá nhân:** Lời chào, số nhiệm vụ đang chờ, số deadline hôm nay và nút chuyển nhanh đến việc cần chú ý.
- **Lịch học tập:** Đánh dấu ngày có deadline, chuyển tháng/năm, về tháng hiện tại; chọn một ngày để lọc nhiệm vụ trong danh sách hoặc Kanban. Bấm lại ngày đã chọn hoặc **Xóa bộ lọc** để bỏ điều kiện ngày.
- **Môn học:** Danh sách lấy từ dữ liệu API; lọc bằng dropdown hoặc lối tắt ở sidebar. Kết hợp được với tìm kiếm, trạng thái và ưu tiên.
- **Deadline cần nhớ:** Hiển thị tối đa 3 nhiệm vụ chưa hoàn thành có hạn sớm nhất, làm nổi bật việc quá hạn. Bấm để mở chi tiết; số liệu cập nhật sau thao tác CRUD.
- **Sáng/tối và responsive:** Tùy chọn giao diện được lưu trên thiết bị; lịch chuyển xuống dưới nội dung trên tablet/mobile. Kiểm thử ở chiều rộng 360, 390, 768, 1024 và 1440 px.

Frontend tiếp tục dùng HTML/CSS/JavaScript thuần, không thêm thư viện hay bước build. Chạy `npm start` để mở ứng dụng, `npm test` cho 31 E2E và `npm run test:api` cho 15 kiểm thử API. Các tài liệu và artifacts AI testing cũ ghi lại 24 kịch bản ban đầu.

| Thành phần | Công nghệ / Thư viện | Vai trò trong dự án |
| :--- | :--- | :--- |
| **Application Backend** | Node.js, Express.js (`^4.21.2`), CORS | Cung cấp RESTful API (`/api/login`, `/api/tasks`, `/api/reset`, `/api/health`) và phục vụ giao diện tĩnh. |
| **Application Frontend** | HTML5, CSS3, Vanilla JavaScript | Giao diện quản lý nhiệm vụ học tập (Sáng/Tối, Danh sách/Bảng Kanban, `<dialog>` modal, `fetch()` API). |
| **E2E Testing Framework** | `@playwright/test` (`^1.50.0`) | Thực thi 31 kịch bản kiểm thử tự động trên trình duyệt Chromium thật, xuất HTML Report, Screenshot, Video & Trace. |
| **MCP Server chính thức** | `@playwright/mcp` (Microsoft), `@modelcontextprotocol/sdk` | Cung cấp 25 công cụ MCP điều khiển trình duyệt và trích xuất Accessibility Tree cho AI trong Antigravity. |
| **AI Assistant** | Antigravity AI + Custom MCP Scripts | Phân tích DOM/Accessibility Tree, sinh test script, chẩn đoán log lỗi và đề xuất sửa locator. |

---

## 3. Cấu trúc thư mục dự án

```text
student-task-manager-ai-assisted-testing/
├── .agents/                                      # Cấu hình tích hợp MCP cho Antigravity Workspace
│   └── plugins/
│       └── playwright-mcp/
│           ├── plugin.json                       # Metadata plugin Playwright MCP
│           └── mcp_config.json                   # Khai báo server @playwright/mcp
├── artifacts/                                    # Bằng chứng thực tế quá trình AI khám phá & phân tích lỗi
│   ├── mcp-exploration-snapshot.md               # Accessibility Tree thực tế thu thập qua Playwright MCP
│   ├── self-healing-evidence.json                # Kết quả AI phân tích lỗi locator và đề xuất sửa
│   ├── tc08-failure-error-context.md             # Ngữ cảnh lỗi và DOM snapshot khi TC08 bị gãy locator
│   └── tc08-failure-screenshot.png               # Ảnh chụp màn hình trình duyệt khi TC08 thất bại
├── public/                                       # Giao diện Website được nâng cấp
│   ├── css/style.css                             # Stylesheet giao diện
│   ├── css/workspace.css                         # Màu sắc, dashboard, lịch và responsive
│   ├── js/app.js                                 # Logic kết nối REST API của Frontend
│   └── index.html                                # Trang đăng nhập & Không gian học tập
├── scripts/                                      # Các script phục vụ AI Exploration & Demo Self-Healing
│   ├── mcp-explore.js                            # Kết nối @playwright/mcp, tự động đăng nhập & chụp Accessibility Tree
│   └── self-healing-demo.js                      # Tạo lỗi locator có kiểm soát, AI phân tích lỗi & xác nhận sửa
├── src/                                          # Mã nguồn Backend Express (giữ nguyên từ dự án API Testing)
│   ├── data/tasks.data.js                        # Dữ liệu mẫu In-Memory (3 nhiệm vụ, tài khoản student)
│   ├── middleware/auth.middleware.js             # Middleware xác thực Bearer Token
│   ├── routes/auth.routes.js                     # Route POST /api/login
│   ├── routes/task.routes.js                     # Route CRUD /api/tasks
│   ├── app.js                                    # Cấu hình Express app
│   └── server.js                                 # Khởi chạy HTTP server (mặc định Port 3000)
├── test/                                         # Kiểm thử REST API kế thừa
│   └── api.test.js                               # 15 bài kiểm thử tự động REST API
├── tests/                                        # Bộ kiểm thử tự động Playwright E2E do AI hỗ trợ tạo
│   └── e2e/
│       ├── student-task-manager.spec.js          # 24 kịch bản kiểm thử E2E gốc
│       └── workspace-planner.spec.js             # 7 kịch bản kiểm thử giao diện và planner
├── AI_TEST_CASES.md                              # Tài liệu chi tiết 24 E2E test cases & 15 API test cases
├── AI_TESTING_LOG.md                             # Nhật ký tương tác AI, bằng chứng MCP & phân tích lỗi thực tế
├── DEMO_GUIDE.md                                 # Kịch bản trình diễn 6 bước trên lớp & câu hỏi vấn đáp SWT301
├── TEAM_TASKS.md                                 # Bảng phân công nhiệm vụ cho 4 thành viên
├── TEST_REPORT.md                                # Báo cáo kết quả chạy kiểm thử thực tế (100% PASS)
├── playwright.config.js                          # Cấu hình Playwright Test Runner & WebServer tự động
├── package.json                                  # Danh sách scripts và dependencies
└── README.md                                     # Tài liệu hướng dẫn tổng quan
```

---

## 4. Hướng dẫn cài đặt và khởi chạy

### Yêu cầu hệ thống
- **Node.js**: Phiên bản 18+ hoặc 20+ (đã kiểm chứng trên Node.js `v24.21.0`).
- **Trình duyệt**: Chromium (được quản lý tự động bởi Playwright).

### Bước 1: Cài đặt thư viện và trình duyệt Playwright
Mở terminal tại thư mục dự án `G:\Projects\student-task-manager-ai-assisted-testing`:

```powershell
npm install
npx playwright install chromium
```

### Bước 2: Chạy ứng dụng Website (Tùy chọn khi muốn trải nghiệm thủ công)
```powershell
npm start
```
- Truy cập địa chỉ: `http://localhost:3000`
- Tài khoản đăng nhập: `student` / `password123`
*(Lưu ý: Khi chạy lệnh `npm test`, Playwright sẽ tự động khởi chạy server nếu cổng 3000 chưa bật).*

---

## 5. Tổng hợp các lệnh chạy Kiểm thử & Demo (Quick Commands)

| Mục đích | Lệnh chạy | Mô tả kết quả |
| :--- | :--- | :--- |
| **1. Chạy toàn bộ 24 E2E Tests (Headless)** | `npm test` | Chạy 24 bài kiểm thử Playwright trên Chromium, xuất báo cáo HTML & JSON (**24/24 PASS**). |
| **2. Chạy E2E Tests mở trình duyệt trực quan** | `npm run test:headed` | Mở cửa sổ trình duyệt thật để quan sát từng thao tác tự động. |
| **3. Mở giao diện Playwright UI Mode** | `npm run test:ui` | Mở bảng điều khiển tương tác trực quan của Playwright để chạy và xem Time-travel trace. |
| **4. Xem báo cáo HTML Report** | `npm run test:report` | Mở báo cáo `playwright-report/index.html` trên trình duyệt. |
| **5. Chạy 15 bài kiểm thử REST API** | `npm run test:api` | Kiểm chứng toàn bộ 15 kịch bản REST API (**15/15 PASS**). |
| **6. Chạy AI khám phá qua Playwright MCP** | `npm run mcp:explore` | Kết nối `@playwright/mcp`, tự động duyệt web và lưu Accessibility Tree vào `artifacts/mcp-exploration-snapshot.md`. |
| **7. Tạo lỗi Locator có kiểm soát (Demo)** | `npm run demo:break-locator` | Đổi locator nút Tạo nhiệm vụ trong `TC08` thành `#btn-add-task-broken` để minh họa test bị fail. |
| **8. AI phân tích lỗi & đề xuất sửa (Demo)** | `npm run demo:analyze-locator` | Đọc log lỗi + DOM thực tế, giải thích nguyên nhân, đề xuất `#btn-new-task` và hỏi xác nhận `(y/n)`. |
| **9. Áp dụng sửa Locator (Demo)** | `npm run demo:fix-locator` | Khôi phục locator chuẩn `#btn-new-task` trong `TC08`. |
| **10. Kiểm tra trạng thái Locator** | `npm run demo:status` | Kiểm tra `TC08` đang ở trạng thái `HEALTHY` hay `BROKEN`. |

---

## 6. Tài liệu chi tiết phục vụ Bảo vệ môn SWT301

1. **[`AI_TEST_CASES.md`](./AI_TEST_CASES.md)**: Ma trận chi tiết 24 kịch bản kiểm thử E2E và 15 kịch bản API do AI hỗ trợ thiết kế.
2. **[`AI_TESTING_LOG.md`](./AI_TESTING_LOG.md)**: Bằng chứng kết nối Playwright MCP, nhật ký AI phát hiện vấn đề thực tế và phân tích sửa lỗi locator.
3. **[`TEST_REPORT.md`](./TEST_REPORT.md)**: Báo cáo kết quả thực thi kiểm thử thực tế (40/40 kiểm thử đạt 100% PASS).
4. **[`TEAM_TASKS.md`](./TEAM_TASKS.md)**: Phân công công việc chi tiết và cân bằng cho nhóm 4 thành viên.
5. **[`DEMO_GUIDE.md`](./DEMO_GUIDE.md)**: Kịch bản trình diễn 6 bước trực tiếp trước giảng viên kèm bộ câu hỏi – trả lời vấn đáp.

---

## 7. Hướng dẫn đẩy dự án lên GitHub độc lập

Dự án đã được cấu hình sẵn `.gitignore` (loại bỏ `node_modules/`, `playwright-report/`, `test-results/`, nhưng **giữ lại thư mục `artifacts/`** chứa bằng chứng kiểm thử thực tế):

```bash
git init
git add .
git commit -m "feat: complete Student Task Manager AI-Assisted Testing project for SWT301"
git branch -M main
git remote add origin <URL_GITHUB_REPO_CUA_NHOM>
git push -u origin main
```
