"use client";

import FileButton from "@component/file_button";
import LoadingScreen from "@component/loading_screen";
import SmallImageComponent from "@component/small_image";
import { useBrand } from "@state/brand/useBrand";
import { useUpdateBrandPhotoWithUpload } from "@state/brand/useUpdateBrandPhotoWithUpload";
import { Breadcrumb, Button, Flex, MenuProps } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import React, { use, useRef, useState } from "react";
import ProductLineManageComponent from "./_component/product_line_manage_component";
import UpdateBrandNameDialog from "./_dialog/update_brand_name_dialog";
import DropDownMenuComponent from "@component/select_menu_component";
import { FaImage } from "react-icons/fa";
import CreateProductLineDialog from "./_dialog/create_product_line_dialog";

interface BrandDetailPageProps {
  params: Promise<{ brand_uid: string }>;
}

const BrandDetailPage: React.FC<BrandDetailPageProps> = ({ params }) => {
  const { brand_uid } = use(params);

  const [openDialog, setOpenDialog] = useState<string>("closed");

  const { data, isLoading, refetch } = useBrand({ brand_uid });

  const { uploadImage } = useUpdateBrandPhotoWithUpload(brand_uid);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2">
          <FaImage /> Cập nhật hình ảnh
        </div>
      ),
      onClick: () => {
        fileInputRef.current?.click();
      },
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <FaImage /> Cập nhật tên
        </div>
      ),
      onClick: () => setOpenDialog("edit"),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Flex vertical gap={20}>
        <Breadcrumb
          items={[
            {
              title: <Link href="/home">Home</Link>,
            },
            {
              title: <Link href="/brands">Thương hiệu</Link>,
            },
            {
              title: data?.name,
            },
          ]}
        />
        <Title level={1}>{data?.name}</Title>
        <Flex>
          <SmallImageComponent src={data?.photoUrl} />
        </Flex>
        <Flex gap={10}>
          <DropDownMenuComponent items={items} />
        </Flex>
        <ProductLineManageComponent brand_uid={brand_uid} />
        <UpdateBrandNameDialog
          brand_uid={brand_uid}
          open={openDialog == "edit"}
          onCancel={() => setOpenDialog("closed")}
          onSuccess={() => {
            setOpenDialog("closed");
            refetch();
          }}
        />
      </Flex>
      <FileButton
        ref={fileInputRef}
        size="small"
        onSelectFile={(file: File) => uploadImage(file)}
      />
    </>
  );
};

export default BrandDetailPage;
