# Quy tắc làm việc cho DSNT Team 9

MVP là ứng dụng web mobile-first dùng React, TypeScript và Vite để test và showcase trên trình duyệt.

## Flow và nhánh

Đối chiếu section tương ứng trong `Demo-DSNT` → `Page 1` từ link Figma nhóm đã chia sẻ. Dùng prototype và yêu cầu được giao để xác định thứ tự màn hình và điều kiện chuyển bước.

| Nhánh | Section Figma | Phạm vi |
| --- | --- | --- |
| `feature/flow1` | Flow 1 (`6:1048`) | Màn mở đầu, chọn sản phẩm, thiết lập hồ sơ, nhập thông tin liên hệ, xác nhận điều khoản và quyền, xác thực OTP. |
| `feature/flow2` | Flow 2 (`6:1049`) | Mã ưu đãi, quét mặt trước và mặt sau giấy tờ, selfie và trạng thái xác minh. |

`Finalize & Offers` xuất hiện trong chỉ báo tiến độ. Cập nhật bảng khi thiết kế có section mới.

## Làm việc cùng team

- Kiểm tra `git status` trước khi sửa và giữ các thay đổi đang có của đồng đội. Tạo nhánh mới theo mẫu `feature/flowN` từ `main` hiện hành. Dùng nhánh đã có khi tiếp tục một flow.
- Giữ mỗi PR trong phạm vi một flow. Ghi rõ frame đã triển khai, các trạng thái đã kiểm tra và cách chạy lại trên browser. Kiểm tra các flow liên quan khi sửa thành phần dùng chung.
- Dùng nội dung, trạng thái và bố cục trong frame Figma tương ứng. Thiết kế lấy chiều rộng 375 px làm mốc và cần co giãn trên màn hình rộng hoặc hẹp hơn. Dùng phần tử HTML có ngữ nghĩa và hỗ trợ thao tác bằng bàn phím.
- Dùng dữ liệu giả cho số điện thoại, email, OTP, giấy tờ và selfie trong bản demo. Giữ bí mật và dữ liệu nhận dạng thật ngoài mã nguồn, dữ liệu mẫu và log.
- Chạy `npm ci` để cài dependencies từ lockfile, `npm run dev` để test và `npm run build` để kiểm tra kiểu dữ liệu và tạo bản showcase. Mở flow đã sửa ở viewport 375 px và desktop.
- Cập nhật hướng dẫn chung tại file này để các công cụ AI và thành viên trong nhóm dùng cùng một bộ quy tắc.
