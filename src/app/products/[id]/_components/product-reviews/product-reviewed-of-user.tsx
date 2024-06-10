"use client";
import ButtonDelete from "@/components/atoms/button-delete";
import ProductModifyReview from "@/components/molecules/product-modify-review";
import PageSubTitle from "@/components/ui/page-subTitle";
import useDisableClicking from "@/hooks/use-disable-clicking";
import { cn } from "@/lib/utils";
import { Product, Review } from "@/payload/payload-types";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ProductReviewDetails from "./product-review-details";

export interface IUserReview {
  userRating: Review["rating"];
  userReviewImgs: Review["reviewImgs"];
  userReviewText: Review["reviewText"];
  reviewId: Review["id"];
}

interface ProductReviewOfUserProps extends IUser, IUserReview {
  userName: string;
  reviewId: string;
  productThumbnailImg: Product["thumbnailImg"];
  title: Product["title"];
  productId: string;
}
const ProductReviewOfUser = ({
  userName,
  productId,
  user,
  userRating,
  userReviewImgs,
  userReviewText,
  productThumbnailImg,
  title,
  reviewId,
}: ProductReviewOfUserProps) => {
  const [productModifyKey, setIsProductModifyOpenKey] = useState("0");
  const { handleSetMutatingState } = useDisableClicking();
  const setProductModifyState = useCallback((key: string) => {
    setIsProductModifyOpenKey(key);
  }, []);
  const router = useRouter();

  const { isPending: isDeletingReview, mutate: deleteReview } =
    trpc.review.deleteReview.useMutation({
      onError: (err) => handleTrpcErrors(err),
      onSuccess: (data) => handleTrpcSuccess(router, data?.message),
    });

  const isMutating = isDeletingReview;
  useEffect(() => {
    if (isMutating) {
      handleSetMutatingState(true);
    }
    if (!isMutating) {
      handleSetMutatingState(false);
    }
  }, [isMutating, handleSetMutatingState]);
  return (
    <div className='mt-4 mb-6 md:mt-8 md:mb-10'>
      <PageSubTitle className='mb-2 text-sm md:text-base'>Đánh giá của bạn:</PageSubTitle>
      <div className='mt-4'>
        <ProductReviewDetails
          rating={userRating}
          user={user}
          reviewImgs={userReviewImgs}
          name={userName}
          review={userReviewText}
        />
        <div className='grid grid-cols-[40px_1fr] gap-4'>
          <div></div>
          <div
            className={cn("flex gap-4 mt-2", {
              "mt-3": userReviewText,
            })}
          >
            <ProductModifyReview
              key={productModifyKey}
              onSetOpenState={setProductModifyState}
              reviewId={reviewId}
              imgSrc={productThumbnailImg}
              productId={productId}
              userRating={userRating}
              userReviewImgs={userReviewImgs}
              userReviewText={userReviewText}
              user={user}
              title={title}
              type={"adjust"}
            />
            <ButtonDelete
              onClick={() => {
                deleteReview({ reviewId });
              }}
              disabled={isMutating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewOfUser;
