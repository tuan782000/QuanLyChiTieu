import { AppUtils } from '@/helpers/AppUtils';
import DateTimePicker from '@react-native-community/datetimepicker'; // Chọn ngày
import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Dropdown chọn loại danh mục
import { useCategories } from '../viewmodels/useCategories';
import { useTransactions } from '../viewmodels/useTransactions';

const TransactionAddScreen = () => {
    const [title, setTitle] = useState(''); // Tiêu đề giao dịch
    const [rawAmount, setRawAmount] = useState(''); // Số tiền đầu vào
    const [date, setDate] = useState(new Date()); // Ngày giao dịch
    const [showDatePicker, setShowDatePicker] = useState(false); // hiển thị DatePicker

    const [openType, setOpenType] = useState(false); // Mở dropdown loại
    const [type, setType] = useState<'income' | 'expense'>('expense'); // giá trị loại

    const [openCategory, setOpenCategory] = useState(false); // Mở dropdown doanh mục
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    ); // danh mục được chọn
    const [note, setNote] = useState(''); // Ghi chú

    // Lấy dữ liệu từ các hook
    const { categories } = useCategories();
    const { addTransaction } = useTransactions();

    // Memo danh sách danh mục tương ứng loại
    const categoryItems = useMemo(() => {
        return categories
            .filter(cat => cat.type === type)
            .map(cat => ({ label: cat.name, value: cat.id }));
    }, [categories, type]);

    // Reset selectedCategory nếu không hợp lệ
    useEffect(() => {
        const stillValid = categoryItems.some(
            i => i.value === selectedCategory
        );
        if (!stillValid) {
            setSelectedCategory(null);
        }
    }, [categoryItems]);

    // Xử lý khi người dùng nhập số tiền
    const handleAmountChange = (text: string) => {
        const digits = text.replace(/\D/g, ''); // chỉ giữ lại chữ số
        setRawAmount(digits);
    };

    // xử lý lưu giao dịch
    const handleSave = async () => {
        if (!title || !rawAmount || !selectedCategory) return; // kiểm tra hợp lệ

        await addTransaction({
            title,
            amount: parseFloat(rawAmount),
            date,
            type,
            note,
            categoryId: selectedCategory,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        resetForm(); // Reset form ngay khi lưu
    };

    // Reset form về trạng thái ban đầu
    const resetForm = () => {
        setTitle('');
        setRawAmount('');
        setDate(new Date());
        setType('expense');
        setSelectedCategory(null);
        setNote('');
    };

    // Đóng Dropdown và bàn phím khi chạm ra ngoài
    const handleDismissDropdowns = () => {
        setOpenType(false);
        setOpenCategory(false);
        Keyboard.dismiss();
    };

    return (
        <Pressable style={{ flex: 1 }} onPress={handleDismissDropdowns}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <Text style={styles.header}>Thông tin thu / chi</Text>

                {/* Nhập tiêu đề giao dịch */}
                <TextInput
                    placeholder='Tiêu đề'
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                {/* Nhập số tiền */}
                <View style={styles.amountContainer}>
                    <TextInput
                        placeholder='Số tiền'
                        value={AppUtils.formatCurrencyInput(rawAmount)} // hiển thị có định dạng
                        onChangeText={handleAmountChange}
                        style={styles.amountInput}
                        keyboardType='numeric'
                    />
                    <Text style={styles.currency}>vnđ</Text>
                </View>

                {/* Chọn ngày giao dịch */}
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateButton}
                >
                    <Text>Ngày: {AppUtils.formatDate(date)}</Text>
                </TouchableOpacity>

                {/* Hiển thị DatePicker nếu cần */}
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode='date'
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={(_, selected) => {
                            if (selected) setDate(selected);
                            setShowDatePicker(false);
                        }}
                    />
                )}

                {/* Dropdown chọn loại thu / chi */}
                <View>
                    <DropDownPicker
                        open={openType}
                        setOpen={setOpenType}
                        value={type}
                        setValue={setType}
                        items={[
                            { label: 'Chi tiêu', value: 'expense' },
                            { label: 'Thu nhập', value: 'income' }
                        ]}
                        placeholder='Chọn loại'
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                </View>

                {/* Dropdown chọn danh mục theo loại đã chọn */}
                <View style={{ zIndex: 2 }}>
                    <DropDownPicker
                        key={type + categoryItems.length} // ép render lại khi danh sách thay đổi
                        open={openCategory}
                        setOpen={setOpenCategory}
                        value={selectedCategory}
                        setValue={setSelectedCategory}
                        items={categoryItems}
                        placeholder='Chọn danh mục'
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                </View>

                {/* Nhập ghi chú */}
                <TextInput
                    placeholder='Ghi chú'
                    value={note}
                    onChangeText={setNote}
                    style={styles.input}
                />

                {/* Nút lưu giao dịch */}
                <Button
                    title='Lưu thu / chi'
                    onPress={handleSave}
                    disabled={!title || !rawAmount || !selectedCategory} // vô hiệu hoá nếu chưa đủ dữ liệu
                />
            </KeyboardAvoidingView>
        </Pressable>
    );
};

export default TransactionAddScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12
    },
    amountInput: {
        flex: 1,
        fontSize: 16
    },
    currency: {
        marginLeft: 8,
        fontSize: 16,
        color: '#888'
    },
    dateButton: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12
    },
    dropdown: {
        borderRadius: 10,
        borderColor: '#ccc',
        marginBottom: 12
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        zIndex: 1000 // đảm đảo dropdown hiển thị đúng lớp
    }
});
