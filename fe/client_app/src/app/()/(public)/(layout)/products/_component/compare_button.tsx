"use client";

import { ProductApi } from "@/api/client/product_api";
import { ProductPhotoApi } from "@/api/client/product_photo_api";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type ProductInfo = {
    uid: string;
    name: string;
    photoUrl: string;
};
const CompareFloatingWidget = () => {
    const [visible, setVisible] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedProductUids, setSelectedProductUids] = useState<string[]>([]);
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const router = useRouter();
    // Lấy danh sách productUid từ localStorage
    const getSelectedProductUids = (): string[] => {
        try {
            const raw = localStorage.getItem("compareProductUids");
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            return [];
        }
    };
    const fetchProducts = async () => {
        const uids = getSelectedProductUids();
        setSelectedProductUids(uids);
        setSelectedCount(uids.length);

        try {
            const fetched: ProductInfo[] = await Promise.all(
                uids.map(async (uid) => {
                    try {
                        const [product, photo] = await Promise.all([
                            ProductApi.readByUid(uid),
                            ProductPhotoApi.readProductAvatar(uid),
                        ]);

                        return {
                            uid,
                            name: product.name,
                            photoUrl: photo.photoUrl,
                        };
                    } catch (error) {
                        console.error(`Lỗi khi tải sản phẩm ${uid}:`, error);
                        return {
                            uid,
                            name: "Không tải được",
                            photoUrl: "https://via.placeholder.com/100?text=Error",
                        };
                    }
                })
            );
            setProducts(fetched);
        } catch (error) {
            console.error("Lỗi tổng khi fetch products:", error);
            setProducts([]);
        }
    };

    const removeProduct = (uidToRemove: string) => {
        const updatedUids = selectedProductUids.filter(uid => uid !== uidToRemove);
        localStorage.setItem("compareProductUids", JSON.stringify(updatedUids));

        // Gửi custom event để cập nhật realtime
        window.dispatchEvent(new Event("compareUpdated"));

        // Cập nhật lại UI ngay
        fetchProducts();
    };
    // Cập nhật số lượng từ localStorage
    const updateSelectedCount = () => {
        const uids = getSelectedProductUids();
        setSelectedCount(uids.length);
    };
    useEffect(() => {
        if (typeof window !== "undefined") {
            fetchProducts();
        }

        const handleStorageChange = () => fetchProducts();
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("compareUpdated", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("compareUpdated", handleStorageChange);
        };
    }, []);


    // Không hiển thị nếu không có sản phẩm nào
    if (selectedCount === 0 && !visible) return null;
    return (
        <>
            {/* Nút so sánh (chỉ hiển thị nếu box đang ẩn) */}
            {!visible && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        zIndex: 1000,
                    }}
                >
                    <Button type="primary" onClick={() => setVisible(true)}>
                        So sánh ({selectedCount})
                    </Button>
                </div>
            )}

            {/* Box hiện ra từ dưới */}
            <Drawer
                title="Sản phẩm đã chọn để so sánh"
                placement="bottom"
                closable={false}
                onClose={() => setVisible(false)}
                open={visible}
                height={300}
                extra={
                    <Button onClick={() => setVisible(false)}>Thu gọn</Button>
                }
                styles={{
                    body: { padding: "12px 24px", position: "relative" }
                }}
            >
                <div
                    style={{
                        display: "flex",
                        overflowX: "auto",
                        gap: 12,
                        paddingBottom: 12,
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.uid}
                            style={{
                                minWidth: 150,
                                height: 180,
                                background: "#fafafa",
                                borderRadius: 8,
                                padding: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeProduct(product.uid)}
                                    style={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        zIndex: 1,
                                        color: "#ff4d4f",
                                    }}
                                />
                                <img
                                    src={product.photoUrl}
                                    alt={product.name}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        objectFit: "cover",
                                        borderRadius: 4,
                                        margin: "28px auto 8px auto",
                                        display: "block",
                                    }}
                                />
                                <div style={{ fontWeight: 500, fontSize: 14 }}>
                                    {product.name}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                {/* Nút so sánh ngay */}
                <div
                    style={{
                        position: "absolute",
                        right: 24,
                        bottom: 12,
                    }}
                >
                    <Button
                        type="primary"
                        onClick={() => {
                            router.push("/compare-products"); // Chuyển hướng đến trang so sánh
                        }}
                    >
                        So sánh ngay
                    </Button>
                </div>

            </Drawer>
        </>
    );
};

export default CompareFloatingWidget;
