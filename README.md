# 🏙️ SAIGON ĐI WEB

Dự án web ứng dụng Next.js + TypeScript dành cho nền tảng khám phá thành phố Sài Gòn.  
Cấu trúc được tổ chức rõ ràng theo module và thành phần, dễ mở rộng và bảo trì.

---

<details>
<summary>📁 CẤU TRÚC THƯ MỤC</summary>

```bash
saigon-di-web/
├── .next/                 # Thư mục build tự động của Next.js
├── node_modules/          # Thư viện cài bằng npm
├── public/                # Ảnh, icon, font công khai

├── src/                   # Mã nguồn chính của dự án
│   ├── app/               # Routing theo App Router (Next.js 13+)
│   │   ├── layout.tsx     # Global layout (Header, Footer, Theme...)
│   │   ├── page.tsx       # Trang homepage (/)
│   │   ├── admin/         # Các route và layout riêng cho admin
│   │   ├── auth/          # Đăng nhập, đăng ký,...
│   │   └── user/          # Trang dành cho người dùng
│
│   ├── components/        # Các UI components tái sử dụng
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MapBox.tsx
│   │   └── PostCard.tsx
│
│   ├── hooks/             # Custom React Hooks
│   │   └── useUser.ts     # Lấy thông tin người dùng hiện tại
│
│   ├── lib/               # Thư viện / service dùng chung
│   │   └── axios.ts       # Cấu hình axios toàn cục
│
│   ├── styles/            # Global CSS
│   │   └── globals.css
│
│   └── types/             # Định nghĩa các TypeScript types/interface
│
├── .env.local             # Biến môi trường
├── .gitignore             # File git ignore
├── next.config.ts         # Cấu hình Next.js
├── eslint.config.mjs      # Cấu hình ESLint
├── package.json           # Khai báo dependencies
└── tsconfig.json          # Cấu hình TypeScript
```

</details>

---

## 🧱 QUẢN LÝ LAYOUT

Dự án sử dụng App Router của Next.js (v13+):

- `src/app/layout.tsx`: Layout toàn cục (áp dụng cho tất cả trang)
- Có thể mở rộng layout riêng cho:
  - `src/app/admin/layout.tsx`
  - `src/app/auth/layout.tsx`

👉 Điều này giúp:
- Tách biệt UI từng khu vực (auth/admin/user)
- Dễ dàng wrap middleware hoặc UI layout riêng biệt

---

## ✅ MỤC TIÊU CỦA CẤU TRÚC

- Tách biệt theo module (admin, auth, user) → Dễ mở rộng
- Reusable Components → Giảm lặp code
- Hooks, lib riêng → Dễ test và bảo trì
- TypeScript + types/ → Hạn chế lỗi runtime

---

## 🚀 HƯỚNG PHÁT TRIỂN TIẾP THEO (GỢI Ý)

| Thư mục        | Mục đích                                      |
|----------------|-----------------------------------------------|
| `utils/`       | Hàm tiện ích (formatDate, slugify,...)        |
| `constants/`   | Biến tĩnh như API URL, roles, statuses,...    |
| `context/`     | Global state (AuthContext, ThemeContext...)   |
| `middleware.ts`| Xử lý auth redirect, route guard,...          |

---

## 📌 YÊU CẦU CHẠY DỰ ÁN

```bash
# Cài dependencies
npm install

# Tạo file môi trường
cp .env.example .env.local

# Chạy development
npm run dev
```
