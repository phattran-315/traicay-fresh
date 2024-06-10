"use client";
import { Order } from "@/payload/payload-types";
import { useCallback, useState } from "react";
import LoadOrderBtn from "./load-order-btn";
import OrderItem from "./order-item";
import OrderStatusTags from "./order-status-tags";


export const ORDER_STATUS_TAGS ={
  ALL : "all",
  PENDING : "pending",
  DELIVERING : "delivering",
  DELIVERED : "delivered",
  CANCELED : "canceled",
}as const

interface OrderListProps {
  initialOrders: Order[];
  hasNextPage: boolean;
}

export type IOrderStatusTag=typeof ORDER_STATUS_TAGS[keyof typeof ORDER_STATUS_TAGS];

const OrderList = ({ hasNextPage, initialOrders }: OrderListProps) => {
  const [orderStatusTag, setOrderStatusTag] = useState<IOrderStatusTag>(
    ORDER_STATUS_TAGS.ALL
  );
  const handleSetOrderStatusTag = (status: IOrderStatusTag) =>
    setOrderStatusTag(status);

  const [userOrders, setUserOrders] = useState<Order[]>(initialOrders);
  const orders=orderStatusTag==='all'?userOrders:userOrders.filter(order=>order.deliveryStatus===orderStatusTag)
  const handleLoadOrder = useCallback((orders: Order[]) => {
    setUserOrders((prev) => [...prev, ...orders]);
  }, []);
  return (
    <div className="md:flex md:gap-12">
      <OrderStatusTags
        onSetOrderStatusTag={handleSetOrderStatusTag}
        currentTag={orderStatusTag}
      />
      <ul className='space-y-6 md:flex-1'>
        {orders.length ? orders?.map((order) => (
          <OrderItem
            key={order.id}
            items={order.items}
            deliveryStatus={order.deliveryStatus}
            orderId={order.id}
            totalPrice={order.total}
          />
        )):<p className="font-bold mt-8 text-center">Không có đơn hàng nào</p>}
        {hasNextPage && (
          <div className='mt-8 flex justify-center'>
            <LoadOrderBtn
              onSetOrder={handleLoadOrder}
              currentOrders={userOrders}
            />
          </div>
        )}
      </ul>
    </div>
  );
};

export default OrderList;
