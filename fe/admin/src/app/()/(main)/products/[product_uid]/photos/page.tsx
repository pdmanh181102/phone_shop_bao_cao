"use client";

import FileButton from "@component/file_button";
import LoadingScreen from "@component/loading_screen";
import SmallImageComponent from "@component/small_image";
import { useProduct } from "@state/product/useProduct";
import { useDeleteProductPhoto } from "@state/product_photo/useDeleteProductPhoto";
import { useProductPhotoList } from "@state/product_photo/useProductPhotoList";
import { useSetDefaultProductPhoto } from "@state/product_photo/useSetDefaultProductPhoto";
import { useUploadProductPhoto } from "@state/product_photo/useUploadProductPhoto";
import { ProductPhoto } from "@type/product_photo";
import { UploadOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Flex,
  Popconfirm,
  Table,
  TableColumnsType,
  Upload,
  UploadProps,
} from "antd";
import Link from "antd/es/typography/Link";
import React, { use, useMemo } from "react";
import { RcFile } from "antd/es/upload";
import { getMessageApi } from "@context/MessageContext";

interface ProductPhotoManagePageProps {
  params: Promise<{ product_uid: string }>;
}

const ProductPhotoManagePage: React.FC<ProductPhotoManagePageProps> = ({
  params,
}) => {
  const { product_uid } = use(params);
  const { data: productData, isLoading: productLoading } = useProduct({
    product_uid,
  });
  const { data, isLoading, refetch } = useProductPhotoList(product_uid);

  const { delete: deleteProductPhoto } = useDeleteProductPhoto(() => refetch());
  const { setDefault } = useSetDefaultProductPhoto(() => refetch());
  const { uploadImage } = useUploadProductPhoto(product_uid, () => refetch());

  const columns: TableColumnsType<ProductPhoto> = useMemo(
    () => [
      {
        title: "Hình ảnh",
        dataIndex: "photoUrl",
        key: "photoUrl",
        render: (url: string) => <SmallImageComponent src={url} />,
      },
      {
        title: "Trạng thái",
        dataIndex: "isDefault",
        key: "isDefault",
        render: (isDefault: boolean) => isDefault && "Mặc định",
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: ProductPhoto) => (
          <Flex gap={10}>
            <Popconfirm
              title="Xóa"
              description={`Xóa hình ảnh?`}
              onConfirm={() => deleteProductPhoto(record.uid)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button danger size="small" type="primary">
                Xóa
              </Button>
            </Popconfirm>
            {record.isDefault === false && (
              <Popconfirm
                title="Cập nhật"
                description={`Đặt hình ảnh làm mặc định?`}
                onConfirm={() => setDefault(record.uid)}
                okText="Xác nhận"
                cancelText="Hủy"
                okType="danger"
              >
                <Button type="primary" size="small">
                  Đặt làm mặt định
                </Button>
              </Popconfirm>
            )}
          </Flex>
        ),
      },
    ],
    []
  );

  const props: UploadProps = {
    customRequest: ({ file, onSuccess, onError }) => {
      uploadImage(file as RcFile, {
        onSuccess: () => {
          onSuccess?.("ok");
        },
        onError: (err) => {
          onError?.(err);
        },
      });
    },
    listType: "picture",
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        getMessageApi().error("Chỉ chấp nhận hình ảnh");
      }
      return isImage || Upload.LIST_IGNORE;
    },
  };

  if (isLoading || productLoading) return <LoadingScreen />;

  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <Link href="/home">Trang chủ</Link>,
          },
          {
            title: <Link href="/products">Sản phẩm</Link>,
          },
          {
            title: (
              <Link href={`/products/${product_uid}`}>{productData?.name}</Link>
            ),
          },
          {
            title: "Photos",
          },
        ]}
      />
      <Flex>
        <Upload {...props}>
          <Button icon={<UploadOutlined />} type="primary">
            Thêm hình ảnh
          </Button>
        </Upload>
      </Flex>
      <Table
        rowKey={"uid"}
        dataSource={data?.content}
        columns={columns}
        loading={isLoading}
      />
    </Flex>
  );
};

export default ProductPhotoManagePage;
