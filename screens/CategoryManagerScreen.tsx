import { Category } from '@/models/Category';
import { useCategories } from '@/viewmodels/useCategories';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SegmentedButtons } from 'react-native-paper'; // Bộ nút chuyển "thi nhập" / "chi tiêu"

const CategoryManagerScreen = () => {
    // Lấy các hàm từ viewModel quản lý danh mục
    const { categories, addCategory, updateCategory, deleteCategory } =
        useCategories();

    // State cho form và loại đang chọn
    const [selectedType, setSelectedType] = useState<'income' | 'expense'>(
        'expense'
    );
    const [name, setName] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );

    const [openType, setOpenType] = useState(false); // Không dùng nữa vì đã dùng SegmentButtons

    // Lọc danh mục theo loại được chọn (thu nhập/ chi tiêu)
    const filteredCategories = categories.filter(
        cat => cat.type === selectedType
    );

    // xử lý khi nhấn lưu
    const handleSave = () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        const newData = {
            name: trimmed,
            type: selectedType,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (editingCategory) {
            // Nếu đang chỉnh sửa: Cập nhật danh mục
            updateCategory({ ...editingCategory, ...newData });
        } else {
            // Nếu đang thêm: gọi addCategory
            addCategory(newData);
        }

        resetForm(); // Reset form sau khi lưu
    };

    // Đặt lại form về trạng thái ban đầu
    const resetForm = () => {
        setName('');
        setEditingCategory(null);
    };

    // Xác nhận xoá danh mục bằng Alert
    const confirmDelete = (cat: Category) => {
        Alert.alert('Xoá danh mục', `Bạn có chắc muốn xoá "${cat.name}"?`, [
            { text: 'Huỷ', style: 'cancel' },
            {
                text: 'Xoá',
                style: 'destructive',
                onPress: () => deleteCategory(cat.id)
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh mục</Text>

            {/* Bộ nút chuyển giữa "Chi tiêu" và "Thu nhập" */}
            <SegmentedButtons
                value={selectedType}
                onValueChange={(value: string) =>
                    setSelectedType(value as 'income' | 'expense')
                }
                buttons={[
                    { value: 'expense', label: 'Chi tiêu' },
                    { value: 'income', label: 'Thu nhập' }
                ]}
                style={{ marginBottom: 12 }}
            />

            {/* Ô nhập tên danh mục */}
            <TextInput
                style={styles.input}
                placeholder='Tên danh mục'
                value={name}
                onChangeText={setName}
            />

            {/* Nút thêm mới hoặc cập nhật */}
            <Button
                title={editingCategory ? 'Cập nhật' : 'Thêm mới'}
                onPress={handleSave}
                disabled={name.trim() === ''}
            />

            <Text style={styles.subheader}>Danh sách danh mục</Text>

            {/* Danh sách danh mục đã lọc */}
            <FlatList
                data={filteredCategories}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.actions}>
                            {/* Nút sửa - đổi dữ liệu vào form */}
                            <Button
                                title='Sửa'
                                onPress={() => {
                                    setName(item.name);
                                    setSelectedType(
                                        item.type as 'income' | 'expense'
                                    );
                                    setEditingCategory(item);
                                }}
                            />
                            {/* Nút xoá danh mục */}
                            <Button
                                title='Xoá'
                                color='red'
                                onPress={() => confirmDelete(item)}
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ marginTop: 12 }}>
                        Không có danh mục nào.
                    </Text>
                }
            />
        </View>
    );
};

export default CategoryManagerScreen;

// Styles
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12
    },
    subheader: {
        marginTop: 24,
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold'
    },
    dropdown: {
        marginBottom: 12,
        borderColor: '#ccc'
    },
    dropdownContainer: {
        borderColor: '#ccc',
        zIndex: 1000
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc'
    },
    name: {
        fontSize: 16
    },
    actions: {
        flexDirection: 'row',
        gap: 8 //khoảng cách giữa các mặt
    }
});
