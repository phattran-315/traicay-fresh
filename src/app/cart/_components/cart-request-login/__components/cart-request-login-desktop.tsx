import { PropsWithChildren } from "react";

import { IoCloseOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_URL } from "@/constants/navigation.constant";

import LoginByPhoneNumber from "@/components/molecules/login-by-phone-number";
import SeparatorOption from "@/components/ui/separator-option";
import { APP_URL_KEY } from "@/types/common-types";
import { CartRequestLoginProps } from "..";
interface CartRequestLoginDesktop
  extends CartRequestLoginProps,
    PropsWithChildren {}
const CartRequestLoginDesktop = ({
  isOpen,
  handleClose,
  handleOpen,
  children,
}: CartRequestLoginDesktop) => {
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        <Button variant='outline'>Thanh toán</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <div className='relative'>
          <DialogHeader className='text-center'>
            <DialogTitle className='text-lg text-center font-semibold'>
              Bạn chưa đăng nhập
            </DialogTitle>
            <DialogDescription className='text-sm text-center sm:text-base'>
              Vui lòng đăng nhập tại đây
            </DialogDescription>
            <div className='flex justify-center my-4'>{children}</div>
          </DialogHeader>
          <SeparatorOption className='mt-8' />
          <LoginByPhoneNumber
            title='Mua hàng bằng số điện thoại'
            routeToPushAfterVerifying={APP_URL.checkout as APP_URL_KEY}
          />
          <DialogClose
            asChild
            onClick={handleClose}
            className='absolute top-0 right-2'
          >
            <button>
              <IoCloseOutline className='hover:text-destructive' size={30} />
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartRequestLoginDesktop;
