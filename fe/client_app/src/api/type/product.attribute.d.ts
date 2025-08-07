export interface ProductAttribute {
    uid: string,
    name: string,
    value: string,
    groupName: string,
}

// Phục vụ cho compare product
// Giá trị cụ thể của mỗi thuộc tính
export interface AttributeValue {
    value: string;
}

// Thuộc tính trong mỗi nhóm (có thể có hoặc không có giá trị)
export interface Attribute {
    name: string;
    values: AttributeValue[] | null;
}

// Nhóm thuộc tính (dựa theo groupName)
export interface AttributeGroup {
    groupName: string;
    attributes: Attribute[];
}

// Sản phẩm so sánh
export interface CompareProduct {
    uid: string;
    name: string;
    soldQuantity: number;
    price: number | null;
    star: number | null;
    photoUrl: string;
    attributeGroups: AttributeGroup[];
}

// Danh sách các sản phẩm được so sánh
export type CompareProductList = CompareProduct[];
