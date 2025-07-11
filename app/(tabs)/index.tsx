// import { getDB } from '@/database/db';
// import { setupDatabase } from '@/database/schema';
// import React, { useEffect } from 'react';
// import { Text, View } from 'react-native';
// import uuid from 'react-native-uuid'; // Dùng để tạo uuid mới cho danh mục

// const Index = () => {
//     useEffect(() => {
//         const setup = async () => {
//             try {
//                 await setupDatabase(); // Tạo bảng nếu chưa có
//                 await seedMockDataFromArray(); // sau đó thêm dữ liệu mẫu
//             } catch (error) {
//                 console.error('Lỗi setup databse', error);
//             }
//         };

//         setup(); // Gọi hàm setup khi màn hình được mount
//     }, []);

//     return (
//         <View
//             style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
//         >
//             <Text>Đang thêm dữ liệu mẫu</Text>
//         </View>
//     );
// };

// export default Index;

// type MockTransactionData = {
//     title: string;
//     amount: number;
//     type: 'income' | 'expense';
//     note: string;
//     daysAgo: number;
//     categoryName: string;
// };

// // Danh sách giao dịch mẫu
// export const mockTransactions: MockTransactionData[] = [
//     {
//         title: 'Mua cà phê',
//         amount: 30000,
//         type: 'expense',
//         note: 'Cà phê Highlands',
//         daysAgo: 1,
//         categoryName: 'Ăn uống'
//     },
//     {
//         title: 'Lương tháng 7',
//         amount: 15000000,
//         type: 'income',
//         note: 'Lương công ty',
//         daysAgo: 3,
//         categoryName: 'Lương'
//     },
//     {
//         title: 'Đi chợ',
//         amount: 150000,
//         type: 'expense',
//         note: 'Mua rau, thịt',
//         daysAgo: 2,
//         categoryName: 'Sinh hoạt'
//     },
//     {
//         title: 'Xăng xe',
//         amount: 50000,
//         type: 'expense',
//         note: 'Đổ xăng A95',
//         daysAgo: 1,
//         categoryName: 'Di chuyển'
//     },
//     {
//         title: 'Thu nhập phụ',
//         amount: 1200000,
//         type: 'income',
//         note: 'Freelance viết bài',
//         daysAgo: 4,
//         categoryName: 'Thu nhập khác'
//     },
//     {
//         title: 'Mua sách',
//         amount: 200000,
//         type: 'expense',
//         note: 'Sách tiếng Anh',
//         daysAgo: 5,
//         categoryName: 'Giáo dục'
//     },
//     {
//         title: 'Tiền thưởng',
//         amount: 3000000,
//         type: 'income',
//         note: 'Thưởng tháng',
//         daysAgo: 6,
//         categoryName: 'Lương'
//     },
//     {
//         title: 'Đi ăn với bạn',
//         amount: 250000,
//         type: 'expense',
//         note: 'Lẩu Gogi',
//         daysAgo: 3,
//         categoryName: 'Ăn uống'
//     },
//     {
//         title: 'Mua quà sinh nhật',
//         amount: 400000,
//         type: 'expense',
//         note: 'Tặng bạn thân',
//         daysAgo: 7,
//         categoryName: 'Giải trí'
//     },
//     {
//         title: 'Đóng học phí',
//         amount: 5000000,
//         type: 'expense',
//         note: 'Học React Native',
//         daysAgo: 10,
//         categoryName: 'Giáo dục'
//     },
//     {
//         title: 'Tiền lì xì',
//         amount: 1000000,
//         type: 'income',
//         note: 'Tết 2025',
//         daysAgo: 15,
//         categoryName: 'Thu nhập khác'
//     },
//     {
//         title: 'Thanh toán điện',
//         amount: 800000,
//         type: 'expense',
//         note: 'Hóa đơn tháng 6',
//         daysAgo: 5,
//         categoryName: 'Hóa đơn'
//     },
//     {
//         title: 'Thanh toán internet',
//         amount: 300000,
//         type: 'expense',
//         note: 'FPT Telecom',
//         daysAgo: 6,
//         categoryName: 'Hóa đơn'
//     },
//     {
//         title: 'Đi xem phim',
//         amount: 180000,
//         type: 'expense',
//         note: 'CGV',
//         daysAgo: 4,
//         categoryName: 'Giải trí'
//     },
//     {
//         title: 'Mua áo thun',
//         amount: 350000,
//         type: 'expense',
//         note: 'Shopee',
//         daysAgo: 8,
//         categoryName: 'Mua sắm'
//     },
//     {
//         title: 'Bán đồ cũ',
//         amount: 400000,
//         type: 'income',
//         note: 'Bán bàn học cũ',
//         daysAgo: 11,
//         categoryName: 'Thu nhập khác'
//     },
//     {
//         title: 'Mua kem đánh răng',
//         amount: 45000,
//         type: 'expense',
//         note: '',
//         daysAgo: 2,
//         categoryName: 'Sinh hoạt'
//     },
//     {
//         title: 'Gửi tiết kiệm',
//         amount: 2000000,
//         type: 'expense',
//         note: 'Chuyển khoản ngân hàng',
//         daysAgo: 9,
//         categoryName: 'Tiết kiệm'
//     },
//     {
//         title: 'Tiền hỗ trợ từ bố mẹ',
//         amount: 1000000,
//         type: 'income',
//         note: '',
//         daysAgo: 12,
//         categoryName: 'Thu nhập khác'
//     },
//     {
//         title: 'Mua đồ dùng văn phòng phẩm',
//         amount: 100000,
//         type: 'expense',
//         note: 'Bút + giấy note',
//         daysAgo: 3,
//         categoryName: 'Mua sắm'
//     }
// ];

