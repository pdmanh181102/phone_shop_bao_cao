"use client";

import { Flex, Pagination } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface PaginationComponentProps {
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalPages,
  pageNumber,
  pageSize,
}) => {
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
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const p = String(page);
    updateParams("page", p);
  };

  return (
    <Flex justify="center" style={{ marginTop: "40px" }}>
      <Pagination
        size="small"
        onChange={handlePageChange}
        showSizeChanger={false}
        defaultCurrent={pageNumber}
        total={totalPages}
        pageSize={pageSize}
      />
    </Flex>
  );
};

export default PaginationComponent;
