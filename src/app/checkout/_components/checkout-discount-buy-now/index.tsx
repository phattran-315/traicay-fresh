"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { CartProductItem, useCart } from "@/store/cart.store";
import { IUser } from "@/types/common-types";
import useDisableClicking from "@/hooks/use-disable-clicking";

interface CheckoutDiscountBuyNowProps {
  discountAmount?: number;
  onSetDiscountAmount: (discount: {couponCode:string,discountAmount:number}) => void;
}
const CheckoutDiscountBuyNow = ({
  discountAmount,
  onSetDiscountAmount,
}: CheckoutDiscountBuyNowProps) => {
  const { handleSetMutatingState } = useDisableClicking();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [couponCode, setCounponCode] = useState("");
  const { mutateAsync: applyCoupon, isPending } =
    trpc.coupon.applyCouponBuyNow.useMutation();
  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    await applyCoupon({ coupon })
      .then((data) => {
        handleTrpcSuccess(router, data?.message);
        setCounponCode(coupon);
        onSetDiscountAmount({discountAmount:data.discount,couponCode:coupon});
      })
      .catch((err) => {
        if (err.data?.code === "CONFLICT") {
          toast.info(err.message);
          return;
        }
        handleTrpcErrors(err);
      });
  };

  useEffect(() => {
    if (isPending) {
      handleSetMutatingState(true);
    }
    if (!isPending) {
      handleSetMutatingState(false);
    }
  }, [isPending, handleSetMutatingState]);
  return (
    <div data-cy='discount-box'>
      {couponCode && (
        <p
          data-cy='coupon-applied-notification'
          className='text-muted-foreground italic text-sm mb-2'
        >
          Mã giảm giá{" "}
          <span className='font-semibold'>
            {couponCode} (-{discountAmount}%)
          </span>{" "}
          đã được thêm vào các sản phẩm trong giỏ
        </p>
      )}
      <form
        data-cy='coupon-form-checkout'
        onSubmit={handleApplyCoupon}
        className='flex items-center gap-2 mb-6'
      >
        <Input
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder='Mã giảm giá'
          className='w-3/5'
        />
        <Button
          disabled={isPending || Boolean(discountAmount)}
          variant='secondary'
          className='w-[40%]'
        >
          {isPending ? "Đang Áp dụng" : "Áp dụng"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutDiscountBuyNow;
