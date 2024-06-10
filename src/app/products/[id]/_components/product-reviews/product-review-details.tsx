import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReviewRating from "@/components/ui/review-rating/review-rating";
import { cn } from "@/lib/utils";
import { Review } from "@/payload/payload-types";
import Image from "next/image";
import React from "react";
import InspectProductReviewImgs from "./inspect-product-review";
import { IUser } from "@/types/common-types";
interface ProductReviewDetailsProps extends IUser{
  name: string;
  review: Review["reviewText"];
  reviewImgs: Review["reviewImgs"];
  rating: Review["rating"];
  reviewOfUserId?:string
}
function ProductReviewDetails({
  name,
  review,
  rating,
  user,
  reviewImgs,
  reviewOfUserId
}: ProductReviewDetailsProps) {

  return (
    <div className='flex gap-4'>
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>PT</AvatarFallback>
      </Avatar>
      <div>
        <div className={cn("mb-2", { "mb-0": !review })}>
          <p className='font-bold'>{name}</p>
          <div className="flex items-center">
          <ReviewRating ratingAverage={5} />
          {user && user.id===reviewOfUserId && <p className="ml-2 text-xs italic">(đánh giá của bạn)</p>}
          </div>
        </div>
        <p className='max-h-[200px] line-clamp-6 overflow-y-hidden text-ellipsis'>
          {review}
        </p>

        {/* div imgs  max width max height 180*/}
        {reviewImgs && (
          <div className='flex gap-3 items-center'>
            {reviewImgs.map((reviewImg, index) => {
              const imgSrc =
                typeof reviewImg.reviewImg === "object"
                  ? reviewImg.reviewImg?.url
                  : reviewImg.reviewImg;
              return (
                <React.Fragment key={reviewImg.id}>
                  <InspectProductReviewImgs
                    userRating={rating}
                    userName={name}
                    openImgIndex={index}
                    userReviewImgs={reviewImgs}
                    userReviewText={review}
                  >
                    <div
                      className={cn(
                        "relative w-[80px] h-[80px] cursor-pointer overflow-hidden rounded-md md:w-[150px] md:h-[150px]",
                    
                      )}
                    >
                      <Image
                        fill
                        className='object-cover object-center'
                        src={imgSrc || ""}
                        alt='Review img of user'
                      />
                    </div>
                  </InspectProductReviewImgs>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductReviewDetails;
