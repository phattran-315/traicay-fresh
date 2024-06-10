"use client";
import { Button } from "@/components/ui/button";
import useAddToCart from "@/hooks/use-add-to-cart";
import React from "react";
import { IoBagAddOutline } from "react-icons/io5";
import { ProductItemProps } from ".";
import { IUser } from "@/types/common-types";

interface ProductItemAddToCartBtnProps
  extends Pick<
      ProductItemProps,
      | "id"
      | "originalPrice"
      | "reviewQuantity"
      | "src"
      | "title"
      | "user"
      | "priceAfterDiscount"
    >,
    IUser {
}
const ProductItemAddToCartBtn = ({
  user,
  ...rest
}: ProductItemAddToCartBtnProps) => {
  const {
    handleAddItemToCart,
    isAddingError,
    isAddingToCart,
    isAddingToUserPhoneNumberCart,
    isAddingUserCartNumberError,
  } = useAddToCart({
    product: {
      ...rest,
      quantity: 1,
      thumbnailImg: rest.src,
    },
    user,
  });
  return (
    <Button
      data-cy='product-item-add-to-cart-home'
      onClick={(e) => {
        e.preventDefault();
        handleAddItemToCart();
      }}
      disabled={
        isAddingToCart ||
        isAddingError ||
        isAddingToUserPhoneNumberCart ||
        isAddingUserCartNumberError
      }
      className='flex-1'
      variant={"outline"}
    >
      <IoBagAddOutline className='w-6 h-6' />
    </Button>
  );
};

export default ProductItemAddToCartBtn;
