# DSNT Team 9

Môi trường phát triển MVP Accer trên browser.

## Chạy trên máy

Cần Node.js 24 và npm. Chạy từ thư mục repo.

```sh
npm ci
npm run dev
```

Mở [localhost:5173](http://localhost:5173). Dùng chế độ giả lập thiết bị của trình duyệt để test ở chiều rộng 375 px.

## Build để showcase

```sh
npm run build
npm run preview
```

Lệnh build kiểm tra kiểu TypeScript và ghi bản web vào `dist/`. Mở [localhost:4173](http://localhost:4173) để xem bản đã build.

Xem [AGENT.md](./AGENT.md) để biết phạm vi từng nhánh và quy tắc làm việc chung.
