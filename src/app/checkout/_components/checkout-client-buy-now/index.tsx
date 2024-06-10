"use client";
import CartItem from "@/components/molecules/cart-list/cart-item";
import { Button } from "@/components/ui/button";
import PageSubTitle from "@/components/ui/page-subTitle";
import { Product } from "@/payload/payload-types";
import { IUser } from "@/types/common-types";
import { isEmailUser } from "@/utils/util.utls";
import useCheckout from "../../hooks/use-checkout";
import CheckoutAddress from "../checkout-address";
import CheckoutDetailsBuyNow from "../checkout-details-buy-now";
import CheckoutDiscountBuyNow from "../checkout-discount-buy-now";
import CheckoutNote from "../checkout-note";
import CheckoutPaymentMethods from "../checkout-payment-methods";
interface CheckoutClientBuyNowProps extends IUser {
  product: Product;
}

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
const CheckoutClientBuyNow = ({ user, product }: CheckoutClientBuyNowProps) => {
  const {
    isSuccessCheckout,
    quantity,
    handleSetQuantity,
    errors,
    register,
    discount: { discountAmount },
    handleCheckout,
    handleSetDiscount,
    setDistrictValue,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
    shippingAddress,
    handleSetAddress,
    checkoutNote,
    totalPrice,
    paymentMethod,
    saleAmount,
    handleSetCheckoutNotes,
    handleSetPaymentMethod,
    isCheckingOut,
  } = useCheckout(user!, "buy-now", product);

  // if successfully checkout clear the cart

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
      <div className='mt-8'>
        <PageSubTitle>Sản phẩm</PageSubTitle>
        <ul>
          <CartItem
            src={product.thumbnailImg}
            isMutatingUserCart={false}
            title={product.title}
            priceAfterDiscount={product.priceAfterDiscount}
            originalPrice={product.originalPrice}
            quantity={quantity}
            type='buy-now'
            id={product.id}
            onSetUserCart={() => {}}
            onSetQuantity={handleSetQuantity}
          />
        </ul>
      </div>
      {/* <CheckoutListCart /> */}
      <CheckoutNote
        onSetCheckoutNotes={handleSetCheckoutNotes}
        notes={checkoutNote}
      />
      <CheckoutDiscountBuyNow
        onSetDiscountAmount={handleSetDiscount}
        discountAmount={discountAmount}
      />
      <CheckoutPaymentMethods
        totalPrice={totalPrice}
        method={paymentMethod}
        onSetPaymentMethod={handleSetPaymentMethod}
      />
      <CheckoutDetailsBuyNow
      paymentMethod={paymentMethod}
        discount={discountAmount}
        quantity={quantity}
        price={product.priceAfterDiscount || product.originalPrice}
      />
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

export default CheckoutClientBuyNow;
