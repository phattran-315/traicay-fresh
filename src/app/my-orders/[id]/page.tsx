import { APP_URL } from "@/constants/navigation.constant";
import { getOrderStatus } from "@/services/server/payload/orders.service";
import { notFound } from "next/navigation";

import FeedbackBox from "@/components/molecules/feed-back-box";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import OrderSpecificCancelOrder from "./__components/order-specific-cancel-order";
import OrderSpecificDetails from "./__components/order-specific-details";
import OrderSpecificNotes from "./__components/order-specific-notes";
import OrderSpecificPayment from "./__components/order-specific-payment";
import OrderSpecificProducts from "./__components/order-specific-products";
import OrderSpecificShippingAddress from "./__components/order-specific-shipping-address";
import OrderSpecificSummary from "./__components/order-specific-sumary";
const SpecificOrderPage = async ({ params }: { params: { id: string } }) => {
  const orderId = params.id;
  const { data: order } = await getOrderStatus({ orderId });
  if (!order) return notFound();

  return (
    <>
      <div className='space-y-4 divide-y'>
        <OrderSpecificDetails
          deliveryStatus={order.deliveryStatus}
          createdAt={order.createdAt}
          orderId={order.id}
        />
       <div className="md:grid md:grid-cols-2 md:gap-x-4">
       <OrderSpecificShippingAddress
          address={order.shippingAddress.address}
          phoneNumber={order.shippingAddress.userPhoneNumber}
          userName={order.shippingAddress.userName}
        />
        <OrderSpecificPayment paymentMethod={order.paymentMethod} />
       </div>
        {order.orderNotes && <OrderSpecificNotes notes={order.orderNotes} />}
        <OrderSpecificProducts items={order.items} />
        <OrderSpecificSummary
          totalAfterCoupon={order.totalAfterCoupon}
          shippingCost={order.shippingFee}
          total={order.total}
          provisional={order.provisional}
        />
      </div>
      <div className="mt-8 md:flex md:justify-center">
      {order.status === "pending" && order.deliveryStatus === "pending" && (
          <OrderSpecificCancelOrder orderId={orderId} />
        )}
      </div>
      <div className='mt-8 md:flex md:justify-center'>
       
        <Link
          href={APP_URL.myOrders}
          data-cy='come-back-to-orders'
          className={buttonVariants({
            variant: "outline",
            className: " w-full md:w-1/2 md:my-6",
          })}
        >
          Trở về danh sách đơn hàng
        </Link>
      </div>
      <FeedbackBox />
    </>
  );
};

export default SpecificOrderPage;
