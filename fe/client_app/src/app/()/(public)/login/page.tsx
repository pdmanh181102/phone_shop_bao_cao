import { Typography } from "antd";
import PageLoginClient from "./_component/page_login_client";

const { Title } = Typography;

interface PageProps {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
}

const LoginPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const redirectTo = params.redirectTo || "/";

  return <PageLoginClient redirectTo={redirectTo} />;
};

export default LoginPage;