// // Hàm seed dữ liệu mẫu
// async function seedMockDataFromArray() {
//     // console.log('Vào hàm SeedMockDataFromArray ');
//     // // return
//     const db = getDB();
//     const now = new Date();

//     // Lấy tất cả các categoryName duy nhất từ mảng mẫu
//     const categoryNames = [
//         ...new Set(mockTransactions.map(txn => txn.categoryName))
//     ];

//     // Tạo map categoryId tương ứng với tên
//     const categoryMap = new Map<string, string>();

//     // Tạo danh mục (categories)
//     for (const name of categoryNames) {
//         try {
//             const id = uuid.v4() as string;
//             const type = name === 'Lương' ? 'income' : 'expense';
//             const nowStr = now.toISOString();

//             await db.runAsync(
//                 `INSERT INTO categories (id, name, type, createdAt, updatedAt)
//           VALUES (?, ?, ?, ?, ?)`,
//                 [id, name, type, nowStr, nowStr]
//             );
//             categoryMap.set(name, id); // Lưu lại để dùng bên dưới
//         } catch (error) {
//             console.error('Lỗi khi insert category', error);
//         }
//     }

//     // Tạo giao dịch (transactions)
//     for (const txn of mockTransactions) {
//         try {
//             const id = uuid.v4() as string;
//             const date = new Date(now);
//             date.setDate(now.getDate() - txn.daysAgo); // trừ số ngày theo dữ liệu mẫu

//             await db.runAsync(
//                 `INSERT INTO transactions (id, title, amount, date, type, note, categoryId, createdAt, updatedAt)
//               VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                 [
//                     id,
//                     txn.title,
//                     txn.amount,
//                     date.toISOString(),
//                     txn.type,
//                     txn.note,
//                     categoryMap.get(txn.categoryName)!,
//                     now.toISOString(),
//                     now.toISOString()
//                 ]
//             );
//         } catch (error) {
//             console.error('Lỗi khi insert transaction', error);
//         }
//     }

//     console.log('Đã seed dữ liệu mẫu vào SQLite');
// }

// Lấy dữ liệu ra kiểm tra xem đã thêm vào hay chưa
// import { getDB } from '@/database/db';
// import React, { useEffect } from 'react';
// import { Text, View } from 'react-native';

// const IndexScreen = () => {
//     useEffect(() => {
//         const fetchData = async () => {
//             await fetchAndPrintCategories();
//             await fetchAndPrintTransactions();
//         };

//         fetchData();
//     }, []);
//     return (
//         <View>
//             <Text>IndexScreen</Text>
//         </View>
//     );
// };

// export default IndexScreen;

// // Hàm hiển thị danh mục
// async function fetchAndPrintCategories() {
//     const db = getDB();
//     try {
//         const results = await db.getAllAsync(
//             `SELECT * FROM categories ORDER BY name ASC`
//         );

//         if (results.length === 0) {
//             console.log('Không có dữ liệu Categories');
//         } else {
//             console.log('Danh sách danh mục đã tạo');
//             results.forEach((cat: any) => {
//                 return console.log(`- ${cat.id} | ${cat.name} | ${cat.type}`);
//             });
//         }
//     } catch (error) {
//         console.log('Lỗi khi fetch category', error);
//     }
// }

// // Hàm hiển thị giao dịch
// async function fetchAndPrintTransactions() {
//     const db = getDB();
//     try {
//         const results = await db.getAllAsync(
//             `SELECT * FROM transactions ORDER BY date DESC`
//         );

//         if (results.length === 0) {
//             console.log('Không có dữ liệu Transactions');
//         } else {
//             console.log('Danh sách giao dịch đã tạo');
//             results.forEach((txn: any) => {
//                 const title = txn.title;
//                 const amount = txn.amount;
//                 const type = txn.type;
//                 const date = formatDate(txn.date);
//                 const categoryId = txn.categoryId;

//                 console.log(
//                     `- ${title} | ${type} | categoryId: ${categoryId} | ${amount} d | ${date}`
//                 );
//             });
//         }
//     } catch (error) {
//         console.error('Lỗi khi fetch Transaction', error);
//     }
// }

// function formatDate(dateStr: string): string {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('vi-VN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// }

import HomeScreen from '../../screens/HomeScreen'; // Import màn hình thêm giao dịch

export default HomeScreen; // xuất màn hình này làm default export của route
