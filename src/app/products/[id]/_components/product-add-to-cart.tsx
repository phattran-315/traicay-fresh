"use client";

import { Button } from "@/components/ui/button";
import useAddToCart from "@/hooks/use-add-to-cart";
import { CartProductItem } from "@/store/cart.store";
import { IUser } from "@/types/common-types";
import { useMediaQuery } from "usehooks-ts";

interface ProductAddToCartProps extends IUser {
  product: CartProductItem;
}

const ProductAddToCart = ({ user, product }: ProductAddToCartProps) => {
  const {
    handleAddItemToCart,
    isAddingError,
    isAddingToCart,
    isAddingToUserPhoneNumberCart,
    isAddingUserCartNumberError,
  } = useAddToCart({ product, user });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <Button
      data-cy='add-to-cart-product'
      disabled={
        isAddingError ||
        isAddingToCart ||
        isAddingUserCartNumberError ||
        isAddingToUserPhoneNumberCart
      }
      onClick={handleAddItemToCart}
      size='lg'
      className='mt-2 w-full md:m-0'
      variant='outline'
    >
      {isAddingToCart ? "Đang thêm vào giỏ" : "Thêm vào giỏ hàng"}
    </Button>
  ) : (
    <Button
      data-cy='add-to-cart-product-mobile'
      disabled={
        isAddingError ||
        isAddingToCart ||
        isAddingUserCartNumberError ||
        isAddingToUserPhoneNumberCart
      }
      onClick={handleAddItemToCart}
      size='lg'
      className='mt-2 w-full md:m-0'
      variant='outline'
    >
      {isAddingToCart ? "Đang thêm vào giỏ" : "Thêm vào giỏ hàng"}
    </Button>
  );
};

export default ProductAddToCart;
