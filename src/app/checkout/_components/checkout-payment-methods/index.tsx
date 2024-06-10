"use client";
import Image from "next/image";
import { IoCashOutline } from "react-icons/io5";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHOD } from "../checkout-client";
import { ReactNode } from "react";
import PaymentMethodDetails from "./payment-method-details";
import { FREESHIP_BY_CASH_FROM, FREESHIP_FROM } from "@/constants/configs.constant";

interface CheckoutPaymentMethodsProps {
  onSetPaymentMethod: (type: PAYMENT_METHOD) => void;
  method: PAYMENT_METHOD;
  totalPrice:number
}

const CheckoutPaymentMethods = ({
  method,
  totalPrice,
  onSetPaymentMethod,
}: CheckoutPaymentMethodsProps) => {
  const PAYMENT_METHODS_LIST: {
    label: string;
    id: string;
    freeShip?: boolean;
    icon: ReactNode;
    value: PAYMENT_METHOD;
  }[] = [
    {
      label: "Thanh toán tiền mặt khi nhận hàng",
      icon: <IoCashOutline size={35} />,
      id: "by-cash",
      freeShip:true,
      value: PAYMENT_METHOD.BY_CASH,
    },
    {
      label: "Ví MoMo",
      freeShip:true,
      icon: (
        <Image
          src={"/payment-logos/MoMo.svg"}
          alt='MoMo logo'
          fill
          className='object-contain object-left'
        />
      ),
      id: "MoMo",
      value: PAYMENT_METHOD.MOMO,
    },
    {
      label: "Thanh toán bằng VNPAY",
      freeShip: true,
      icon: (
        <Image
          src={"/payment-logos/VnPay.svg"}
          alt='VnPay logo'
          fill
          className='object-contain object-left'
        />
      ),
      id: "vn-pay",
      value: PAYMENT_METHOD.VN_PAY,
    },
  ];
  return (
    <div>
      <PageSubTitle>Phương thức thanh toán</PageSubTitle>
      <RadioGroup
        data-cy='payment-method-box'
        className='mt-8 space-y-3'
        onValueChange={(value) => {
          onSetPaymentMethod(value as PAYMENT_METHOD);
        }}
        defaultValue={method}
      >
        {PAYMENT_METHODS_LIST.map((method) => (
          <PaymentMethodDetails key={method.id} {...method} />
        ))}
        {/* <div data-cy='payment-method' className='flex items-center space-x-2'>
          <RadioGroupItem
            value={PAYMENT_METHOD.CREDIT_TRANSFER}
            id='credit-transfer'
          />
          <Label
            className='text-base cursor-pointer flex items-center gap-1.5 md:text-lg '
            htmlFor='credit-transfer'
          >
            Chuyển khoản ngân hàng (freeShip từ đơn hàng 150.000Đ)
          </Label>
        </div> */}
      </RadioGroup>
    </div>
  );
};

export default CheckoutPaymentMethods;
