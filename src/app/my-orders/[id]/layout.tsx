import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getOrderStatus } from "@/services/server/payload/orders.service";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

const MyOrdersLayout = async ({
  children,
  params,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const orderId = params.id;
  if (!orderId) notFound();
  const { data: order } = await getOrderStatus({ orderId });
  if (!order) return notFound();
  return (
    <section>
      <BreadCrumbLinks
        deep={2}
        links={[
          { href: APP_URL.myOrders, label: "Đơn hàng đã mua" },
          {
            href: `${APP_URL.myOrders}/${orderId}`,
            label: "Chi tiết đơn hàng",
          },
        ]}
      />
      <PageTitle>Chi tiết đơn hàng</PageTitle>

      {children}
    </section>
  );
};

export default MyOrdersLayout;
