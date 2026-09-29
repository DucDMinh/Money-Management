# Money Manager — Backend

Backend cho ứng dụng **Quản lý chi tiêu**, viết bằng ExpressJS 5, dữ liệu lưu trong file JSON.

## Chạy

```bash
cd function
npm install
npm run dev      # tự restart khi sửa code
# hoặc
npm start
```

Cấu hình nằm trong `.env` (xem mẫu ở `.env.example`). Nhớ giữ bí mật `JWT_SECRET`.
Nếu đổi secret, mọi token cũ sẽ mất hiệu lực.

Dữ liệu được lưu trong `function/data/`:

| File                | Nội dung                                                                   |
| ------------------- | -------------------------------------------------------------------------- |
| `users.json`        | `{ id, username, name, passwordHash, createdAt }`                          |
| `transactions.json` | `{ id, userId, type, amount, category, note, date, createdAt, updatedAt }` |

Server cũng phục vụ file tĩnh trong thư mục `../asset` (frontend) tại `http://localhost:3000/`.

## Cấu trúc

```
src/
  server.js                 khởi động server
  app.js                    cấu hình Express, gắn routes
  config.js                 đọc .env
  db.js                     khai báo các file JSON
  lib/
    jsonStore.js            đọc/ghi file JSON (cache, ghi tuần tự, ghi an toàn)
    date.js                 tính kỳ ngày/tuần/tháng/năm
    validate.js             kiểm tra dữ liệu đầu vào
    httpError.js
  middlewares/
    auth.js                 JWT: requireAuth, signToken
    error.js                xử lý lỗi, 404
  routes/
    auth.routes.js          /api/auth
    transactions.routes.js  /api/transactions
    reports.routes.js       /api/reports
    categories.routes.js    /api/categories
  services/
    report.service.js       logic tổng hợp
```

## API

- Request và response đều là JSON.
- Khi lỗi, API trả về `{ "error": "thông báo", "details": { "field": "lỗi" } }`. `details` chỉ có khi lỗi validate.
- Ngày có dạng `YYYY-MM-DD`. Nếu không truyền, mặc định là hôm nay theo `TIMEZONE`.
- Tuần bắt đầu từ **thứ Hai** và được đánh số theo chuẩn ISO-8601.
- **Mọi API đều yêu cầu đăng nhập**, trừ `register`, `login` và `health`. Client gửi token qua header:

```
Authorization: Bearer <token>
```

### Auth

| Method | URL                  | Body                               | Kết quả                                     |
| ------ | -------------------- | ---------------------------------- | ------------------------------------------- |
| POST   | `/api/auth/register` | `{ username, password, name? }`    | `201 { token, user }` · `409` nếu trùng tên |
| POST   | `/api/auth/login`    | `{ username, password }`           | `{ token, user }` · `401` nếu sai           |
| GET    | `/api/auth/me`       |                                    | `{ user }`                                  |

- `username`: 3–32 ký tự, gồm `a-z 0-9 _ .`. Không phân biệt hoa thường.
- `password`: tối thiểu 6 ký tự.
- Token hết hạn sau `JWT_EXPIRES_IN` (mặc định 7 ngày).
- Để đăng xuất, client chỉ cần xoá token.

### Giao dịch

| Method | URL                     | Mô tả                                                  |
| ------ | ----------------------- | ------------------------------------------------------ |
| GET    | `/api/transactions`     | Danh sách, có lọc và phân trang                        |
| GET    | `/api/transactions/:id` | Chi tiết                                               |
| POST   | `/api/transactions`     | Tạo mới → `201`                                        |
| PUT    | `/api/transactions/:id` | Cập nhật, **chỉ cần gửi những trường muốn đổi**        |
| DELETE | `/api/transactions/:id` | Xoá → `204`                                            |

Body khi tạo hoặc cập nhật:

```json
{ "type": "expense", "amount": 50000, "category": "Ăn uống", "note": "Phở bò", "date": "2026-09-28" }
```

| Trường     | Bắt buộc | Mặc định  | Ghi chú                              |
| ---------- | -------- | --------- | ------------------------------------ |
| `amount`   | ✔        |           | số > 0                               |
| `type`     |          | `expense` | `expense` (chi) hoặc `income` (thu)  |
| `category` |          | `Khác`    | tối đa 50 ký tự                      |
| `note`     |          | `""`      | tối đa 500 ký tự                     |
| `date`     |          | hôm nay   | `YYYY-MM-DD`                         |

Query của `GET /api/transactions`:

| Tham số         | Ý nghĩa                                  |
| --------------- | ---------------------------------------- |
| `from`, `to`    | khoảng ngày, tính cả hai đầu             |
| `type`          | `income` hoặc `expense`                  |
| `category`      | đúng tên danh mục, không phân biệt hoa thường |
| `q`             | tìm trong danh mục và ghi chú            |
| `page`, `limit` | mặc định 1 và 50, `limit` tối đa 200     |

