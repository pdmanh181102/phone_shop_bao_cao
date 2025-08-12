"use client";

import LoadingScreen from "@component/loading_screen";
import DropDownMenuComponent from "@component/select_menu_component";
import SmallImageComponent from "@component/small_image";
import { useCustomer } from "@state/customer/useCustomer";
import { useUpdateCustomerStatus } from "@state/customer/useUpdateCustomerStatus";
import { Breadcrumb, Descriptions, Flex, MenuProps } from "antd";
import Link from "antd/es/typography/Link";
import Title from "antd/es/typography/Title";
import React, { use, useMemo } from "react";
import { FaImage } from "react-icons/fa";
import CustomerOrders from "../_component/CustomerOrder";

interface CustomerDetailPageProps {
  params: Promise<{ customerUid: string }>;
}

const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ params }) => {
  const { customerUid } = use(params);

  const { data, isLoading, refetch } = useCustomer(customerUid);

  const { updateStatus, loading: updateStatusLoading } =
    useUpdateCustomerStatus(() => refetch());

  const items: MenuProps["items"] = useMemo(() => {
    if (data && data.status == "Disable") {
      return [
        {
          key: "1",
          label: (
            <div className="flex items-center gap-2">
              <FaImage /> Enable
            </div>
          ),
          onClick: () => {
            updateStatus({ customerUid, status: "ACTIVE" });
          },
        },
      ];
    } else {
      return [
        {
          key: "1",
          label: (
            <div className="flex items-center gap-2">
              <FaImage /> Disable
            </div>
          ),
          onClick: () => {
            updateStatus({ customerUid, status: "DISABLE" });
          },
        },
      ];
    }
  }, [data]);

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
              title: <Link href="/customers">Customers</Link>,
            },
            {
              title: `${data?.firstName} ${data?.lastName}`,
            },
          ]}
        />
        <Title level={1}>{`${data?.firstName} ${data?.lastName}`}</Title>
        <Flex>
          <SmallImageComponent src={data?.photoUrl} />
        </Flex>

        {data && (
          <Descriptions
            column={1}
            styles={{
              label: { fontWeight: "bold", width: 150 },
              content: {
                width: 300,
              },
            }}
          >
            <Descriptions.Item label="UID">{data.uid}</Descriptions.Item>
            <Descriptions.Item label="Họ">{data.firstName}</Descriptions.Item>
            <Descriptions.Item label="Tên">{data.lastName}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {data.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">
              {data.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {data.address}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {data.username}
            </Descriptions.Item>
            <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
          </Descriptions>
        )}

        <Flex gap={10}>
          <DropDownMenuComponent items={items} />
        </Flex>

        <CustomerOrders customterUid={customerUid} />
      </Flex>
    </>
  );
};

export default CustomerDetailPage;
