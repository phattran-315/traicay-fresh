import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata:Metadata={
  title:'Trạng thái đơn hàng'
}
const OrderStatusLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      <BreadCrumbLinks
        links={[{ label: "Trạng thái đơn hàng", href: APP_URL.orderStatus }]}
      />
      <PageTitle>Trạng thái đơn hàng</PageTitle>
      {children}
    </section>
  );
};

export default OrderStatusLayout;
