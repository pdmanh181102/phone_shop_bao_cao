import React from "react";
import RegisterContainer from "./_components/register_container";
import RegisterForm from "./_components/register_form";
interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
  return (
    <RegisterContainer title="Tạo tài khoản mới">
      <RegisterForm />
    </RegisterContainer>
  );
};

export default RegisterPage;
