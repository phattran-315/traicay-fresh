"use client";
import { IoCloseOutline } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";

import LoginByPhoneNumber from "@/components/molecules/login-by-phone-number";
import { APP_URL_KEY } from "@/types/common-types";
import { useSearchParams } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";

interface LoginByPhoneNumberAlternativeProps {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  origin: string;
}
export function LoginByPhoneNumberAlternative({
  origin,
  isOpen,
  handleClose,
  handleOpen,
}: LoginByPhoneNumberAlternativeProps) {
  const searchParams = useSearchParams();
  const isOpenOtp = searchParams.get(APP_PARAMS.isOpenOtp);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <div data-cy='login-by-phone-number-alternative'>
        <Dialog open={isOpen}>
          <DialogTrigger asChild onClick={handleOpen}>
            <Button variant='outline'>Đăng nhập bằng số điện thoại</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-2xl'>
            <LoginByPhoneNumber
              title='Đăng nhập bằng số điện thoại'
              routeToPushAfterVerifying={
                (origin || APP_URL.home) as APP_URL_KEY
              }
            />
            <DialogClose
              onClick={handleClose}
              className='absolute top-[5%] right-[4%]'
              asChild
            >
              <IoCloseOutline className='cursor-pointer hover:text-destructive' size={30} />
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div data-cy='login-by-phone-number-alternative'>
      <Sheet  open={isOpen}>
        <SheetTrigger asChild onClick={handleOpen}>
          <Button variant='outline'>Đăng nhập bằng số điện thoại</Button>
        </SheetTrigger>
        <SheetContent
        side={'bottom'}
          style={{
            height: isOpenOtp === "false" || !isOpenOtp ? "35vh" : "70vh",
          }}
        >
          <div className='mx-auto w-4/5 pb-6 max-w-sm h-[50vh]'>
            <LoginByPhoneNumber
              title=' Đăng nhập bằng số điện thoại'
              routeToPushAfterVerifying={
                (origin || APP_URL.home) as APP_URL_KEY
              }
            />

            <button
              onClick={handleClose}
              className='absolute top-[2%] right-[4%]'
            >
              <IoCloseOutline className='hover:text-destructive' size={30} />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default LoginByPhoneNumberAlternative;
