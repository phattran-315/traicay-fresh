"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/payload/payload-types";
import { formatPriceToVND } from "@/utils/util.utls";

interface ProductPriceProps {
  priceAfterDiscount: Product["priceAfterDiscount"];
  originalPrice: Product["originalPrice"];
  currentQuantityOption: number;
}
const ProductPrice = ({
  priceAfterDiscount,
  originalPrice,
  currentQuantityOption,
}: ProductPriceProps) => {
  return (
    <div className='mt-6'>
      <div className="md:flex gap-2">
      <p className="md:font-bold">Giá:</p>
      <div className='mb-1 flex gap-2'>
        {Boolean(priceAfterDiscount) && (
          <p className='text-sm text-destructive line-through md:text-base'>
            {formatPriceToVND(originalPrice)}
          </p>
        )}
        <p className='text-sm text-destructive md:text-base'>
          {formatPriceToVND(priceAfterDiscount || originalPrice)}/kg
        </p>
      </div>

      </div>
      <div className="md:flex gap-2 items-center">
        <p className="md:font-bold">Tạm tính:</p>
      <p className='font-bold text-2xl text-destructive md:text-xl'>
        {formatPriceToVND(
          (priceAfterDiscount || originalPrice) * currentQuantityOption
        )}
      </p>
      </div>
    </div>
  );
};

export default ProductPrice;
