import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHOD } from "../checkout-client";
import {
  FREESHIP_BY_CASH_FROM,
  FREESHIP_FROM,
} from "@/constants/configs.constant";
import { formatPriceToVND } from "@/utils/util.utls";
interface PaymentMethodDetailsProps {
  value: PAYMENT_METHOD;
  id: string;
  label: string;
  icon: ReactNode;
  freeShip?: boolean;
}
const PaymentMethodDetails = ({
  value,
  icon,
  label,
  freeShip,
  id,
}: PaymentMethodDetailsProps) => {
  return (
    <div data-cy='payment-method' className='flex items-center space-x-2'>
      <RadioGroupItem value={value} id={id} />
      <Label
        className='text-base cursor-pointer flex items-center gap-1.5 md:text-lg '
        htmlFor={id}
      >
        <div className='relative flex justify-start items-center h-[25px] min-w-[50px] max-w-[50px]'>
          {icon}
        </div>
        <p>
          {label}{" "}
          {freeShip && (
            <span className='text-xs sm:text-base'>
              (freeship từ{" "}
              {value === PAYMENT_METHOD.BY_CASH
                ? formatPriceToVND(FREESHIP_BY_CASH_FROM)
                : formatPriceToVND(FREESHIP_FROM)}
              )
            </span>
          )}
        </p>
        {value !== PAYMENT_METHOD.BY_CASH && (
          <p className='text-sm text-muted-foreground'>
            (Hiện chưa thanh toán được.)
          </p>
        )}
      </Label>
    </div>
  );
};

export default PaymentMethodDetails;
