import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";

const ProductItemBuyNow = ({id}:{id:string}) => {
  const router = useRouter();

  const handleBuyNow = () => {
    router.push(
      `${APP_URL.checkout}?${APP_PARAMS.checkoutFlow}=buy-now&${APP_PARAMS.productId}=${id}`
    );
  };
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        handleBuyNow();
      }}
      className='flex-1'
    >
      Mua ngay
    </Button>
  );
};

export default ProductItemBuyNow;
