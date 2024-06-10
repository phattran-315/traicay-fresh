import { ISheetDialogState } from "@/types/common-types";
import { PropsWithChildren, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

import ReviewRating from "@/components/ui/review-rating/review-rating";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { InspectProductReviewImgsProps } from ".";
import InspectProductReviewSlider from "./inspect-product-review-slider";

interface InspectProductReviewMobileProps
  extends PropsWithChildren,
    InspectProductReviewImgsProps,
    ISheetDialogState {}


const InspectProductReviewMobile = ({
  children,
  onToggleOpenState,
  isOpen,
  openImgIndex,
  userName,
  userRating,
  userReviewImgs,
  userReviewText,
}: InspectProductReviewMobileProps) => {
  const [Slider,ImgNavigation]=InspectProductReviewSlider({openImgIndex,imgs:userReviewImgs})
  const [isExpandedText, setIsExpandedText] = useState(false);



  return (
    <Sheet  open={isOpen}>
      <SheetTrigger onClick={onToggleOpenState} asChild>
        {children}
      </SheetTrigger>
      <SheetContent
        side='bottom'
        className='h-[97vh] bg-black/60 backdrop-blur-sm flex items-center'
      >
        <div className='w-full'>
          <div className='relative w-full h-[300px] mt-8'>
          {Slider}
          </div>
          <div className='mt-6 text-white'>Đánh giá của {userName}</div>
          <div className='mt-6'>
            <ReviewRating ratingAverage={userRating} />
          </div>
          <div>
            <div className='flex items-center'>
              <p
                className={cn(
                  "text-lg sm:text-3xl mt-4 text-white line-clamp-1",
                  {
                    "line-clamp-none": isExpandedText,
                  }
                )}
              >
                {userReviewText} 
              </p>
              {!isExpandedText && (
                <button
                  onClick={() => setIsExpandedText(true)}
                  className='text-primary whitespace-nowrap'
                >
                  See more
                </button>
              )}
            </div>
          </div>
          <div className="mt-8">
         {ImgNavigation}

          </div>
        </div>
        <SheetClose asChild>
          <button
            onClick={onToggleOpenState}
            className='absolute top-[2%] right-[4%] text-white hover:text-destructive'
          >
            <IoCloseOutline size={30} />
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default InspectProductReviewMobile;