Danh sách được sắp xếp mới nhất trước. `totals` là tổng của **toàn bộ** kết quả lọc, không chỉ trang hiện tại:

```json
{
  "items": [ ... ],
  "pagination": { "page": 1, "limit": 50, "total": 4, "totalPages": 1 },
  "totals": { "income": 20000000, "expense": 280000, "balance": 19720000, "count": 4 }
}
```

### Báo cáo tổng hợp theo ngày / tuần / tháng / năm

`period` nhận một trong các giá trị `day | week | month | year`, mặc định `month`.
`balance` = `income` − `expense`.

#### `GET /api/reports/overview?date=2026-09-27`

Tổng nhanh của hôm đó, tuần đó, tháng đó và năm đó, kèm so sánh với kỳ trước. Dùng cho màn hình dashboard.

- `previous`: tổng của kỳ trước **tính tới cùng thời điểm**. Ví dụ ngày 29/09 thì tháng 01/09→29/09 được so với 01/08→29/08, không so với cả tháng 8. Nếu kỳ trước ngắn hơn thì dừng ở cuối kỳ trước, ví dụ 31/03 so với 01/02→28/02.
- `change`: % thay đổi thu/chi so với `previous`, làm tròn 1 chữ số. Giá trị là `null` khi kỳ trước bằng 0, vì không so sánh được.

```json
{
  "date": "2026-09-29",
  "month": {
    "key": "2026-09", "label": "Tháng 09/2026", "start": "2026-09-01", "end": "2026-09-30",
    "totals": { "income": 1065000, "expense": 4410000, "balance": -3345000, "count": 31 },
    "previous": {
      "key": "2026-08", "label": "Tháng 08/2026", "start": "2026-08-01", "end": "2026-08-29",
      "totals": { "income": 18500000, "expense": 4500000, "balance": 14000000, "count": 2 }
    },
    "change": { "income": -94.2, "expense": -2 }
  },
  "day":  { ... }, "week": { ... }, "year": { ... }
}
```

#### `GET /api/reports/summary?period=week&date=2026-09-24`

Chi tiết **một kỳ** chứa `date`:

- tổng thu, chi, số dư
- tổng theo danh mục, kèm % trên tổng chi hoặc tổng thu
- `breakdown` chia nhỏ kỳ đó để vẽ biểu đồ: tuần và tháng chia theo từng ngày, năm chia theo từng tháng, ngày thì không chia
- `prev` và `next` là ngày để chuyển sang kỳ trước hoặc kỳ sau

```json
{
  "period": "week",
  "key": "2026-W39", "label": "Tuần 39/2026 (21/09 - 27/09)", "start": "2026-09-21", "end": "2026-09-27",
  "prev": "2026-09-14", "next": "2026-09-28",
  "totals": { "income": 0, "expense": 280000, "balance": -280000, "count": 3 },
  "byCategory": {
    "expense": [
      { "category": "Di chuyển", "total": 200000, "count": 1, "percent": 71.43 },
      { "category": "Ăn uống",   "total": 80000,  "count": 2, "percent": 28.57 }
    ],
    "income": []
  },
  "subPeriod": "day",
  "breakdown": [
    { "key": "2026-09-21", "label": "21/09/2026", "start": "2026-09-21", "end": "2026-09-21",
      "income": 0, "expense": 50000, "balance": -50000, "count": 1 },
    ...
  ]
}
```

Muốn xem danh sách giao dịch của kỳ đang chọn, gọi `GET /api/transactions?from=<start>&to=<end>`.

#### `GET /api/reports/series?period=month&from=2026-01-01&to=2026-12-31`

Tổng theo **từng kỳ** trong một khoảng thời gian. Kỳ không có giao dịch vẫn được trả về, với giá trị 0.

- Hai đầu khoảng được mở rộng cho trọn kỳ. Ví dụ `from=2026-01-15` với `period=month` sẽ bắt đầu từ `2026-01-01`.
- Nếu không truyền `from`/`to`: lấy 30 ngày, 12 tuần, 12 tháng hoặc 5 năm gần nhất, tính đến hôm nay.
- Tối đa 1000 kỳ.

```json
{
  "period": "month", "start": "2026-01-01", "end": "2026-12-31",
  "totals": { "income": ..., "expense": ..., "balance": ..., "count": ... },
  "items": [
    { "key": "2026-01", "label": "Tháng 01/2026", "start": "2026-01-01", "end": "2026-01-31",
      "income": 0, "expense": 0, "balance": 0, "count": 0 },
    ...
  ]
}
```

### Danh mục

`GET /api/categories` trả về `{ expense: [...], income: [...] }`. Kết quả gồm danh mục mặc định và các danh mục người dùng đã từng nhập, dùng để gợi ý trong form.
