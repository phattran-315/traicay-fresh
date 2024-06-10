"use client";
import { memo } from "react";

import PageSubTitle from "@/components/ui/page-subTitle";
import { cn } from "@/lib/utils";
import { formatPriceToVND } from "@/utils/util.utls";
import {
  DEFAULT_SHIPPING_FREE,
  FREESHIP_BY_CASH_FROM,
  FREESHIP_FROM,
} from "@/constants/configs.constant";
import { PAYMENT_METHOD } from "../checkout-client";

interface CheckoutDetailsBuyNowProps {
  price: number;
  quantity: number;
  discount?: number;
  paymentMethod:PAYMENT_METHOD
}
const CheckoutDetailsBuyNow = ({
  price,
  paymentMethod,
  discount,
  quantity,
}: CheckoutDetailsBuyNowProps) => {
  const tempPrice = price * quantity;
  const totalPrice = discount
    ? tempPrice - (tempPrice * discount) / 100
    : tempPrice;

  const saleAmount = discount ? (tempPrice * discount) / 100 : 0;
  let shippingFee = DEFAULT_SHIPPING_FREE;
  if (
    paymentMethod === PAYMENT_METHOD.BY_CASH &&
    tempPrice >= FREESHIP_BY_CASH_FROM
  ) {
    shippingFee = 0;
  }
  if (
    (paymentMethod === PAYMENT_METHOD.MOMO || paymentMethod === PAYMENT_METHOD.VN_PAY) &&
    tempPrice >= FREESHIP_FROM
  ) {
    shippingFee = 0;
  }


  return (
    <div>
      <PageSubTitle>Chi tiết thanh toán</PageSubTitle>
      <div data-cy='payment-details-box' className='space-y-2'>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p data-cy='payment-detail-title' className='font-bold'>
            Tổng tiền sản phẩm
          </p>
          <p data-cy='payment-detail-value'>{formatPriceToVND(tempPrice)}</p>
        </div>
        {Boolean(saleAmount) && (
          <div
            data-cy='payment-detail'
            className='flex items-center justify-between'
          >
            <p data-cy='payment-detail-title' className='font-bold'>
              Giảm giá
            </p>
            <p
              data-cy='payment-detail-value'
              className={cn("font-semibold", {
                "text-primary": saleAmount,
              })}
            >
              {saleAmount ? `-${formatPriceToVND(saleAmount)}` : 0}
            </p>
          </div>
        )}
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p data-cy='payment-detail-title' className='font-bold'>
            Phí vận chuyển
          </p>
          <p data-cy='payment-detail-value'>
            {shippingFee ? formatPriceToVND(shippingFee) : 0}
          </p>
        </div>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between mt-2'
        >
          <p data-cy='payment-detail-title' className='font-bold text-xl'>
            Thành tiền
          </p>
          <p
            data-cy='payment-detail-value'
            className='text-destructive font-bold text-xl mt-2'
          >
            {formatPriceToVND(totalPrice+shippingFee)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(CheckoutDetailsBuyNow);
