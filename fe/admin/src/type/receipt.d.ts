export interface Receipt {
    uid: string;
    note: string;
    staffUid: string;
    entryUid: string;
}

export interface ReceiptItem {
    uid: string;
    quantity: number;
    quantity1: number;
    receiptUid: string;
    productUid: string;
    entryItemUid: string;
}

export interface ReceiptCreateDto {
    entryUid: string;
    note?: string;
    items: {
        entryItemUid: string;
        quantity: number;
    }[];
}