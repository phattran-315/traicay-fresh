import { PropsWithChildren, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { IoCloseOutline } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";
interface ProductInspectReviewImgProps extends PropsWithChildren {}
export function ProductInspectReviewImg({
  children,
}: ProductInspectReviewImgProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const toggleOpenState = () => setOpen((prev) => !prev);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div onClick={toggleOpenState} >
            {children}
          </div>
        </DialogTrigger>
        <DialogContent className='!p-0 max-w-3xl bg-white/90 backdrop-blur-sm flex items-center'>
          <div className='w-full aspect-square'>{children}</div>
       
          <button
            onClick={toggleOpenState}
            className='absolute top-[2%] right-[2%] text-destructive'
          >
            <IoCloseOutline size={45} className='hover:text-destructive/80' />
          </button>
        </DialogContent>
       
        {/* <div className="fixed bg-blue-200 inset-0 z-[9999]"></div> */}

      </Dialog>
     

    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div onClick={toggleOpenState}>
          {children}
        </div>
      </SheetTrigger>
      <SheetContent
        side='bottom'
        className='h-screen bg-white/90 backdrop-blur-sm flex items-center'
      >
        <div className='w-full mx-auto aspect-square relative'>{children}</div>
        <SheetClose asChild>
          <button
            onClick={toggleOpenState}
            className='absolute top-[2%] right-[4%]'
          >
            <IoCloseOutline size={30} className='hover:text-destructive' />
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

export default ProductInspectReviewImg;
