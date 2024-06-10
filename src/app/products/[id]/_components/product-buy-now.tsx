"use client";
import { Button } from "@/components/ui/button";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";
import { Product } from "@/payload/payload-types";
import { useRouter, useSearchParams } from "next/navigation";
interface ProductBuyNowProps {
  productId: string;
  quantity:number
}
const ProductBuyNow = ({quantity, productId }: ProductBuyNowProps) => {
  const router = useRouter();

  const handleBuyNow = () => {
    router.push(
      `${APP_URL.checkout}?${APP_PARAMS.checkoutFlow}=buy-now&${APP_PARAMS.productId}=${productId}&quantity=${quantity}`
    );
  };
  return (
    <Button onClick={handleBuyNow} className='mt-6 w-full md:m-0'>
      Mua ngay
    </Button>
  );
};

export default ProductBuyNow;
