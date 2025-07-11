import { AppUtils } from '@/helpers/AppUtils';
import { useCategories } from '@/viewmodels/useCategories';
import { useTransactions } from '@/viewmodels/useTransactions';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart, StackedBarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width; // Lấy chiều rộng của màn hình để responsive biểu đồ
const ReportScreen = () => {
    const { transactions } = useTransactions(); // Lấy danh sách giao dịch
    const { categories } = useCategories(); // Lấy danh sách danh mục

    const [income, setIncome] = useState(0); // Tổng thu nhập
    const [expense, setExpense] = useState(0); // Tổng chi tiêu

    useEffect(() => {
        // Tính tổng thu và tổng chi từ dữ liệu giao dịch
        const totalIncome = transactions
            .filter(txn => txn.type === 'income')
            .reduce((sum, txn) => sum + txn.amount, 0);

        const totalExpense = transactions
            .filter(txn => txn.type === 'expense')
            .reduce((sum, txn) => sum + txn.amount, 0);

        setIncome(totalIncome); // cập nhật state thu nhập
        setExpense(totalExpense); // cập nhật state chi tiêu
    }, [transactions]);

    const balance = income - expense; // Tính toán chênh lệch

    const fixedColors = [
        // Màu cố định cho biểu đồ tròn
        '#f44336',
        '#2196f3',
        '#4caf50',
        '#ff9800',
        '#9c27b0',
        '#00bcd4',
        '#8bc34a',
        '#e91eef',
        '#795548',
        '#607d8b'
    ];

    // Tính dữ liệu PieChart từ giao dịch chi tiêu
    const pieData = Object.values(
        transactions
            .filter(txn => txn.type === 'expense')
            .reduce((acc, txn) => {
                const cat = categories.find(c => c.id === txn.categoryId); // Tìm danh mục
                const catName = cat?.name || 'Không rõ'; // Nếu không tìm thấy tên

                if (!acc[catName]) {
                    const index = categories.findIndex(c => c.name === catName);
                    acc[catName] = {
                        name: catName,
                        amount: 0,
                        color: fixedColors[index % fixedColors.length], // chọn màu
                        legendFontColor: '#333',
                        legendFontSize: 12
                    };
                }

                acc[catName].amount += txn.amount; // Cộng dồn tiền
                return acc;
            }, {} as Record<string, any>) // bắt đầu với đối tượng rỗng
    ).map(item => ({
        name: item.name,
        population: item.amount, // Trường được biểu đồ sử dụng
        color: item.color,
        legendFontColor: item.legendFontColor,
        legendFontSize: item.legendFontSize
    }));

    const barData = getBarChartData(transactions); // dữ liệu biểu đồ cột

    const {
        labels: barLabels,
        incomeData: barIncomeData,
        expenseData: barExpenseData
    } = getBarChartData(transactions); // tách dữ liệu

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Tổng kết thu / chi</Text>

            {/* Hiển thị box thu nhập + chi tiêu */}
            <View style={styles.row}>
                <ReportBox title='Thu nhập' amount={income} color='green' />
                <ReportBox title='Chi tiêu' amount={expense} color='red' />
            </View>

            {/* Box chênh lệch nằm giữa */}
            <ReportBox title='Chênh lệch' amount={balance} color='blue' />

            {/* Biểu đồ tròn chi tiêu theo danh mục */}
            <Text style={styles.chartTitle}>Tỉ lệ chi tiêu theo danh mục</Text>
            <View style={{ alignItems: 'center' }}>
                <PieChart
                    data={pieData} // dữ liệu danh mục chi
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    accessor='population'
                    backgroundColor='transparent'
                    paddingLeft='0'
                />
            </View>

            {/* Ghi chú màu cho PieChart */}
            <View style={styles.pieLegendContainer}>
                {pieData.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColorBox,
                                { backgroundColor: item.color }
                            ]}
                        />
                        <Text style={styles.legendText}>
                            {AppUtils.formatCurrency(item.population)}{' '}
                            {item.name}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Biểu đồ cột theo ngày */}
            <Text style={styles.chartTitle}>Thu / Chi theo ngày</Text>
            {barData && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <StackedBarChart
                        data={{
                            labels: barLabels, // các ngày
                            legend: ['Thu nhập', 'Chi tiêu'],
                            data: barLabels.map((_, i) => [
                                barIncomeData[i] || 0,
                                barExpenseData[i] || 0
                            ]),
                            barColors: ['green', 'red']
                        }}
                        width={barLabels.length * 60} // mỗi cột ~ 60px
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            color: () => '#888',
                            labelColor: () => '#333',
                            decimalPlaces: 0,
                            formatYLabel: value =>
                                AppUtils.formatCurrency(Number(value)) // hiển thị số có phân tách
                        }}
                        hideLegend={true}
                        yAxisSuffix=''
                        yLabelsOffset={-20}
                        fromZero
                        style={{ paddingRight: 20 }}
                    />
                </ScrollView>
            )}

            {/* Ghi chú màu cho biểu đồ cột */}
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 8,
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 16
                    }}
                >
                    <View
                        style={{
                            width: 12,
                            height: 12,
                            backgroundColor: 'green',
                            marginRight: 6
                        }}
                    ></View>
                    <Text style={{ fontSize: 12 }}>Thu nhập</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 16
                    }}
                >
                    <View
                        style={{
                            width: 12,
                            height: 12,
                            backgroundColor: 'red',
                            marginRight: 6
                        }}
                    ></View>
                    <Text style={{ fontSize: 12 }}>Chi tiêu</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ReportScreen;

