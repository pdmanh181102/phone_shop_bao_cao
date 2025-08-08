'use client';
import { ProductAttributeApi } from '@/api/client/product_attribute_api';
import { useAddCartItem } from '@/api/state/cart/useAddCartItem';
import { Product } from '@/api/type/product';
import { AttributeGroup, CompareProduct } from '@/api/type/product.attribute';
import AddProductDialog from "@/app/()/(public)/(layout)/compare-products/_components/select_product_dialog";
import { getMessageApi } from '@/context/MessageContext';
import { AuthStorage } from '@/util/auth_storage';
import { formatCurrencyVND } from '@/util/format_util';
import { DeleteOutlined, LeftOutlined, PlusOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Typography } from 'antd';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import BigOrderButtonComponent from './_components/BigOrderButtonComponent';
const { Title, Text } = Typography;



const ComparePage = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [compareProducts, setCompareProducts] = useState<CompareProduct[]>([]);
    const [sidebarAttributes, setSidebarAttributes] = useState<AttributeGroup[]>([]); // dùng cho sidebar
    const router = useRouter();
    const { add: addToCart, loading } = useAddCartItem();
    const [openDialog, setOpenDialog] = useState(false);
    const handleAddToCard = (uid: string) => {
        if (!AuthStorage.isLogined()) router.push("/login");

        addToCart({ customerUid: AuthStorage.getAccountUid()!, productUid: uid });
    };

    useEffect(() => {
        const raw = localStorage.getItem('compareProductUids');
        if (!raw) {
            getMessageApi().warning('Không có sản phẩm nào để so sánh');
            return;
        }

        const productUids: string[] = JSON.parse(raw);

        const fetchCompareProducts = async () => {
            try {
                const data = await ProductAttributeApi.getCompareProducts(productUids);
                setCompareProducts(data);
                if (data.length > 0) {
                    setSidebarAttributes(data[0].attributeGroups);
                }
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm so sánh:', error);
            }
        };

        fetchCompareProducts();
    }, []);
    const handleAddProducts = () => {
        // setProductList((prev) => [...prev, ...newProducts]);
    };
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    const handleRemoveProduct = (uid: string) => {
        const raw = localStorage.getItem('compareProductUids');
        if (!raw) return;

        let productUids: string[] = JSON.parse(raw);

        // Xóa sản phẩm có uid được truyền vào
        productUids = productUids.filter((id) => id !== uid);
        // Cập nhật lại localStorage
        localStorage.setItem('compareProductUids', JSON.stringify(productUids));
        if (productUids.length === 0) {
            localStorage.removeItem('compareProductUids');
            setCompareProducts([]); // Clear sản phẩm so sánh
        } else {
            localStorage.setItem('compareProductUids', JSON.stringify(productUids));
        }

        // Gọi lại API để load lại danh sách
        const fetchCompareProducts = async () => {
            try {
                const data = await ProductAttributeApi.getCompareProducts(productUids);
                setCompareProducts(data);
                if (data.length > 0) {
                    setSidebarAttributes(data[0].attributeGroups);
                } else {
                    setSidebarAttributes([]); // không còn gì thì clear sidebar
                }
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm so sánh:', error);
            }
        };

        fetchCompareProducts();
    };
    let content = null;
    if (compareProducts.length === 0) {
        content = (
            <Flex vertical style={{ padding: 20, textAlign: 'center' }}>
                <Title level={2} style={{ color: 'black' }}>
                    Không có sản phẩm nào để so sánh
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpenDialog(true)}
                    style={{ width: '200px', height: '40px', fontSize: '20px' }}
                >
                    Thêm sản phẩm
                </Button>
                <AddProductDialog
                    open={openDialog}
                    onCancel={() => setOpenDialog(false)}
                    onSuccess={(products: Product[]) => {

                        setOpenDialog(false);
                        const raw = localStorage.getItem('compareProductUids');
                        const productUids: string[] = raw ? JSON.parse(raw) : [];

                        const fetchCompareProducts = async () => {
                            try {
                                const data = await ProductAttributeApi.getCompareProducts(productUids);
                                setCompareProducts(data);
                                if (data.length > 0) {
                                    setSidebarAttributes(data[0].attributeGroups);
                                }
                            } catch (error) {
                                console.error("Lỗi khi tải lại sản phẩm:", error);
                            }
                        };

                        fetchCompareProducts();

                    }}
                />
            </Flex>
        );
    } else {


        content = (
            <Flex vertical style={{ padding: 20 }}>
                <Title level={2} style={{ color: 'black', textAlign: 'center' }}>
                    So sánh sản phẩm
                </Title>
                <AddProductDialog
                    open={openDialog}
                    onCancel={() => setOpenDialog(false)}
                    onSuccess={(products: Product[]) => {

                        setOpenDialog(false);
                        const raw = localStorage.getItem('compareProductUids');
                        const productUids: string[] = raw ? JSON.parse(raw) : [];

                        const fetchCompareProducts = async () => {
                            try {
                                const data = await ProductAttributeApi.getCompareProducts(productUids);
                                setCompareProducts(data);
                                if (data.length > 0) {
                                    setSidebarAttributes(data[0].attributeGroups);
                                }
                            } catch (error) {
                                console.error("Lỗi khi tải lại sản phẩm:", error);
                            }
                        };

                        fetchCompareProducts();

                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* Sidebar specs */}
                    <div style={{ minWidth: 250, background: 'transparent' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setOpenDialog(true)}
                            style={{ marginTop: 8, width: '90%', height: '40px', fontSize: '25px' }}
                        >
                            Thêm sản phẩm
                        </Button>

                        <div
                            style={{
                                fontWeight: 'bold',
                                marginTop: 422,
                                color: '#000',
                                fontSize: '30px',
                                textAlign: 'center',
                            }}
                        >
                            Thông số
                        </div>

                        <div style={{ width: 250 }}>
                            {sidebarAttributes.map((group) => (
                                <div
                                    key={group.groupName}
                                    style={{
                                        background: '#f5f5f5',
                                        marginBottom: 16,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: 100,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            background: '#e0e0e0', // màu đậm hơn cho tiêu đề nhóm
                                            borderBottom: '1px solid #ccc',
                                        }}
                                    >
                                        {group.groupName}
                                    </div>
                                    {/* {group.attributes.map((attr) => (
                                        <div
                                            key={attr.name}
                                            style={{
                                                height: 100,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {attr.name}
                                        </div>
                                    ))} */}
                                    {/* Toản sửa */}
                                    {group.attributes.map((attr, index) => (
                                        <div
                                            key={attr.name}
                                            style={{
                                                height: 100,
                                                display: 'flex',
                                                paddingLeft: '16px',
                                                paddingRight: '16px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: index % 2 === 0 ? '#f9f8ff' : '#F2F2F2',
                                            }}
                                        >
                                            {attr.values?.map((v) => v.value).join(', ') || 'Không có giá trị'}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>


                    </div>


                    {/* Scrollable product container */}
                    <div style={{ position: 'relative', flex: 1, overflowX: 'auto' }}>
                        {/* Scrollable list */}
                        <div
                            ref={scrollRef}
                            style={{
                                display: 'flex',
                                gap: 16,
                                padding: '0 40px 20px 40px',
                                overflowX: 'auto',
                                scrollBehavior: 'smooth',
                                marginLeft: '70px',
                                marginRight: '60px',
                            }}
                        >
                            {compareProducts.map((phone, index) => (
                                <Flex key={phone.uid} vertical style={{ width: 400, flexShrink: 0, position: 'relative', }}>
                                    <Card
                                        title={phone.name}
                                        variant="borderless"
                                        style={{ width: 400, background: '#f5f5f5' }}
                                        cover={<img src={phone.photoUrl} alt={phone.name} style={{ height: 300, objectFit: 'cover' }} />}
                                    >
                                        <Text strong>Giá: </Text>{formatCurrencyVND(phone.price)}<br />
                                        <Text strong>Đánh giá: </Text>{'⭐'.repeat(phone.star ?? 5)}<br />
                                        <Text strong>Đã bán: {phone.soldQuantity}</Text><br /><br />


                                    </Card>

                                    {/* Các dòng specs phải có cùng chiều cao với sidebar */}
                                    <div style={{ width: 400, background: '#f5f5f5', paddingTop: 16, paddingBottom: 16, marginTop: 8, textAlign: 'center' }}>
                                        {phone.attributeGroups.map((group) => (
                                            <div key={group.groupName}
                                                style={{
                                                    background: '#f5f5f5f',
                                                    marginBottom: 16,
                                                    borderRadius: 8,
                                                    overflow: 'hidden',
                                                    borderTopRightRadius: 0,
                                                    borderTopLeftRadius: 0,
                                                    borderBottomRightRadius: 8,
                                                    borderBottomLeftRadius: 8,
                                                    // để có thể đặt div che khuyết điểm
                                                }}

                                            >
                                                <div
                                                    style={{
                                                        position: 'absolute',        // hoặc 'fixed' nếu muốn dính vào màn hình
                                                        top: 490,                    // vị trí top trong trang hoặc relative parent
                                                        left: 0,
                                                        right: 0,                   // vị trí left

                                                        height: 100,
                                                        backgroundColor: '#fff',    // màu trắng che khuyết điểm
                                                        zIndex: 1,                // đảm bảo nằm trên mọi thứ
                                                        pointerEvents: 'none'       // không chặn click nếu không cần
                                                    }}
                                                />
                                                <div style={{
                                                    height: 100,
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    background: '#fff', // màu đậm hơn cho tiêu đề nhóm
                                                    color: 'transparent',
                                                    userSelect: 'none', // không cho phép chọn chữ
                                                }}>
                                                    {group.groupName}
                                                </div>
                                                {/* {group.attributes.map((attr) => (
                                                    <div
                                                        key={attr.name}
                                                        style={{ height: 100, display: 'flex', paddingLeft: '16px', paddingRight: '16px', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        {attr.values?.map((v) => v.value).join(', ') || 'Không có giá trị'}
                                                    </div>
                                                ))} */}
                                                {/* Toản sửa */}
                                                {group.attributes.map((attr, index) => (
                                                    <div
                                                        key={attr.name}
                                                        style={{
                                                            height: 100,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: index % 2 === 0 ? '#f9f8ff' : '#F2F2F2',
                                                        }}
                                                    >
                                                        {attr.name}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ width: 400, background: 'transparent', padding: 16, marginTop: 16, textAlign: 'center' }}>
                                        <Button type="primary" icon={<ShoppingCartOutlined />} style={{ height: '40px', marginBottom: 8, width: '90%', fontSize: '20px' }}
                                            onClick={() => handleAddToCard(phone.uid)}>
                                            Thêm giỏ hàng
                                        </Button><br />
                                        <BigOrderButtonComponent productUid={phone.uid} />
                                        <Button
                                            danger icon={<DeleteOutlined />}
                                            style={{ height: '40px', width: '90%', fontSize: '20px' }}
                                            onClick={() => handleRemoveProduct(phone.uid)}
                                        >
                                            Xóa sản phẩm
                                        </Button>

                                    </div>
                                </Flex>
                            ))}
                        </div>

                        {/* Fixed navigation buttons */}
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() => scroll('left')}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: 280,
                                zIndex: 1000,
                                transform: 'translateY(-50%)',
                            }}
                        />
                        <Button
                            icon={<RightOutlined />}
                            onClick={() => scroll('right')}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                right: 20,
                                zIndex: 1000,
                                transform: 'translateY(-50%)',
                            }}
                        />
                    </div>
                </div>
            </Flex>

        );
    }
    return content;
};

export default ComparePage;
