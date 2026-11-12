# DSNT Team 9

Môi trường phát triển MVP Accer trên browser.

## Chạy trên máy

Cần Node.js 24 và npm. Chạy từ thư mục repo.

```sh
npm ci
npm run dev
```

Mở [localhost:5173](http://localhost:5173). Dùng chế độ giả lập thiết bị của trình duyệt để test ở chiều rộng 375 px.

Ở màn hình rộng (≥ 481 × 641 px), app hiện trong khung điện thoại 375 × 812 có status bar giả như Figma. Trên điện thoại, app chiếm toàn màn hình và ẩn status bar giả.

App chạy liền một hành trình: Flow 1 → màn "Verified Successfully" tự chuyển sang Flow 2 sau 2 giây → tổng kết xác minh → màn chờ `Finalize & Offers` có nút "Restart demo" để chạy lại từ đầu. Nút Back trong app, nút back của trình duyệt và reload đều giữ đúng vị trí.

Mỗi màn có hash riêng để mở thẳng khi test:

- Flow 1: `#products`, `#steps`, `#contact`, `#consent`, `#marketing`, `#status`, `#otp`, `#verified`. Màn OTP nhận mọi mã 6 số.
- Flow 2: `#scan-id`, `#promo`, `#front-scan`, `#front-review`, `#back-scan`, `#back-review`, `#selfie-intro`, `#selfie-scan`, `#selfie-review`, `#documents-verified`, rồi `#finalize`. Các màn quét tự chụp ảnh mẫu sau 1,4 giây và không lưu vào lịch sử, nên Back từ màn xem lại đi về bước trước đó.

## Build để showcase

```sh
npm run build
npm run preview
```

Lệnh build kiểm tra kiểu TypeScript và ghi bản web vào `dist/`. Mở [localhost:4173](http://localhost:4173) để xem bản đã build.

Xem [AGENT.md](./AGENT.md) để biết phạm vi từng nhánh và quy tắc làm việc chung.
