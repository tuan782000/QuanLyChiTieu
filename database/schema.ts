import { getDB } from './db'; // Import hàm mở kết nối CSDL SQLite

// Hàm khởi tạo database (Tạo bảng nếu chưa có)

export const setupDatabase = async () => {
    const db = getDB(); // Lấy đối tượng database

    // Thực hiện tất cả trong một transaction để đảm bảo tính toàn vẹn
    // db.withTransactionAsync(): Đảm bảo rằng tất cả các câu lệnh SQL bên trong được thực thi như một transaction – nếu lỗi, toàn bộ sẽ bị rollback.
    await db.withTransactionAsync(async () => {
        // ====== Tạo bảng categories ======
        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS categories (             -- Bảng lưu danh mục thu / chi
                id TEXT PRIMARY KEY NOT NULL,                   -- ID kiểu string (UUID)
                name TEXT NOT NULL,                             -- Tên danh mục
                type TEXT NOT NULL,                             -- Loại thu / chi (income, expense)
                createdAt TEXT NOT NULL,                        -- Ngày tạo (kiểu ISO string)
                updatedAt Text NOT NULL                         -- Ngày cập nhật (kiểu ISO string)
            )
        `);
    });

    // === Tạo bảng transactions ===
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS transactions (               -- Bảng lưu giao dịch tài chính
            id TEXT PRIMARY KEY NOT NULL,                       -- ID kiểu string (UUID)
            title TEXT NOT NULL,                                -- Tiêu đề giao dịch
            amount REAL NOT NULL,                               -- Số tiền (kiểu số thực)
            date TEXT NOT NULL,                                 -- Ngày giao dịch (ISO string)
            type TEXT NOT NULL,                                 -- "income" hoặc "expense"
            note TEXT,                                          -- Ghi chú (nullable)
            categoryId TEXT NOT NULL,                           -- khoá ngoại -> categories.id
            createdAt TEXT NOT NULL,                            -- Ngày tạo
            updatedAt TEXT NOT NULL                             -- Ngày cập nhật
            FOREIGN KEY (categoryId) REFERENCES categories(id)  -- Ràng buộc với bảng categories
        )    
    `);
};
