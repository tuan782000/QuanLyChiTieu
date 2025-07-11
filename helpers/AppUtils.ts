import { Transaction } from '../models/Transaction';

// Đối tượng chứa các hàm tiện ích dùng chung trong toàn ứng dụng
export const AppUtils = {
    // Định dạng số tiền thành chuỗi tiếng việt, có "đ" ở cuối
    formatCurrency(amount: number): string {
        return amount.toLocaleString('vi-VN') + 'đ';
    },

    // chuyển chuỗi số có định dạng ("vd: 1.000.000 đ") thành số thực
    currencyToDouble(input: string): number {
        const digitsOnly = input.replace(/[^0-9]/g, ''); // loại bỏ ký tự không phải số
        return parseFloat(digitsOnly) || 0; // Trả về 0 nếu không parse được
    },

    // Chuyển type "income / expense" thành tiếng việt
    displayType(type: Transaction['type']): string {
        return type === 'income' ? 'Thu nhập' : 'Chi tiêu';
    },

    // định dạng ngày dd/mm/yyyy
    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    },

    // định dạng ngày chỉ lấy dd/mm
    formatDayMonth(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        }).format(date);
    },

    // Định dạng ngày + giờ vd: "21 tháng 5, 09:30"
    formatFullDay(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    },

    formatCurrencyInput(raw: string): string {
        const number = parseInt(raw || '0', 10); // chuyển đổi thành số nguyên
        return number.toLocaleString('vi-VN'); // Format theo định dạng Việt Nam
    }
};
