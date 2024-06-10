"use client";
import { useEffect } from "react";


import { UserCart } from "@/app/cart/types/user-cart.type";
import { Product } from "@/payload/payload-types";
import { CartProductItem, useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";

import useDisableClicking from "@/hooks/use-disable-clicking";
import { useRouter } from "next/navigation";
import EmptyCart from "../empty-cart";
import CartItem from "./cart-item";

interface CartListProps extends IUser {
  userCart: UserCart;
}

const CartList = ({ user, userCart }: CartListProps) => {
  const {handleSetMutatingState}=useDisableClicking()
  const router=useRouter()
  const cartItemLocal = useCart((store) => store.items);
  const cartItems = cartItemLocal;

  const { mutate: setUserCart, isPending: isSettingUserCart } =
    trpc.user.setUserCart.useMutation({
      onSuccess:()=>{
        router.refresh()
      }
    });
  const {
    mutate: setUserPhoneNumberCart,
    isPending: isSettingUserPhoneNumberCart,
  } = trpc.customerPhoneNumber.setUserCart.useMutation({
    onSuccess:()=>{
      router.refresh()
    }
  });


  const cartItemIds = cartItems.map((item) => item.id);
  const { data: productsRemote, refetch: getProductPrice } =
    trpc.products.getProductsPrice.useQuery(
      { ids: cartItemIds },
      { enabled: false }
    );

  const updateCartItem = useCart((store) => store.updateItem);
  const setCartItem = useCart((store) => store.setItem);

  const handleSetUserCart=(cartItems:(CartProductItem & {product:string})[])=>{
    if(user && 'email' in user){
      setUserCart(cartItems)
      return
    }
    setUserPhoneNumberCart(cartItems)
  }


  useEffect(() => {
    // if user is logged no need to send request

    if (cartItemIds.length && !userCart.length && !user) {
      getProductPrice();
    }
  }, [cartItemIds, getProductPrice, userCart.length, user]);

  // after user login update userCart

  useEffect(() => {
    // to ensure the price is matches between local and remote
    function comparePrices(
      localProducts: CartProductItem[],
      remoteProducts: Product[] | undefined
    ): void {
      if (!remoteProducts) return;
      const remotePricesMap = new Map<string, number>();
      remoteProducts.forEach((product) => {
        remotePricesMap.set(product.id, product.originalPrice);
      });

      // Compare prices
      localProducts.forEach((localProduct) => {
        const remotePrice = remotePricesMap.get(localProduct.id);
        if (remotePrice) {
          if (localProduct.originalPrice !== remotePrice) {
            updateCartItem({
              id: localProduct.id,
              data: { originalPrice: remotePrice },
            });
          }
        }
      });
    }
    // if user is logged no need to send request
    if (productsRemote?.length && !userCart.length) {
      comparePrices(cartItems, productsRemote);
    }
  }, [
    productsRemote?.length,
    productsRemote,
    cartItems,
    updateCartItem,
    userCart.length,
  ]);

const isMutating=isSettingUserCart||
isSettingUserPhoneNumberCart

useEffect(()=>{
  if(isMutating){
    handleSetMutatingState(true)
  }
  if(!isMutating){
    handleSetMutatingState(false)

  }
},[isMutating,handleSetMutatingState])


  if (!cartItems.length) return <EmptyCart />;

  return (
    <ul data-cy='cart-list' className='mt-6 space-y-6 md:m-0 md:flex-1'>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          isMutatingUserCart={isSettingUserCart||isSettingUserPhoneNumberCart}
          onSetUserCart={handleSetUserCart}
          id={item.id}
          priceAfterDiscount={item.priceAfterDiscount}
          originalPrice={item.originalPrice}
          quantity={item.quantity}
          src={item.thumbnailImg}
          title={item.title}
        />
      ))}
    </ul>
  );
};

export default CartList;
