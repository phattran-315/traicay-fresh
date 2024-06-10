import React from "react";
import OrderSpecificSectionWrapper from "./order-specific-section-wrapper";
import { IoCardOutline } from "react-icons/io5";
import { Order } from "@/payload/payload-types";

interface OrderSpecificPaymentProps {
  paymentMethod: Order["paymentMethod"];
}
const OrderSpecificPayment = ({ paymentMethod }: OrderSpecificPaymentProps) => {
  return (
    <OrderSpecificSectionWrapper>
      <IoCardOutline size={35} />
      <div data-cy='payment-method-box' className='flex flex-col gap-2'>
        <p data-cy='title-box' className='font-bold sm:text-lg'>
          Hình thức thanh toán
        </p>
        <p data-cy='payment-method'>
          {paymentMethod === "cash" && "Thanh toán bằng tiền mặt"}
          {paymentMethod === "momo" && "Thanh toán bằng MoMo"}
          {paymentMethod === "vnpay" && "Thanh toán bằng VnPay"}
        </p>
      </div>
    </OrderSpecificSectionWrapper>
  );
};

export default OrderSpecificPayment;
