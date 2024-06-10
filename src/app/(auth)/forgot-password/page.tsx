import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";

import { APP_URL } from "@/constants/navigation.constant";
import ForgotPasswordForm from "./__component/forgot-password-form.tsx";
import PageTitle from "@/components/ui/page-title";
// TODO: put in types
const ForgotPassword = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const origin =
    typeof searchParams?.origin === "string" && searchParams?.origin === "login"
      ? searchParams?.origin
      : "";
  return (
    <div>
      <BreadCrumbLinks
        deep={origin ? 2 : 1}
        links={
          origin
            ? [
                {
                  label: "Đăng nhập",
                  href: APP_URL.login,
                },
                {
                  label: "Lấy lại mật khẩu",
                  href: APP_URL.forgotPassword,
                },
              ]
            : [
                {
                  label: "Lấy lại mật khẩu",
                  href: APP_URL.forgotPassword,
                },
                {
                  label: "",
                  href: "#",
                },
              ]
        }
      />
      <PageTitle>Lấy lại mật khẩu</PageTitle>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
