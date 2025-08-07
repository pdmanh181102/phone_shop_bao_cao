/**
 * Format Date object thành định dạng ngày giờ Việt Nam
 * @param date - Date object hoặc string ISO
 * @returns Chuỗi ngày giờ định dạng Việt Nam
 */
export const formatDateTimeVN = (date: Date | string | undefined): string => {

    if (!date) {
        return "N/A";
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return 'Ngày không hợp lệ';
    }

    return dateObj.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

/**
 * Format Date object thành định dạng ngày Việt Nam (không có giờ)
 * @param date - Date object hoặc string ISO
 * @returns Chuỗi ngày định dạng Việt Nam
 */
export const formatDateVN = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return 'Ngày không hợp lệ';
    }

    return dateObj.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

/**
 * Format Date object thành định dạng giờ Việt Nam
 * @param date - Date object hoặc string ISO
 * @returns Chuỗi giờ định dạng Việt Nam
 */
export const formatTimeVN = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return 'Giờ không hợp lệ';
    }

    return dateObj.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

/**
 * Format Date object thành định dạng relative time (vừa xong, 5 phút trước, etc.)
 * @param date - Date object hoặc string ISO
 * @returns Chuỗi thời gian tương đối
 */
export const formatRelativeTimeVN = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return 'Thời gian không hợp lệ';
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return 'vừa xong';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else {
        return formatDateVN(dateObj);
    }
};

// Ví dụ sử dụng:
// const isoDate = "2025-07-14T10:49:09.201839Z";
// console.log(formatDateTimeVN(isoDate)); // "14/07/2025, 17:49:09"
// console.log(formatDateVN(isoDate));     // "14/07/2025"
// console.log(formatTimeVN(isoDate));     // "17:49:09"
// console.log(formatRelativeTimeVN(isoDate)); // "5 phút trước" (tùy thuộc vào thời gian hiện tại)


export function formatNumberVN(number: number | undefined | null): string {
    if (number !== 0 && !number) return "N/A"
    return number.toLocaleString('vi-VN');
}

export function formatCurrencyVND(amount: number | undefined | null): string {
    if (amount != 0 && !amount) return "N/A"
    return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    });
}