"use client";

import { cn } from "@/lib/utils";
import { CartProductItem, useCart } from "@/store/cart.store";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { UserCart } from "@/app/cart/types/user-cart.type";
const PING_TIME_OUT = 3000;
let initial = true;

interface HeaderCartItemProps {
  userCart: UserCart;
}
let init = true;
const HeaderCartItem = ({ userCart }: HeaderCartItemProps) => {
  const cartItemLocal = useCart((state) => state.items);
  const setCartItem = useCart((store) => store.setItem);

  const cartItemLength = cartItemLocal.length;
  const [previousCartLength, setPreviousCartLength] = useState(cartItemLength);

  // user logged in have items in cart set to the localStorage as well
  useEffect(() => {
    // logged user update to localStorage as well
    if (userCart.length && !cartItemLocal.length && init) {
      const cartItem: CartProductItem[] = userCart.map(
        ({
          product: {
            id,
            originalPrice,
            thumbnailImg,
            title,
            priceAfterDiscount,
          },
          quantity,
          discountAmount,
          coupon,
          isAppliedCoupon,
          shippingCost,
        }) => ({
          id,
          isAppliedCoupon,
          coupon,
          discountAmount,
          shippingCost,
          originalPrice,
          quantity,
          title,
          thumbnailImg,
          priceAfterDiscount,
        })
      );
      setCartItem(cartItem);
      init = false;
    }
  }, [userCart.length, setCartItem, userCart, cartItemLocal.length]);

  useEffect(() => {
    if (previousCartLength !== cartItemLength) {
      initial = false;
      const timer = setTimeout(() => {
        setPreviousCartLength(cartItemLength);
      }, PING_TIME_OUT);
      return () => clearTimeout(timer);
    }
  }, [cartItemLength, previousCartLength]);
  return (
    <>
      <IoCartOutline
        className={cn("w-7 h-7 text-gray-800 hover:text-gray-800")}
      />
      {cartItemLength > 0 && (
        <span className='absolute flex h-5 w-5 -right-[8px] -top-[6px]'>
          <span
            data-cy='cart-item-count-ping'
            className={cn(
              "absolute inline-flex h-full w-full rounded-full bg-destructive/80 opacity-75",
              {
                "animate-ping":
                  previousCartLength !== cartItemLength && !initial,
              }
            )}
          ></span>
          <span
            data-cy='cart-item-count'
            className='text-white relative inline-flex rounded-full h-5 w-5 bg-destructive/80 text-sm items-center justify-center'
          >
            {cartItemLength}
          </span>
        </span>
      )}
    </>
  );
};

export default HeaderCartItem;
