import Image from "next/image";
import React, { ChangeEvent } from "react";
import ProductReviewSelectRating from "./product-review-select-rating";
import ProductReviewText from "./product-review-text";
import ProductReviewPickImgs from "./product-review-pick-imgs";
import ProductReviewSelectedImgs from "./prduct-review-selected-imgs";
import { ISelectedImg, IProductModifyReview } from "..";
import { getImgUrlMedia } from "@/utils/util.utls";
import { useMediaQuery } from "usehooks-ts";
interface ProductReviewContent extends Omit<IProductModifyReview,'user'|'onSetOpenState'> {
  formStateRating: string[] | undefined;
  selectedRating: number;
  formStateImg: string[] | undefined;
  onSetRating: (rating: number) => void;
  reviewText: string;
  onSetReviewText: (review: string) => void;
  onPickImgs: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedImgs: ISelectedImg[];
  onRemoveSelectedImg: (id: string) => void;
  userSelectedImgs?: ISelectedImg[] | undefined;
}
const ProductReviewContent = ({
  type,
  userSelectedImgs,
  reviewText,
  reviewId,
  formStateRating,
  title,
  imgSrc,
  selectedImgs,
  selectedRating,
  onSetRating,
  onPickImgs,
  onRemoveSelectedImg,
  onSetReviewText,
}: ProductReviewContent) => {
  const imgSource = getImgUrlMedia(imgSrc);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-center gap-3 relative'>
        <h2>{title} </h2>

        <Image
          src={imgSource || ""}
          alt='Product img'
          height={isDesktop ? 100 : 60}
          width={isDesktop ? 100 : 60}
        />
      </div>
      <ProductReviewSelectRating
        formStateRating={formStateRating}
        selectedRating={selectedRating}
        onSelectRating={onSetRating}
      />

      <ProductReviewText
        reviewText={reviewText}
        onChangeReviewText={onSetReviewText}
      />
      <ProductReviewPickImgs
        onPickImgs={onPickImgs}
        selectedImgLength={selectedImgs.length}
      />
      <ProductReviewSelectedImgs
        reviewId={reviewId||''}
        type={type}
        formStateImgs={formStateRating}
        userSelectedImgs={userSelectedImgs}
        onRemoveReviewImg={onRemoveSelectedImg}
        selectedImgs={selectedImgs}
      />
    </div>
  );
};

export default ProductReviewContent;
