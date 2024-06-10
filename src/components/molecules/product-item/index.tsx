import ReviewRating from "@/components/ui/review-rating/review-rating";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/common-types";
import { formatPriceToVND } from "@/utils/util.utls";
import Image from "next/image";
import Link from "next/link";
import ProductItemAddToCartBtn from "./product-item-add-to-cart-btn";
import ProductItemBuyNow from "./product-item-buy-now";

export interface ProductItemProps extends IUser {
  type?: "horizontal" | "vertical";
  title: string;
  subTitle?: string;
  src: string;
  id: string;
  href: string;
  originalPrice: number;
  reviewQuantity?: number;
  priceAfterDiscount?: number | null;
  reviewRating?: number;
  productType?: "product" | "relativeProduct";
}
const ProductItem = ({
  title,
  src,
  id,
  subTitle,
  originalPrice,
  productType = "product",
  user,
  href,
  priceAfterDiscount,
  type = "horizontal",
  reviewQuantity = 1,
  reviewRating = 5,
}: ProductItemProps) => {
  let content = (
    <Link
      data-cy='product-item-home'
      href={href}
      className={cn("flex w-full h-[265px] shadow bg-white border rounded-lg", {
        "h-[160px]": productType === "relativeProduct",
      })}
    >
      <div className='min-w-[40%] w-[150px] rounded-tl-lg rounded-bl-lg aspect-[2/3] h-full overflow-hidden relative lg:min-w-[50%]'>
        <Image
          priority
          fill
          src={src}
          alt='Product Item Img'
          className='object-cover object-center'
        />
      </div>
      <div className='py-2 px-3 flex flex-col flex-1'>
        <p className='text-gray-900 text-lg font-bold whitespace-nowrap'>
          {title}
        </p>
        {subTitle && (
          <p className='text-muted-foreground text-sm'>{subTitle}</p>
        )}
        <p className='text-destructive text-xl font-bold mt-2'>
          {formatPriceToVND(priceAfterDiscount || originalPrice)}
        </p>
        {priceAfterDiscount && (
          <p className='text-destructive text-sm line-through mt-2'>
            {formatPriceToVND(originalPrice)}
          </p>
        )}
        <div className='mt-2 mb-2'>
          <ReviewRating
            ratingAverage={reviewRating}
            reviewQuantity={reviewQuantity}
          />
        </div>
        <div
          className={cn("flex flex-col gap-2 mt-auto sm:flex-row", {
            hidden: productType === "relativeProduct",
          })}
        >
          <ProductItemBuyNow id={id} />
          <ProductItemAddToCartBtn
            id={id}
            title={title}
            src={src}
            originalPrice={originalPrice}
            user={user}
            priceAfterDiscount={priceAfterDiscount}
            reviewQuantity={reviewQuantity}
          />
        </div>
      </div>
    </Link>
  );
  if (type === "vertical") {
    <Link
      href={href}
      className='flex w-full  shadow bg-white border rounded-lg'
    >
      <div className='w-full min-h-[150px] relative aspect-video'>
        <Image
          fill
          src={src}
          alt='Product Item Img'
          className='object-cover object-center'
        />
      </div>
      <div className='mt-4'>
        <p className='text-gray-900 text-xl font-bold'>{title}</p>
        {subTitle && (
          <p className='text-muted-foreground text-sm'>{subTitle}</p>
        )}
        <div className='mt-2 mb-2'>
          <ReviewRating
            ratingAverage={reviewRating}
            reviewQuantity={reviewQuantity}
          />
        </div>
      </div>
      <p className='text-destructive text-xl font-bold mt-2'>
        {formatPriceToVND(priceAfterDiscount || originalPrice)}
      </p>
      {priceAfterDiscount && (
        <p className='text-destructive line-through mt-2'>
          {formatPriceToVND(originalPrice)}
        </p>
      )}
    </Link>;
  }
  return content;
};

export default ProductItem;
