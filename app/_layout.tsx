/*
  Cài đặt thư viện:

  npx expo install expo-sqlite
  - Tích hợp SQLite vào ứng dụng Expo - dùng để tháo tác CSDL nội bộ trên thiết bị

  npm install react-native-uuid
  - Tạo UUID (unique ID) cho các bản ghi như transaction, category,.. thay cho ID tự tăng.

  npx expo install @react-navigation/native
  - Thư viện điều hướng chính cho React Native (bắt buộc khi dùng expo-router)

  npx expo install @react-navigation/bottom-tabs
  - Điều hướng dạng tab dưới (Ví dụ: Thu/chi, Danh mục, Báo cáo,...).

  npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
  - Các dependency bắt buộc cho hệ thống react-navigation hoạt động trơn tru với hiệu ứng và gesture.

  npx expo install react-native-paper
  - UI component library theo Materrial Design (button, dialog, v.v)

  npx expo install @react-native-picker/picker
  - Tạo dropdown đơn giản (Picker giống như select box)

  npx expo install react-native-modal-datetime-picker @react-native-community/datetimepicker
  - Tích hợp chọn ngày/giờ dưới dạng Modal đẹp hơn mặc định.

  npm install react-native-dropdown-picker
  - Dropdown nhiều tính năng nâng cao (nhiều lựa chọn, có tìm kiếm, custom style,...)

  npx expo install react-native-chart-kit
  - Dùng để hiển thị biểu đồ như PieChart, BarChart, LineChart.

  npm install react-native-svg-charts react-native-svg --legacy-peer-deps
  - Thư viện biểu đồ nâng cao hơn, dùng SVG để vẽ (hỗ trợ Pie, Area, Stacked,v.v). --legacy-peer-deps để tránh xung đột.

  npx expo start --clear
*/

import { Slot } from 'expo-router'; // Import component Slot để hiển thị các route con (tương dương outlet trong React Router)

// Component RootLayout là layout gốc cho toàn bộ app
export default function RootLayout() {
    return <Slot />; // Slot sẽ render component tương ứng với route con hiện tại
}
