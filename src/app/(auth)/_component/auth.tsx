import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import Link from "next/link";
import { PropsWithChildren } from "react";
interface AuthProp extends PropsWithChildren {
  type: "login" | "signUp";
}
const Auth = ({  children, type }: AuthProp) => {
  return (
    <div >

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={APP_URL.home}>Trang chủ</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              <Link
                href={`${type === "login" ? APP_URL.login : APP_URL.signUp}`}
              >
                {type === "login" ? "Đăng nhập" : "Đăng ki"}
              </Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageTitle>

        {type === "login" ? "Đăng nhập" : "Đăng kí tài khoản mới"}
      </PageTitle>
   
        {children}
        </div>
   
  );
};

export default Auth;