// Component ReportBox hiển thị mỗi ô báo cáo nhỏ (Thu nhập, chi tiêu, Chênh lệch)
// function ReportBox({ title, amount, color }): {
//     title: string;
//     amount: number;
//     color: string;
// } {
//     return (
//         <View style={[styles.box, { borderColor: color }]}>
//             <Text style={styles.boxTitle}>{title}</Text>
//             <Text style={[styles.boxAmount, { color }]}>
//                 {AppUtils.formatCurrency(amount)}
//                 {/* Định dạng tiền vnd */}
//             </Text>
//         </View>
//     );
// }
type ReportBoxProps = {
    title: string;
    amount: number;
    color: string;
};

function ReportBox({ title, amount, color }: ReportBoxProps) {
    return (
        <View style={[styles.box, { borderColor: color }]}>
            <Text style={styles.boxTitle}>{title}</Text>
            <Text style={[styles.boxAmount, { color }]}>
                {AppUtils.formatCurrency(amount)}
            </Text>
        </View>
    );
}

// Hàm xử lý dữ liệu cho biểu đồ cột (bar chart)
function getBarChartData(transactions: any[]) {
    const summary: Record<string, { income: number; expense: number }> = {};

    // Nhóm và cộng dồn giao dịch theo từng ngày (định dạng dd/mm)
    transactions.forEach(txn => {
        const date = AppUtils.formatDayMonth(new Date(txn.date));
        if (!summary[date]) summary[date] = { income: 0, expense: 0 };
        if (txn.type === 'income') summary[date].income += txn.amount;
        else summary[date].expense += txn.amount;
    });

    const labels = Object.keys(summary); // danh sách ngày
    const incomeData = labels.map(label => summary[label].income); // Tổng thu nhập theo ngày
    const expenseData = labels.map(label => summary[label].expense); // Tổng chi tiêu theo ngày

    return { labels, incomeData, expenseData }; // Trả về cho cho StackedBarChart
}

// Cấu hình biểu đồ (PieChart và StackedBarChart)
const chartConfig = {
    backgroundGradientFrom: '#ffffff', // Nền bắt đầu
    backgroundGradientTo: '#ffffff', // Nền kết thúc
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`, // Màu nội dung biểu đồ
    labelColor: () => '#333', // Màu nhãn
    decimalPlaces: 0 // không hiển thị phần thập phân
};

// Các style dùng trong ReportScreen
const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: 'white'
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16
    },
    row: {
        flexDirection: 'row', // Đặt 2 box (Thu/chi) nằm ngang
        justifyContent: 'space-between'
    },
    box: {
        flex: 1,
        padding: 12,
        margin: 4,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center'
    },
    boxTitle: {
        fontSize: 14,
        fontWeight: '500'
    },
    boxAmount: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    pieLegendContainer: {
        flexDirection: 'row', // Hiên thị theo hàng ngang
        flexWrap: 'wrap', // nếu dài sẽ xuống dòng
        justifyContent: 'center', // căn giữa cả hàng
        marginTop: 12,
        marginBottom: 20
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginBottom: 6
    },
    legendColorBox: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 8
    },
    legendText: {
        fontSize: 12,
        color: '#333'
    },
    chartTitle: {}
});
