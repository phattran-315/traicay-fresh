"use client";

import { IUserReview } from "@/app/products/[id]/_components/product-reviews/product-reviewed-of-user";
import { GENERAL_ERROR_MESSAGE } from "@/constants/api-messages.constant";
import { ALLOW_UPLOAD_IMG_LENGTH } from "@/constants/configs.constant";
import { Media, Product } from "@/payload/payload-types";
import { IUser } from "@/types/common-types";
import { isEmailUser } from "@/utils/util.utls";
import { isEqual } from "lodash";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import ProductReviewContent from "./_components/product-review-content";
import ProductReviewDesktop from "./_components/product-review-desktop";
import ProductReviewMobile from "./_components/product-review-mobile";
import { createNewReview, updateReview } from "./actions/review.action";

export interface IProductModifyReview extends IUser, Partial<IUserReview> {
  title: string;
  imgSrc: Product["thumbnailImg"];
  productId: string;
  type?: "add" | "adjust";
  onSetOpenState?: (key: string) => void;
}
export interface ISelectedImg {
  id: string;
  img: File | string;
}

const ProductModifyReview = ({
  user,
  title,
  onSetOpenState,
  userRating,
  reviewId,
  userReviewImgs,
  userReviewText,
  type = "add",
  imgSrc,
  productId,
}: IProductModifyReview) => {
  const parsedUserReviewImgs = userReviewImgs?.map((img) => {
    const reviewImgFile = img.reviewImg! as Media;
    const reviewImgUrl = reviewImgFile.url!;
    return { id: reviewImgFile.id!, img: reviewImgUrl };
  });

  const router = useRouter();
  const [openAddProductReviewModal, setOpenAddProductReviewModal] =
    useState(false);
  const [isSubmittingTheForm, setIsSubmittingTheForm] = useState(false);
  const handleSetSubmitFormState = () => setIsSubmittingTheForm(true);
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const selectImgsFormDataRef = useRef(new FormData());
  const [selectedImgs, setSelectedImgs] = useState<ISelectedImg[]>(
    parsedUserReviewImgs || []
  );
  const [review, setReview] = useState(userReviewText || "");

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleChangeReviewText = (reviewText: string) => setReview(reviewText);
  const handleSetRating = (rating: number) => setSelectedRating(rating);

  const handlePickImgs = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      if (
        files.length > ALLOW_UPLOAD_IMG_LENGTH ||
        selectedImgs.length + files.length > ALLOW_UPLOAD_IMG_LENGTH
      ) {
        alert(
          `Chỉ cho phép tối đa ${ALLOW_UPLOAD_IMG_LENGTH} ảnh. Quý khách vui lòng gửi lại`
        );
        return;
      }
      for (let i = 0; i < files.length; i++) {
        // get imgs url
        try {
          const file = files[i];

          // imageSchema.parse({ img: file });

          setSelectedImgs((prev) => [
            ...prev,
            { id: crypto.randomUUID(), img: file },
          ]);
          if (files.length === 1) {
            selectImgsFormDataRef.current.append(
              `img-${selectedImgs.length + 1}`,
              file
            );
          }
          if (!selectedImgs.length && files.length > 1) {
            selectImgsFormDataRef.current.append(`img-${i + 1}`, file);
          }
          if (selectedImgs.length && files.length > 1) {
            selectImgsFormDataRef.current.append(
              `img-${selectedImgs.length + i + 1}`,
              file
            );
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errMsg = error.errors[0].message || GENERAL_ERROR_MESSAGE;
            toast.error(errMsg);
          } else {
            // Some other error occurred
            toast.error(GENERAL_ERROR_MESSAGE);
          }
        }
      }
    }
  };
  const handleRemoveSelectedImg = (id: string) => {
    setSelectedImgs((prev) => prev.filter((img) => img.id !== id));
  };
  const isNotModified =
    isEqual(userReviewText, review) &&
    isEqual(parsedUserReviewImgs, selectedImgs) &&
    isEqual(selectedRating, userRating);
  const reviewAction =
    type === "add"
      ? createNewReview.bind(null, {
          user: {
            relationTo: isEmailUser(user!)
              ? "customers"
              : "customer-phone-number",
            value: user!.id,
          },
          reviewText: review,
          product: productId,
          rating: selectedRating,
          reviewImgsFormData: selectImgsFormDataRef.current,
        })
      : updateReview.bind(null, {
          user: {
            relationTo: isEmailUser(user!)
              ? "customers"
              : "customer-phone-number",
            value: user!.id,
          },
          product: productId,
          reviewText: review,
          isNotModified,
          rating: selectedRating,
          reviewImgsFormData: selectImgsFormDataRef.current,
          reviewId: reviewId || "",
        });
  const [formState, formAction] = useFormState(reviewAction, null);
  const ReviewContent = (
    <ProductReviewContent
      key={String(openAddProductReviewModal)}
      onPickImgs={handlePickImgs}
      onRemoveSelectedImg={handleRemoveSelectedImg}
      onSetRating={handleSetRating}
      imgSrc={imgSrc}
      userSelectedImgs={parsedUserReviewImgs}
      type={type}
      userRating={userRating}
      userReviewImgs={userReviewImgs}
      userReviewText={userReviewText}
      reviewId={reviewId}
      productId={productId}
      onSetReviewText={handleChangeReviewText}
      formStateImg={formState?.img}
      formStateRating={formState?.rating}
      selectedImgs={selectedImgs}
      selectedRating={selectedRating}
      reviewText={review}
      title={title}
    />
  );
  const toggleOpenModalProductAddReviewState = useCallback(() => {
    if (openAddProductReviewModal && onSetOpenState) {
      onSetOpenState(crypto.randomUUID());
    }

    setOpenAddProductReviewModal((prev) => !prev);
  }, [onSetOpenState, openAddProductReviewModal]);

  useEffect(() => {
    if (formState?.user) {
      toast.error(formState.user[0]);
    }
  }, [formState?.user]);
  useEffect(() => {
    if (formState?.success && formState.success[0] === "true") {
      setOpenAddProductReviewModal(false);

      toast.success(
        type === "add" ? "Cảm ơn bạn đã đánh giá" : "Sửa đánh giá thành công"
      );
      router.refresh();

      toggleOpenModalProductAddReviewState();
    }
  }, [formState?.success, router, type, toggleOpenModalProductAddReviewState]);
  if (isDesktop) {
    return (
      <ProductReviewDesktop
        type={type}
        selectedRating={selectedRating}
        createReviewAction={formAction}
        isOpen={openAddProductReviewModal}
        onToggleModalState={toggleOpenModalProductAddReviewState}
        isSubmitting={isSubmittingTheForm}
        onSetIsSubmittingTheForm={handleSetSubmitFormState}
      >
        {ReviewContent}
      </ProductReviewDesktop>
    );
  }

  return (
    <ProductReviewMobile
      selectedRating={selectedRating}
      type={type}
      isSubmitting={isSubmittingTheForm}
      onSetIsSubmittingTheForm={handleSetSubmitFormState}
      onToggleModalState={toggleOpenModalProductAddReviewState}
      isOpen={openAddProductReviewModal}
      createReviewAction={formAction}
      selectedImgLength={selectedImgs.length}
    >
      {ReviewContent}
    </ProductReviewMobile>
  );
};
export default ProductModifyReview;
