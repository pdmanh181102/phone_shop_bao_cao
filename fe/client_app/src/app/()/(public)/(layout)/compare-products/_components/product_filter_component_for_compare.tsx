"use client";

import { useAllBrand } from "@/api/state/brand/useAllBrand";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Spin } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

// interface ProductFilterComponentForCompareProps {
//   onChange?: (
//     search: string,
//     brand_uids: string[],
//     status_uids: string[]
//   ) => void;
// }
// Toản sửa
interface ProductFilterComponentForCompareProps {
  onChange: (search: string, brand_uids: string[], status_uids: string[]) => void;
}

const ProductFilterComponentForCompare: React.FC<ProductFilterComponentForCompareProps> = ({ onChange }) => {
  const { data: brandData, isLoading: brandLoading } = useAllBrand();
  const [value, setValue] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== null && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };


  // const handleSelectBrand = (brandUid: string) => {
  //   if (searchParams.get("brand") == brandUid) {
  //     updateParams("brand", null);
  //   } else {
  //     updateParams("brand", brandUid);
  //   }
  // };
  // Toản sửa 
  const handleSelectBrand = (brandUid: string) => {
    const current = searchParams.get('brand');
    const updated = current === brandUid ? null : brandUid;
    updateParams('brand', updated);

    // ✅ GỌI LẠI onChange với brand mới
    onChange(
      searchParams.get('search') || '',
      updated ? [updated] : [],
      []
    );

  }
  const onSearch = (searchValue: string) => {
    updateParams("search", searchValue.trim() || null);
  };

  if (brandLoading) return <Spin />;

  return (
    <Flex
      vertical
      gap={20}
      align="center"
      style={{
        padding: "10px",
      }}
    >
      {brandData && (
        <Flex gap={10} wrap>
          {brandData.map((brand) => (
            <Button
              onClick={() => handleSelectBrand(brand.uid)}
              color="blue"
              key={brand.uid}
              icon={
                <img
                  style={{
                    height: "20px",
                  }}
                  src={brand.photoUrl}
                />
              }
            >
              {brand.name}
            </Button>
          ))}
        </Flex>
      )}
      <Flex className="w-full max-w-xl" gap="small" align="center">
        <Input
          allowClear
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={() => onSearch(value)}
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="rounded-xl border border-gray-300 shadow-sm focus:shadow-md transition duration-200"
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => onSearch(value)}
          className="rounded-xl"
        >
          Tìm kiếm
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProductFilterComponentForCompare;
