export interface Transaction {
    id: string; // UUID - mã định danh duy nhất cho giao dịch
    title: string; // Tiêu đề giao dịch (ví dụ: "Mua cà phê", "Lương tháng 7")
    amount: number; // số tiền của giao dịch
    date: Date; // Ngày giao dịch
    type: 'income' | 'expense'; // Loại giao dịch: "income" (thu nhập) hoặc "expense" (chi tiêu)
    note?: string; // Ghi chú tuỳ chọn (có thể không có)
    categoryId: string; // khoá ngoại liên kết với danh mục category
    createdAt: Date; // Ngày tạo giao dịch
    updatedAt: Date; // Ngày cập nhật gần nhất
}
