import { AppUtils } from '@/helpers/AppUtils';
import { Transaction } from '@/models/Transaction';
import { useCategories } from '@/viewmodels/useCategories';
import DateTimePicker from '@react-native-community/datetimepicker'; // Chọn ngày
import { useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Dropdown chọn loại danh mục
import { useTransactions } from '../viewmodels/useTransactions';

type Props = {
    transaction: Transaction;
    onUpdate: () => void;
};

export default function TransactionDetailScreen({
    transaction,
    onUpdate
}: Props) {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button title='Trở lại' onPress={() => navigation.goBack()} />
            ),
            headerTitle: 'Chi tiết thu / chi'
        });
    }, [navigation]);

    const router = useRouter(); // dùng để điều hướng về sau khi thao tác
    const [title, setTitle] = useState(transaction.title);
    const [rawAmount, setRawAmount] = useState(transaction.amount.toString());
    const [formattedAmount, setFormattedAmount] = useState(
        AppUtils.formatCurrencyInput(transaction.amount.toString())
    );

    const [date, setDate] = useState(new Date(transaction.date));
    const [note, setNote] = useState(transaction.note || '');
    const [type, setType] = useState<'income' | 'expense'>(transaction.type);
    const [selectedCategory, setSelectedCategory] = useState(
        transaction.categoryId
    );

    const [showDatePicker, setShowDatePicker] = useState(false);

    const { categories } = useCategories();
    const { updateTransaction, deleteTransaction } = useTransactions();

    const [openType, setOpenType] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);

    // Xử lý khi thay đổi số tiền

    const handlerAmountChange = (text: string) => {
        const digits = text.replace(/\D/g, '');
        setRawAmount(digits);
        setFormattedAmount(AppUtils.formatCurrencyInput(digits));
    };

    // xử lý khi chọn ngày mới
    const handleDateChange = (_: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    // Xử lý cập nhật giao dịch
    const handleUpdate = async () => {
        const updated: Transaction = {
            ...transaction,
            title,
            amount: AppUtils.currencyToDouble(rawAmount),
            date,
            type,
            note,
            categoryId: selectedCategory,
            updatedAt: new Date()
        };

        await updateTransaction(updated);
        onUpdate(); // gọi lại để reload
        router.navigate('/'); // quay lại màn hình chính
    };

    // Xác nhận và xoá giao dịch
    const handleDelete = () => {
        Alert.alert('Xoá giao dịch', 'Bạn có chắc chắn muốn xoá?', [
            { text: 'Huỷ', style: 'cancel' },
            {
                text: 'Xoá',
                style: 'destructive',
                onPress: async () => {
                    await deleteTransaction(transaction.id);
                    onUpdate();
                    router.replace('/');
                }
            }
        ]);
    };

    // Danh sách danh mục phù hợp với loại đã chọn
    const categoryItems = categories
        .filter(cat => cat.type === type)
        .map(cat => ({ label: cat.name, value: cat.id }));

    const canSave = title && Number(rawAmount) > 0 && selectedCategory;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chi tiết thu/ chi</Text>
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
                    value={formattedAmount}
                    onChangeText={handlerAmountChange}
                    keyboardType='numeric'
                    style={styles.amountInput}
                />

                <Text style={styles.currency}>vnđ</Text>
            </View>

            {/* Chọn ngày */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>
                    Ngày: {AppUtils.formatDate(date)}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode='date'
                    display='default'
                    onChange={handleDateChange}
                />
            )}

            {/* Dropdown chọn loại giao dịch */}
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

            {/* Dropdown chọn danh mục */}
            <DropDownPicker
                open={openCategory}
                setOpen={setOpenCategory}
                value={selectedCategory}
                setValue={setSelectedCategory}
                items={categoryItems}
                placeholder='Chọn danh mục'
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />

            <TextInput
                placeholder='Ghi chú'
                value={note}
                onChangeText={setNote}
                style={styles.input}
            />

            {/* Nút lưu cập nhật */}
            <Button
                title='Cập nhật'
                onPress={handleUpdate}
                disabled={!canSave}
            />
            {/* Nút xoá */}
            <View style={{ marginTop: 12 }}>
                <Button title='Xoá' color='red' onPress={handleDelete} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
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
    dateText: {
        marginBottom: 12,
        color: '#444'
    },
    dropdown: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        marginBottom: 12
    },
    dropdownContainer: {
        borderColor: '#ccc',
        zIndex: 1000
    }
});
