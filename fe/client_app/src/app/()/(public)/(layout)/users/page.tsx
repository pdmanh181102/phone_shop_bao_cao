"use client";
import { CustomerApi } from "@/api/client/customer_api";
import { Customer } from "@/api/type/customer";
import { AuthStorage } from "@/util/auth_storage";
import { Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import AccountInformationCard from "./_components/account_information_card";
import UserInformationCard from "./_components/user_information_card_component";
const { Option } = Select;
const { Title, Text } = Typography;

const UserPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user_uid = AuthStorage.getAccountUid();
        if (!user_uid) {
          throw new Error("User UID is not available");
        }
        const result = await CustomerApi.readByUid(user_uid);
        setUser(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <Row gutter={24} justify="center">
        <UserInformationCard userInfo={user}></UserInformationCard>
        <AccountInformationCard accountInfo={user}></AccountInformationCard>
      </Row>
    </div>
  );
};

export default UserPage;
