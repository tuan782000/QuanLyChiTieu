import { getDB } from '@/database/db'; // Hàm lấy đối tượng SQLite DB
import { Transaction } from '@/models/Transaction'; // Model giao dịch
import TransactionDetailScreen from '@/screens/TransactionDetailScreen'; // Màn hình chi tiết giao dịch
import { useTransactions } from '@/viewmodels/useTransactions'; // ViewModel xử lý giao dịch
import { useLocalSearchParams, useRouter } from 'expo-router'; // Lấy tham số từ URL và sử dụng điều hướng
import React, { useEffect, useState } from 'react'; // Hook React
import { StyleSheet } from 'react-native';

const TransactionDetailRoute = () => {
    const { id } = useLocalSearchParams<{ id: string }>(); // Lấy id từ URL (dạng [id].tsx)
    const router = useRouter(); //Hook để điều hướng

    const { updateTransaction, deleteTransaction } = useTransactions(); // Lấy hàm xử lý từ ViewModel
    const [txn, setTxn] = useState<Transaction | null>(null); // State lưu giao dịch đang xem

    useEffect(() => {
        if (!id) return; // Nếu chưa có id thì không làm gì

        const load = async () => {
            const db = getDB(); // lấy instance SQLite DB
            const result = await db.getFirstAsync<Transaction>(
                `SELECT * FROM transactions WHERE id = ?`, // Câu truy vấn lấy 1 giao dịch theo id
                [id]
            );

            if (result) {
                setTxn({
                    ...result,
                    date: new Date(result.date), // Chuyển date từ string sang Date object
                    createdAt: new Date(result.createdAt),
                    updatedAt: new Date(result.updatedAt)
                });
            }
        };

        load(); // Gọi hàm load khi `id` thay đổi
    }, [id]);

    if (!txn) return null; // Nếu chưa có dũe liệu thì không render gì cả

    return (
        <TransactionDetailScreen
            transaction={txn} // Truyền transaction vào màn hình chi tiết
            onUpdate={() => router.back()} // khi cập nhật xong --> quay lại màn hình trước
        />
    );
};

export default TransactionDetailRoute;

const styles = StyleSheet.create({});
