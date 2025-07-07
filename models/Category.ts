export interface Category {
    id: string; // UUID - mã định danh duy nhất cho danh mục (dạng chuỗi)
    name: string; // Tên danh mục (ví dụ: "Ăn uống", "Lương", "Giải trí")
    type: 'income' | 'expense'; // loại danh mục "income" (thu nhập) hoặc expense (chi tiêu)
    createdAt: Date;
    updatedAt: Date;
}
