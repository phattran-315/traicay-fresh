import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PropsWithChildren } from "react";
import { IUserReview } from "../product-reviewed-of-user";
import { ISheetDialogState } from "@/types/common-types";
import { Button } from "@/components/ui/button";
import { IoCloseOutline } from "react-icons/io5";
import { InspectProductReviewImgsProps } from ".";
import InspectProductReviewSlider from "./inspect-product-review-slider";
import ReviewRating from "@/components/ui/review-rating/review-rating";

interface InspectProductReviewDesktopProps
  extends PropsWithChildren,
    InspectProductReviewImgsProps,
    ISheetDialogState {}

const InspectProductReviewDesktop = ({
  userRating,
  userReviewImgs,
  userReviewText,
  userName,
  isOpen,
  openImgIndex,
  onToggleOpenState,
  children,
}: InspectProductReviewDesktopProps) => {
  const [Slider, ImgNavigator] = InspectProductReviewSlider({
    openImgIndex,
    imgs: userReviewImgs,
  });
  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={onToggleOpenState} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='!p-0 max-w-3xl bg-white/90 backdrop-blur-sm flex items-center'>
        <div className='w-full aspect-square py-[10%] px-[5%]'>
          <div className='flex gap-4 h-full'>
            <div className='flex-1 w-1/2 h-full'>
              {Slider}
              <div className='mt-4'>{ImgNavigator}</div>
            </div>
            <div className='flex-1 space-y-4'>
              <div className='font-bold'> {userName}</div>
              <div>
                <ReviewRating ratingAverage={userRating} />
              </div>
              <div>{userReviewText}</div>
            </div>
          </div>
        </div>
        <button
          onClick={onToggleOpenState}
          className='absolute top-[2%] right-[2%] text-destructive'
        >
          <IoCloseOutline size={45} className='hover:text-destructive/80' />
        </button>
      </DialogContent>

      {/* <div className="fixed bg-blue-200 inset-0 z-[9999]"></div> */}
    </Dialog>
  );
};

export default InspectProductReviewDesktop;
