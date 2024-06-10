import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";

import { Suspense } from "react";
import OrderListData from "./__components/order-list-data";
import MyOrdersSkeleton from "./__components/my-orders-skeleton";

const MyOrderPage = () => {
  return (
    <>
      <BreadCrumbLinks
        deep={1}
        links={[{ href: APP_URL.myOrders, label: "Đơn hàng đã mua" }]}
      />
      <PageTitle>Đơn hàng đã mua</PageTitle>

      <Suspense fallback={<MyOrdersSkeleton />}>
        <OrderListData />
      </Suspense>
    </>
  );
};

export default MyOrderPage;
