"use client";

import { CustomerApi } from "@/api/client/customer_api";
import { useGenderList } from "@/api/state/gender/useGenderList";
import { getMessageApi } from "@/context/MessageContext";
import { DatePicker } from "antd";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
type Gender = "MALE" | "FE_MALE" | "ORTHER";

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  gender: string;
  password: string;
  confirmPassword: string;
  email: string;
  address: string;
  phoneNumber: string;
  birthDay: any;
}

const RegisterForm: React.FC = () => {
  const { data: genders } = useGenderList();

  const genderOptions = useMemo(() => {
    if (!genders) return [];
    return genders.map((gender) => ({
      label: gender.label,
      value: gender.uid,
    }));
  }, [genders]);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "MALE",
    email: "",
    address: "",
    phoneNumber: "",
    birthDay: new Date(),
  });
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = async () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName) newErrors.lastName = "Vui lòng nhập họ";
    if (!formData.username) {
      newErrors.username = "Vui lòng nhập tên người dùng";
    }
    if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Mật khẩu không khớp";
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = await validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      getMessageApi().error("Vui lòng kiểm tra lại thông tin đăng ký");
      return;
    }
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const usernameExists = await CustomerApi.checkUsernameExists(
          formData.username
        );
        if (usernameExists) {
          getMessageApi().error(
            "Username đã được sử dụng bởi một tài khoản khác!"
          );
          return;
        }

        const emailExists = await CustomerApi.checkEmailExists(formData.email);
        if (emailExists) {
          getMessageApi().error(
            "Email đã được sử dụng bởi một tài khoản khác!"
          );
          return;
        }

        const payload = {
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          email: formData.email,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          birthDay: formData.birthDay,
        };
        // mạnh sửa để tích hợp
        await CustomerApi.register(payload);

        getMessageApi().success("Đăng ký thành công!");

        // code cũ của toản
        // const newUser = await AuthApi.register(
        //     formData.firstName,
        //     formData.lastName,
        //     formData.gender,
        //     formData.email,
        //     formData.address,
        //     formData.phoneNumber,
        // );
        // getMessageApi().success("tạo User thành công!");
        // const newAccount = await AccountApi.create(newUser.uid, formData.username, formData.password);
        // getMessageApi().success("Tạo tài khoản thành công!")

        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          gender: "MALE",
          password: "",
          confirmPassword: "",
          email: formData.email,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          birthDay: new Date(),
        });
        localStorage.setItem("emailToVerify", formData.email);
        router.push("/verify");
      } catch (error: any) {
        console.error("Lỗi đăng ký:", error);

        let errMsg = "Không thể tạo user";

        if (error?.response?.data?.message) {
          errMsg = error.response.data.message;
        } else if (typeof error.message === "string") {
          errMsg = error.message;
        }

        // Kiểm tra nếu là lỗi email trùng
        if (errMsg.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: errMsg }));
        } else {
          getMessageApi().error(errMsg);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={styles.field}>
        <label>Tên tài khoản</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.username && <span style={styles.error}>{errors.username}</span>}
      </div>
      <div style={styles.field}>
        <label>Mật khẩu</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.password && <span style={styles.error}>{errors.password}</span>}
      </div>

      <div style={styles.field}>
        <label>Nhập lại mật khẩu</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.confirmPassword && (
          <span style={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <div style={styles.field}>
        <label>Họ</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}
      </div>

      <div style={styles.field}>
        <label>Tên</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.firstName && (
          <span style={styles.error}>{errors.firstName}</span>
        )}
      </div>

      <div style={styles.field}>
        <label>Giới tính</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={styles.input}
        >
          {genderOptions.map((gender) => (
            <option key={gender.value} value={gender.value}>
              {gender.label}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.field}>
        <label>Ngày sinh</label>
        <DatePicker
          className="w-full"
          placeholder="Chọn ngày sinh"
          format="DD/MM/YYYY"
          onChange={(date: any) => {
            if (date)
              setFormData((prev) => ({
                ...prev,
                birthDay: date.format("YYYY-MM-DD"),
              }));
          }}
        />
      </div>

      <div style={styles.field}>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}
      </div>

      <div style={styles.field}>
        <label>Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.firstName && (
          <span style={styles.error}>{errors.firstName}</span>
        )}
      </div>
      <div style={styles.field}>
        <label>Số điện thoại</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.firstName && (
          <span style={styles.error}>{errors.firstName}</span>
        )}
      </div>

      <button type="submit" style={styles.button} disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
      </button>
      <p style={styles.linkText}>
        Đã có tài khoản?{" "}
        <span onClick={() => router.push("/login")} style={styles.link}>
          Đăng nhập
        </span>
      </p>
      <button
        type="button"
        onClick={() => router.push("/")}
        style={styles.backButton}
      >
        Trở về trang chủ
      </button>
    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  field: {
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "4px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
    display: "block",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1677ff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
  linkText: {
    textAlign: "center",
    marginTop: "12px",
    fontSize: "14px",
  },

  link: {
    color: "#1677ff",
    cursor: "pointer",
    textDecoration: "underline",
  },
  backButton: {
    marginTop: "8px",
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default RegisterForm;
