# Deploy Checklist — thenewrich.io.vn

## 1. Framework / Stack
- [x] Static HTML + Vercel Serverless Functions (Node.js)
- [x] Dependencies: @vercel/blob, resend
- [x] Đã deploy live tại: https://thenewrich.io.vn

## 2. Environment Variables (trên Vercel)
- [x] BLOB_READ_WRITE_TOKEN — lưu trữ dữ liệu JSON
- [x] RESEND_API_KEY — gửi email tự động

## 3. Secrets lộ trong code — CẦN FIX
- [x] `resend_config.txt` → đã thêm vào .gitignore ✓
- [x] `.env.local` đã được gitignore ✓

## 4. Files thừa cần dọn
- [x] `api/test-email.js` → đã xóa ✓
- [x] `brain.db` → đã xóa ✓
- [x] `.DS_Store` → đã thêm vào .gitignore ✓

## 5. .gitignore cần bổ sung
- [x] `node_modules/` ✓
- [x] `resend_config.txt` ✓
- [x] `brain.db` ✓
- [x] `.DS_Store` ✓

## 6. Cấu trúc API hoàn chỉnh
- [x] /api/orders — tạo, xem, cập nhật, xóa đơn hàng
- [x] /api/products — quản lý sản phẩm
- [x] /api/customers — quản lý khách hàng
- [x] /api/webhook — nhận webhook từ Sepay
- [x] /api/_db.js — Vercel Blob storage
- [x] /api/_email.js — Resend email service

## 7. Pages
- [x] / — Landing page
- [x] /checkout — Trang thanh toán + VietQR
- [x] /admin — Admin panel (3 tabs)
