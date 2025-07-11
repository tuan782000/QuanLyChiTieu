import { useEffect, useState } from 'react';
import uuid from 'react-native-uuid'; // Dùng để tạo uuid mới cho danh mục
import { getDB } from '../database/db'; // Lấy đối tượng SQLite database
import { Category } from '../models/Category';

// Custom hook để quản lý danh mục (category)

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]); // Danh sách danh mục hiện tại trong state
    const db = getDB(); // Mở kết nối tới SQLite DB

    // Tải danh mục khi "hook" được sử dụng được lần đầu
    useEffect(() => {
        fetchCategories();
    }, []);

    // Đọc tất cả danh mục từ database, sắp xếp theo tên
    const fetchCategories = () => {
        db.getAllAsync<Category>(
            'SELECT * FROM categories ORDER BY name ASC',
            []
        ).then(setCategories); // gắn kết quả cho state
    };

    // Thêm cột danh mục mới
    const addCategory = async (category: Omit<Category, 'id'>) => {
        const id = uuid.v4() as string; // Tạo uuid mới
        await db.runAsync(
            `INSERT INTO categories (id, name, type, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                category.name,
                category.type,
                category.createdAt.toISOString(),
                category.updatedAt.toISOString()
            ]
        );

        fetchCategories(); // cập nhật lại danh sách sau khi thêm
    };

    // Cập nhật danh mục hiện có
    const updateCategory = async (category: Category) => {
        await db.runAsync(
            `
                UPDATE categories SET name = ?, type = ?, updatedAt = ? WHERE id = ?
                `,
            [
                category.name,
                category.type,
                category.updatedAt.toISOString(),
                category.id
            ]
        );
        fetchCategories(); // Cập nhật lại danh sách sau khi sửa
    };

    // xoá danh mục theo ID
    const deleteCategory = async (id: string) => {
        await db.runAsync(`DELETE FROM categories WHERE id = ?`, [id]);
        fetchCategories(); // Cập nhật lại danh sách sau khi xóa
    };

    // Lấy danh mục theo ID (từ danh sách hiện tại, không query DB)
    const getCategoryById = (id: string): Category | undefined => {
        return categories.find(cat => cat.id === id);
    };

    // Trả về toàn bộ API quản lý danh mục
    return {
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById
    };
}
