"use client";
import EmptyCart from "@/components/molecules/empty-cart";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart.store";
import { IUser } from "@/types/common-types";
import { isEmailUser } from "@/utils/util.utls";
import { PropsWithChildren, useEffect } from "react";
import useCheckout from "../../hooks/use-checkout";
import CheckoutAddress from "../checkout-address";
import CheckoutDetails from "../checkout-details";
import CheckoutDiscount from "../checkout-discount";
import CheckoutNote from "../checkout-note";
import CheckoutPaymentMethods from "../checkout-payment-methods";
interface CheckoutClientProps extends IUser, PropsWithChildren {}

export enum PAYMENT_METHOD {
  "BY_CASH" = "BY_CASH",
  "MOMO" = "MOMO",
  "CREDIT_TRANSFER" = "CREDIT_TRANSFER",
  "VN_PAY" = "VN_PAY",
}
type T = Partial<IShippingAddress>;

export type IShippingAddress = {
  userName: string;
  userPhoneNumber: string;
  address: string;
  id: string;
};
const CheckoutClient = ({ user, children }: CheckoutClientProps) => {
  const {
    isSuccessCheckout,
    errors,
    register,
    handleCheckout,
    setDistrictValue,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
    totalPrice,saleAmount,
    shippingAddress,
    handleSetAddress,
    checkoutNote,
    handleSetCheckoutNotes,
    paymentMethod,
    handleSetPaymentMethod,
    isCheckingOut,
  } = useCheckout(user!);
  const clearCart = useCart((store) => store.clearCart);
  const cartItems = useCart((store) => store.items);

  // if successfully checkout clear the cart
  useEffect(() => {
    if (isSuccessCheckout) {
      clearCart();
    }
  }, [isSuccessCheckout, clearCart]);
  if (!cartItems.length) return <EmptyCart />;
  return (
    <section className='checkout-page'>
      <CheckoutAddress
        onSetName={setNameValue}
        onSetPhoneNumber={setPhoneNumberValue}
        onSetDistrict={setDistrictValue}
        defaultUserName={isEmailUser(user!) ? user.name : ""}
        defaultUserPhoneNumber={!isEmailUser(user!) ? user?.phoneNumber : ""}
        onSetWard={setWardValue}
        register={register}
        errors={errors}
        currentShippingAddressId={shippingAddress?.id}
        onSetShippingAddress={handleSetAddress}
        user={user}
      />
      {children}
      {/* <CheckoutListCart /> */}
      <CheckoutNote
        onSetCheckoutNotes={handleSetCheckoutNotes}
        notes={checkoutNote}
      />
      <CheckoutDiscount user={user} />
      <CheckoutPaymentMethods
      totalPrice={50000}
        method={paymentMethod}
        onSetPaymentMethod={handleSetPaymentMethod}
      />
      <CheckoutDetails paymentMethod={paymentMethod}  totalAmount={totalPrice} saleAmount={saleAmount}/>
      <Button
        disabled={isCheckingOut}
        onClick={handleCheckout}
        className='mt-6 w-full'
        data-cy='submit-btn-checkout'
      >
        {isCheckingOut ? "Thanh toán..." : "Thanh toán"}
      </Button>
    </section>
  );
};

export default CheckoutClient;
