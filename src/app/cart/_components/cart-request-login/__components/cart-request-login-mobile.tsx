import { IoCloseOutline } from "react-icons/io5";


import SeparatorOption from "@/components/ui/separator-option";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";
import { APP_URL_KEY } from "@/types/common-types";
import { PropsWithChildren } from "react";
import { CartRequestLoginProps } from "..";
import LoginByPhoneNumber from "@/components/molecules/login-by-phone-number";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface CartRequestLoginMobileProps
  extends CartRequestLoginProps,
    PropsWithChildren {}
const CartRequestLoginMobile = ({
  isOpen,
  handleClose,
  handleOpen,
  children,
}: CartRequestLoginMobileProps) => {
  const searchParams = useSearchParams();
  const isOpenOtp = searchParams.get(APP_PARAMS.isOpenOtp);
  return (
    <Sheet open={isOpen}>
      <SheetTrigger asChild onClick={handleOpen}>
        <Button variant='outline'>Thanh toán</Button>
      </SheetTrigger>
      <SheetContent side='bottom' style={{ height:isOpenOtp && isOpenOtp==='true'? "80vh" :"60vh"}}>
        <div className='mx-auto w-4/5 pb-6 max-w-sm h-[50vh]'>
          <SheetHeader>
            <SheetTitle className='text-lg text-center font-semibold'>
              Bạn chưa đăng nhập
            </SheetTitle>
            <SheetDescription className='text-sm text-center sm:text-base'>
              Vui lòng đăng nhập tại đây
            </SheetDescription>
            <div className='flex justify-center my-2'>{children}</div>
          </SheetHeader>
          <SeparatorOption />
          <LoginByPhoneNumber
            title='Mua hàng bằng số điện thoại'
            routeToPushAfterVerifying={APP_URL.checkout as APP_URL_KEY}
          />

          <SheetClose
            onClick={handleClose}
            className='absolute top-[5%] right-[8%]'
            asChild
          >
            <button>
              <IoCloseOutline className='hover:text-destructive' size={30} />
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartRequestLoginMobile;
