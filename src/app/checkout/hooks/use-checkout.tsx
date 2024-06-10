import useAddress from "@/hooks/use-address";
import useDisableClicking from "@/hooks/use-disable-clicking";
import { Customer, CustomerPhoneNumber, Product } from "@/payload/payload-types";
import { useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { formUserAddress, isEmailUser } from "@/utils/util.utls";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IShippingAddress,
  PAYMENT_METHOD,
} from "../_components/checkout-client";

const useCheckout = (
  user: CustomerPhoneNumber | Customer,
  type: "buy-now" | "cart" = "cart",
  product?:Product
) => {
  const searchParams = useSearchParams();
  const currentQuantityOptionParams =
    searchParams.get("quantity") || 1;
  const currentQuantityOption =
    // do not allow buy above 16kg in the app
    currentQuantityOptionParams &&
    +currentQuantityOptionParams > 0 &&
    +currentQuantityOptionParams < 16
      ? Number(currentQuantityOptionParams)
      : 1;
  const [quantity, setQuantity] = useState(currentQuantityOption);
  const cartItems = useCart((store) => store.items);
 
  const [discount, setDiscount] = useState({
    couponCode: "",
    discountAmount: 0,
  });
  const handleSetQuantity = (quantity: number) => setQuantity(quantity);
  const handleSetDiscount = (discount: {
    couponCode: string;
    discountAmount: number;
  }) => {
    setDiscount(discount);
  };
  const { handleSetMutatingState } = useDisableClicking();
  const router = useRouter();
  const {
    errors,
    register,
    trigger,

    setDistrictValue,
    watch,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
  } = useAddress();

  // if no user address was added before (1st time buying in the web after checking out add new user address)
  const { mutateAsync: addNewUserAddress } =
    trpc.user.addNewAddress.useMutation({});
  const { mutateAsync: addNewUserAddressUserPhoneNumber } =
    trpc.customerPhoneNumber.addNewAddress.useMutation({});
  const { mutate: addUserName } = trpc.user.changeUserName.useMutation({
    onError: (err) => handleTrpcErrors(err),
  });
  const { mutate: addUserNameCustomerPhoneNumber } =
    trpc.customerPhoneNumber.changeUserName.useMutation({
      onError: (err) => handleTrpcErrors(err),
    });

  // checkout by cash is a little bit different than others
  const {
    mutateAsync: checkoutCash,
    isPending: isCheckingOutCash,
    isSuccess: isSuccessCheckoutCash,
  } = trpc.payment.payWithCash.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
  });
  // checkout buy now-------
  const {
    mutateAsync: checkoutCashBuyNow,
    isPending: isCheckingOutCashBuyNow,
    isSuccess: isSuccessCheckoutCashByNow,
  } = trpc.payment.payWithCashBuyNow.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
  });

  const {
    mutate: checkoutWithMomo,
    isPending: isCheckingOutMomo,
    isSuccess: isSuccessCheckoutMomo,
  } = trpc.payment.payWithMomo.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.url) {
        // @ts-ignore
        router.push(data.url);
        // clear the user cart

        router.refresh();
      }
    },
  });
  const {
    mutate: checkoutWithVnPay,
    isPending: isCheckingOutVnPay,
    isSuccess: isSuccessCheckoutVnPay,
  } = trpc.payment.payWithVnPay.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.url) {
        // @ts-ignore
        router.push(data.url);
        // clear the user cart
        router.refresh();
      }
    },
  });


  // CART_____
  const cartTotalPrice = cartItems.reduce(
    (total, item) =>
      total + item.quantity * (item.priceAfterDiscount || item.originalPrice),
    0
  );
  const cartSaleAmount = cartItems.reduce((total, item) => {
    if (item.discountAmount) {
      return (
        total +
        (item.discountAmount *
          item.quantity *
          (item.priceAfterDiscount || item.originalPrice)) /
          100
      );
    }
    return total;
  }, 0);
  let totalPrice=cartTotalPrice
  let saleAmount=cartSaleAmount
  // CART_____
  // BUY_NOW______
  if(type==='buy-now' && product){

  const tempPrice = (product.priceAfterDiscount||product.originalPrice) * quantity;
   totalPrice = tempPrice

  saleAmount = discount ? (tempPrice * discount.discountAmount) / 100 : 0;
  // BUY_NOW_____
}

  const userAddress = user?.address;

  const [paymentMethod, setPaymentMethod] = useState<PAYMENT_METHOD>(
    PAYMENT_METHOD.BY_CASH
  );
  const defaultUserAddress = userAddress?.find((ad) => ad.isDefault);
  const [shippingAddress, setShippingAddress] =
    useState<IShippingAddress | null>(
      defaultUserAddress
        ? {
            address: formUserAddress({
              street: defaultUserAddress.street,
              ward: defaultUserAddress.ward,
              district: defaultUserAddress.district,
            }),
            userName: defaultUserAddress.name,
            userPhoneNumber: defaultUserAddress.phoneNumber,
            id: defaultUserAddress.id!,
          }
        : null
    );
  const [checkoutNote, setCheckoutNote] = useState("");
  const handleSetAddress = (shippingAddress: IShippingAddress) => {
    setShippingAddress(shippingAddress);
  };
  const handleSetPaymentMethod = (type: PAYMENT_METHOD) =>
    setPaymentMethod(type);
  const handleSetCheckoutNotes = (notes: string) => setCheckoutNote(notes);

  const handleCheckout = async () => {
    let userAddress: boolean | Promise<any> = true;
    let shippingAddressToUser: Omit<IShippingAddress, "id"> | null =
      shippingAddress;

    if (!shippingAddress) {
      // isValidShipping address => for user hasn't added address yet
      const isValidShippingAddress = await trigger();
      if (!isValidShippingAddress) {
        document
          .getElementById("delivery-address-checkout-box")
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (!user!.address?.length && isValidShippingAddress) {
        const ward = watch("ward");
        const district = watch("district");
        const street = watch("street");
        const userName = watch("name");
        const userPhoneNumber = watch("phoneNumber");
        const newUserAddress = {
          name: userName,
          district,
          ward,
          street,
          phoneNumber: userPhoneNumber,
        };
        // also add to user name ==> if no user name was added before
        userAddress = isEmailUser(user!)
          ? addNewUserAddress(newUserAddress)
              .then(() => {
                addUserName({ name: userName });
              })
              .catch((err) => handleTrpcErrors(err))
          : addNewUserAddressUserPhoneNumber(newUserAddress)
              .then(() => {
                addUserNameCustomerPhoneNumber({ name: userName });
              })
              .catch((err) => handleTrpcErrors(err));

        shippingAddressToUser = {
          userName,
          userPhoneNumber,
          address: formUserAddress({ street, ward, district }),
        };
      }

      // create shipping address
    }
    // if user has no address before create one
    // create user address before proceeding to checkout
    await userAddress;

    if (paymentMethod === PAYMENT_METHOD.MOMO && shippingAddressToUser) {
      if (type === "cart") {
        checkoutWithMomo({
          shippingAddress: shippingAddressToUser,
          orderNotes: checkoutNote,
        });
      }

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.VN_PAY && shippingAddressToUser) {
      checkoutWithVnPay({
        shippingAddress: shippingAddressToUser,
        orderNotes: checkoutNote,
      });

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.BY_CASH && shippingAddressToUser) {
      if (type === "cart") {
        const result = await checkoutCash({
          shippingAddress: shippingAddressToUser,
          orderNotes: checkoutNote,
        }).catch((err) => handleTrpcErrors(err));
        if (result?.url) {
          router.push(result?.url);
        }
      }
      if (type === "buy-now") {
        const result = await checkoutCashBuyNow({
          shippingAddress: shippingAddressToUser,
          orderNotes: checkoutNote,
          productId: product?.id!,
          couponCode: discount.couponCode,
          quantity,
        }).catch((err) => handleTrpcErrors(err));
        if (result?.url) {
          router.push(result?.url);
        }
      }

      router.refresh();
    }
  };

  const isCheckingOut =
    isCheckingOutMomo ||
    isCheckingOutVnPay ||
    isCheckingOutCash ||
    isCheckingOutCashBuyNow;
  const isSuccessCheckout =
    isSuccessCheckoutCash ||
    isSuccessCheckoutMomo ||
    isSuccessCheckoutVnPay ||
    isSuccessCheckoutCashByNow;
  // when checking not allowing any actions
  useEffect(() => {
    if (isCheckingOut) {
      handleSetMutatingState(true);
    }
    if (!isCheckingOut) {
      handleSetMutatingState(false);
    }
  }, [isCheckingOut, handleSetMutatingState]);
  return {
    isSuccessCheckout,
    errors,
    register,
    handleSetDiscount,
    handleSetQuantity,
    setDistrictValue,
    watch,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
    shippingAddress,
    quantity,
    paymentMethod,
    discount,
    handleSetAddress,
    totalPrice,saleAmount,
    checkoutNote,
    handleSetCheckoutNotes,
    handleSetPaymentMethod,
    isCheckingOut,
    handleCheckout,
  };
};

export default useCheckout;
