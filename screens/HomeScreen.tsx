import { useFocusEffect } from '@react-navigation/native'; // gọi lại mỗi khi màn hình được focus
import { useRouter } from 'expo-router'; // điều hướng sang các màn hình khác
import React, { useCallback, useState } from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getDB } from '../database/db'; // Lấy đối tượng SQLite database - Lấy SQLite instance
import { AppUtils } from '../helpers/AppUtils'; // Các hàm tiện ích được định dạng
import { Category } from '../models/Category'; // Kiểu dữ liệu Category
import { Transaction } from '../models/Transaction'; // kiểu dữ liệu transaction
import { useCategories } from '../viewmodels/useCategories'; // Hook lấy ra danh sách các category

const HomeScreen = () => {
    const [groupedTransactions, setGroupedTransactions] = useState<
        { date: Date; data: Transaction[] }[] // Mỗi nhóm gồm 1 ngày và danh sách các transaction tương ứng
    >([]);
    const { categories } = useCategories(); // Lấy danh sách danh mục Categories

    useFocusEffect(
        // gọi lại mỗi khi màn hình được focus
        useCallback(() => {
            fetchGroupedTransactions(); // Tải dữ liệu từ DB
        }, [])
    );

    // Tải toàn bộ transaction từ DB và nhóm theo ngày
    const fetchGroupedTransactions = async () => {
        const db = getDB();
        // const results = await db.getAllAsync('SELECT * FROM transactions ORDER BY date DESC', [])
        const results = await db.getAllAsync<Transaction>(
            'SELECT * FROM transactions ORDER BY date DESC',
            []
        );

        const grouped: Record<string, Transaction[]> = {};

        for (const txn of results) {
            const datekey = new Date(txn.date).toDateString(); // dùng chuỗi này làm key
            if (!grouped[datekey]) {
                grouped[datekey] = [];
            }
            grouped[datekey].push(txn); // Gom theo ngày
        }

        const sorted = Object.entries(grouped)
            .map(([key, value]) => ({
                date: new Date(key),
                data: value.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                )
            }))
            .sort((a, b) => b.date.getTime() - a.date.getTime());
        setGroupedTransactions(sorted); //cập nhật state
    };

    return (
        <SectionList
            sections={groupedTransactions} // Truyền danh sách đã nhóm
            keyExtractor={item => item.id} // Mỗi Transaction có id riêng
            renderItem={({ item }) => (
                <TransactionRow transaction={item} categories={categories} />
            )}
            renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>
                    {AppUtils.formatDate(section.date)}{' '}
                    {/*Hiển thị tiêu đề ngày*/}
                </Text>
            )}
            contentContainerStyle={{ paddingHorizontal: 16 }} // padding 2 bên
        />
    );
};

export default HomeScreen;

function TransactionRow({
    transaction,
    categories
}: {
    transaction: Transaction;
    categories: Category[];
}) {
    const router = useRouter();

    // tìm tên danh mục tương ứng theo categoryId
    const categoryName =
        categories.find(cat => cat.id === transaction.categoryId)?.name ||
        '(Không có danh mục)';

    const handlePress = () => {
        // Điều hướng sang màn hình chi tiết, truyền theo id
        router.push({
            pathname: '/(stack)/transaction-detail',
            params: { id: transaction.id }
        });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.row}>
                <View style={styles.rowTop}>
                    <Text>{transaction.title}</Text>
                    <Text
                        style={{
                            color:
                                transaction.type === 'income' ? 'green' : 'red'
                        }}
                    >
                        {AppUtils.formatCurrency(transaction.amount)}{' '}
                        {/*Hiển thị số tiền màu theo loại*/}
                    </Text>
                </View>
                <View style={styles.rowBottom}>
                    <Text style={styles.category}>{categoryName}</Text>
                    <Text style={styles.type}>
                        {AppUtils.displayType(transaction.type)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
        marginBottom: 6
    },
    row: {
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    rowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4
    },
    category: {
        color: '#888',
        fontSize: 12
    },
    type: {
        color: '#999',
        fontSize: 11
    }
});
