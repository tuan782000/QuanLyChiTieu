import { Stack } from 'expo-router';
// Component layout cho nhóm `(stack)` - chứa các màn hình điều hướng dạng stack (chi tiết, chỉnh sửa, v.v.)
export default function StackLayout() {
    return (
        <Stack /> // Tự động hiển thị header và điều hướng dạng stack cho các file trong thư mục `(stack)/`
    );
}
