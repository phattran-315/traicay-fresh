"use client";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { APP_URL } from "@/constants/navigation.constant";
import { useCart } from "@/store/cart.store";
import { IUser } from "@/types/common-types";
import { formatPriceToVND } from "@/utils/util.utls";
import Link from "next/link";
import CartRequestLogin from "./cart-request-login";

interface CartSummaryProps extends IUser {}
const CartSummary = ({ user }: CartSummaryProps) => {
  const cartItems = useCart((store) => store.items);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * (item?.priceAfterDiscount|| item.originalPrice),
    0
  );
  const [isOpenLoginRequest, setIsOpenLoginRequest] = useState(false);
  if(!totalPrice) return null
  return (
    <div className='mt-10 md:m-0 md:py-3 md:px-6 md:border md:border-gray-200 rounded-md'>
      <div className='flex gap-2 flex-col'>
        <p className='font-semibold'>Tạm tính</p>
        <p
          data-cy='cart-summary-total'
          className='text-destructive font-semibold text-lg'
        >
          {formatPriceToVND(totalPrice)}
        </p>
      </div>
      <div className="mt-2">
      {user ? (
        <Link href={APP_URL.checkout} className={buttonVariants({variant:'default',className:'mt-4'})}>Thanh toán ngay</Link>
      ) : (
        <CartRequestLogin
          isOpen={isOpenLoginRequest}
          handleClose={() => setIsOpenLoginRequest(false)}
          handleOpen={() => setIsOpenLoginRequest(true)}
        />
      )}
      </div>
      <div className="mt-4">
        <p className="text-muted-foreground text-sm">Tổng đơn hàng (2) sản phẩm</p>
      </div>
    </div>
  );
};

export default CartSummary;
