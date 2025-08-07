"use client";

import { AuthStorage } from "@/uitl/auth_storage";
import {
  CameraOutlined,
  LockOutlined,
  LogoutOutlined,
  ManOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { useUser } from "@state/user/useUser";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useEffect, useState } from "react";
import UpdateAccountPasswordDialog from "./_dialog/update_account_password_dialog";
import { getMessageApi } from "@context/MessageContext";
import { useUpdateUserPhotoWithUpload } from "@state/user/useUpdateUserPhotoWithUpload";
import { RcFile } from "antd/es/upload";

const ProfilePage = () => {
  const [openDialog, setOpenDialog] = useState<string>("closed");
  const [userUid, setUserUid] = useState<string | null>(null);
  const [accountUid, setAccountUid] = useState<string | null>(null);

  useEffect(() => {
    setUserUid(AuthStorage.getUserUid());
    setAccountUid(AuthStorage.getAccountUid());
  }, []);

  const { data: user, isPending, refetch } = useUser({ user_uid: userUid });

  const handleLogout = () => {
    AuthStorage.clear();
    window.location.href = "/login";
  };

  const handleChangeAvatar = () => {
    message.info("Tính năng đổi ảnh đại diện sẽ được phát triển!");
    // Hoặc mở modal upload ảnh
  };

  const getGenderIcon = (gender: string) => {
    if (gender === "male") return <ManOutlined />;
    if (gender === "female") return <WomanOutlined />;
    return <UserOutlined />;
  };

  const { uploadImage } = useUpdateUserPhotoWithUpload(() => refetch());

  const props: UploadProps = {
    customRequest: ({ file, onSuccess, onError }) => {
      uploadImage({ userUid: userUid!, file: file as RcFile });
    },
    listType: "picture",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        getMessageApi().error("Chỉ chấp nhận hình ảnh");
      }
      return isImage || Upload.LIST_IGNORE;
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-10">
      <Row justify={"center"}>
        <Col>
          <Card
            className="max-w-3xl mx-auto shadow-xl rounded-2xl"
            styles={{
              body: { padding: "2rem" },
            }}
            title={
              <Flex justify="space-between" align="center">
                <span className="text-xl font-semibold text-gray-700">
                  Thông tin cá nhân
                </span>
                <Popconfirm
                  title="Bạn có chắc muốn đăng xuất?"
                  description="Phiên làm việc của bạn sẽ kết thúc."
                  onConfirm={handleLogout}
                  okText="Đăng xuất"
                  cancelText="Hủy"
                >
                  <Button danger icon={<LogoutOutlined />}>
                    Đăng xuất
                  </Button>
                </Popconfirm>
              </Flex>
            }
          >
            {isPending || !user ? (
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            ) : (
              <Flex gap={24} wrap="wrap" align="start">
                <div className="relative">
                  <Avatar
                    size={96}
                    className="bg-blue-600 text-white"
                    icon={getGenderIcon(user.gender)}
                    src={user.photoUrl}
                  />
                  <Upload {...props}>
                    <Tooltip title="Đổi ảnh đại diện">
                      <Button
                        shape="circle"
                        icon={<CameraOutlined />}
                        size="small"
                        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 shadow"
                        onClick={handleChangeAvatar}
                      />
                    </Tooltip>
                  </Upload>
                </div>

                <Descriptions
                  column={1}
                  styles={{
                    label: { fontWeight: "bold", color: "#555" },
                    content: { color: "#333" },
                  }}
                  className="w-full sm:w-auto"
                >
                  <Descriptions.Item label="Họ tên">
                    {user.firstName} {user.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {user.gender === "male"
                      ? "Nam"
                      : user.gender === "female"
                      ? "Nữ"
                      : "Khác"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã người dùng">
                    {user.uid}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo tài khoản">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Descriptions.Item>
                </Descriptions>
              </Flex>
            )}

            {/* Nút chức năng */}
            <Flex justify="end" className="mt-6">
              <Space>
                <Button
                  icon={<LockOutlined />}
                  onClick={() => setOpenDialog("change_password")}
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </Flex>
          </Card>
        </Col>
      </Row>
      <UpdateAccountPasswordDialog
        open={openDialog == "change_password"}
        account_uid={accountUid!}
        onCancel={() => setOpenDialog("closed")}
        onSuccess={() => {
          setOpenDialog("closed");
        }}
      />
    </div>
  );
};

export default ProfilePage;
