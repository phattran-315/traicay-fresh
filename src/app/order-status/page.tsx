import { buttonVariants } from "@/components/ui/button";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";
import { getOrderStatus } from "@/services/server/payload/orders.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusInfo from "./order-status-info";

const OrderStatus = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  
  const orderId = searchParams[APP_PARAMS.cartOrderId];
  if (!orderId) notFound();
  const {data:order} = await getOrderStatus({ orderId });
  if(!order) notFound()
  let content = (
    <div className='text-center mt-8'>
      <p className='font-bold mb-2 text-lg'>
        Không có đơn hàng nào với mã số này!
      </p>
      <Link className={buttonVariants({ variant: "link" })} href={APP_URL.home}>
        Trờ về trang chủ
      </Link>
    </div>
  );
  if (order) {
    content = (
      <OrderStatusInfo
      items={order.items}
      orderNotes={order.orderNotes}
        shippingAddress={order.shippingAddress}
        deliveryStatus={order.deliveryStatus}
        orderId={order.id}
        orderStatus={order.status}
        totalPrice={order.total}
      />
    );
  }
  return (
    <>
      
      {content}
    </>
  );
};

export default OrderStatus;
