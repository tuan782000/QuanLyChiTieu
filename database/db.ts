import * as SQLite from 'expo-sqlite'; // Import thư viện SQLite từ Expo để làm việc với CSDL cục bộ

// Hàm trả về instance SQLite được mở (đồng bộ) với tên file "quanlychitieu.db"

export const getDB = () => {
    return SQLite.openDatabaseSync('quanlychitieu.db');
};
