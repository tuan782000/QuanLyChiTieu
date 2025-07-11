import { useEffect, useState } from 'react';
import uuid from 'react-native-uuid'; // Dùng để tạo uuid mới cho danh mục
import { getDB } from '../database/db'; // Lấy đối tượng SQLite database
import { Transaction } from '../models/Transaction'; // Định nghĩa kiểu dữ liệu của Transaction

// Custom hook để quản lý danh mục (Transaction)
export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]); // State chứa danh sách giao dịch
    const db = getDB(); // Mở kết nối tới SQLite DB

    // khi hook được sử dụng tự động lấy các danh sách các transaction
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Lấy danh sách giao dịch từ DB, sắp xếp giảm dần theo ngày
    const fetchTransactions = () => {
        db.getAllAsync<Transaction>(
            'SELECT * FROM transactions ORDER BY title ASC',
            []
        ).then(setTransactions);
    };

    // Thêm giao dịch mới
    const addTransaction = async (txn: Omit<Transaction, 'id'>) => {
        const id = uuid.v4() as string; // Tạo uuid mới
        await db.runAsync(
            `INSERT INTO transactions (id, title, amount, date, type, note, categoryId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                txn.title,
                txn.amount,
                txn.date.toISOString(),
                txn.type,
                txn.note ?? null,
                txn.categoryId,
                txn.createdAt.toISOString(),
                txn.updatedAt.toISOString()
            ]
        );

        fetchTransactions(); // cập nhật lại danh sách sau khi thêm
    };

    // Cập nhật giao dịch đã có
    const updateTransaction = async (txn: Transaction) => {
        await db.runAsync(
            `UPDATE transactions SET title = ?, amount = ?, date = ?, type = ?, note = ?, categoryId = ?, updatedAt = ? WHERE id = ?`,
            [
                txn.title,
                txn.amount,
                txn.date.toISOString(),
                txn.type,
                txn.note ?? null,
                txn.categoryId,
                txn.updatedAt.toISOString(),
                txn.id
            ]
        );
        fetchTransactions(); // cập nhật lại danh sách.
    };

    // Xóa giao dịch theo ID
    const deleteTransaction = async (id: string) => {
        await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
        fetchTransactions(); // Cập nhật lại danh sách sau khi xóa
    };

    // Trả ra API thao tác + danh sách hiện tại
    return {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction
    };
}
