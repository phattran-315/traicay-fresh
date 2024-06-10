"use client";
import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";

import { buttonVariants } from "@/components/ui/button";
import { APP_URL } from "@/constants/navigation.constant";

import CartRequestLoginDesktop from "./__components/cart-request-login-desktop";
import CartRequestLoginMobile from "./__components/cart-request-login-mobile";

export interface CartRequestLoginProps {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}
export function CartRequestLogin({
  isOpen,
  handleClose,
  handleOpen,
}: CartRequestLoginProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const LinkLogin = (
    <Link
      href={{
        pathname: APP_URL.login,
        query: { origin: APP_URL.checkout.slice(1) },
      }}
      className={buttonVariants({
        variant: "link",
        size: "lg",
        className: "w-1/2 text-lg",
      })}
    >
      Đăng nhập
    </Link>
  );
  const BtnClose = (
    <button>
      <IoCloseOutline className='hover:text-destructive' size={30} />
    </button>
  );
  if (isDesktop) {
    <CartRequestLoginDesktop
    isOpen={isOpen}
    handleClose={handleClose}
    handleOpen={handleOpen}
  >
    {LinkLogin}
  </CartRequestLoginDesktop>
  }

  return (
    <CartRequestLoginMobile
      isOpen={isOpen}
      handleClose={handleClose}
      handleOpen={handleOpen}
    >
      {LinkLogin}
    </CartRequestLoginMobile>
  );
}

export default CartRequestLogin;
