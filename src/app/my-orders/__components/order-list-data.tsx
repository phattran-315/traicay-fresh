import { cookies } from "next/headers";
import { getUserServer } from "@/services/server/payload/users.service";

import { getUserOrders } from "@/services/server/payload/orders.service";
import OrderList from "./order-list";
import EmptyCart from "@/components/molecules/empty-cart";

const OrderListData = async () => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;
  const { data } = await getUserOrders({ userId: user!.id });
  const orders = data?.orders;
  if (!orders?.length) return <EmptyCart message='Bạn chưa mua đơn hàng nào' />;

  return (
    <OrderList
      initialOrders={orders || []}
      hasNextPage={data?.hasNextPage || false}
    />
  );
};

export default OrderListData;
