import { PropsWithChildren, useEffect, useState } from "react";

import { useMediaQuery } from "usehooks-ts";

import { IUserReview } from "../product-reviewed-of-user";
import InspectProductReviewDesktop from "./inspect-product-revew-desktop";
import InspectProductReviewMobile from "./inspect-product-review-mobile";

export interface InspectProductReviewImgsProps
  extends PropsWithChildren,
    Omit<IUserReview, "reviewId"> {
  userName: string;
  openImgIndex:number
}

export function InspectProductReviewImgs({
  userRating,
  userName,
  userReviewImgs,
  userReviewText,
  openImgIndex,
  children,
}: InspectProductReviewImgsProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleToggleState = () => {
   
    setOpen((prev) => !prev);
  }
  if (isDesktop) {
    return (
      <InspectProductReviewDesktop
      openImgIndex={openImgIndex}
        isOpen={open}
        onToggleOpenState={handleToggleState}
        userRating={userRating}
        userName={userName}
        userReviewImgs={userReviewImgs}
        userReviewText={userReviewText}
      >
        {children}
      </InspectProductReviewDesktop>
    );
  }

  return (
    <InspectProductReviewMobile
      isOpen={open}
      openImgIndex={openImgIndex}
      userName={userName}
      onToggleOpenState={handleToggleState}
      userRating={userRating}
      userReviewImgs={userReviewImgs}
      userReviewText={userReviewText}
    >
      {children}
    </InspectProductReviewMobile>
  );
}

export default InspectProductReviewImgs;
