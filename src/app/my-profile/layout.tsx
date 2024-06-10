
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata:Metadata={
  title:"Thông tin tài khoản",

}
const MyProfileLayout = async ({ children }: { children: ReactNode }) => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;
  if (!user) redirect(APP_URL.login);
  return (
    <section>
      <BreadCrumbLinks
        deep={1}
        links={[{ href: APP_URL.myProfile, label: "Thông tin tài khoản" }]}
      />
      <PageTitle>Quản lý tài khoản</PageTitle>

      {children}
    </section>
  );
};

export default MyProfileLayout;
