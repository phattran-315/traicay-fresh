'use client'
import { APP_URL } from "@/constants/navigation.constant";
import { Order, Product } from "@/payload/payload-types";
import { formatPriceToVND, getImgUrlMedia } from "@/utils/util.utls";
import Image from "next/image";
import Link from "next/link";
import { IoBagHandleOutline } from "react-icons/io5";
import OrderSpecificSectionWrapper from "./order-specific-section-wrapper";

interface OrderSpecificProductsProps {
  items: Order["items"];
}
const OrderSpecificProducts = ({ items }: OrderSpecificProductsProps) => {
  return (
    <OrderSpecificSectionWrapper>
      <IoBagHandleOutline size={35} />
      <div data-cy='product-info-box' className='flex flex-col gap-2 flex-1'>
        <p data-cy='title-box' className='font-bold sm:text-lg'>Thông tin sản phẩm</p>
        <ul className="mt-6 space-y-4">
          {items.map((item) => {
            const product = item.product as Product;
            const imgSrc = getImgUrlMedia(product.thumbnailImg);
            return (
              <OrderSpecificProduct
              key={item.id}
              productId={product.id}
              title={product.title}
                price={item.price}
                originalPrice={item.originalPrice}
                quantity={item.quantity}
                imgSrc={imgSrc!}
              />
            );
          })}
        </ul>
      </div>
    </OrderSpecificSectionWrapper>
  );
};

export default OrderSpecificProducts;

interface OrderSpecificProductProps {
  imgSrc: string;
  price: number;
  quantity: number;
  title:string,
  productId:string
  originalPrice?: Order["items"][number]["originalPrice"];
}
function OrderSpecificProduct({
  imgSrc,
  price,
  productId,
  quantity,
  title,
  originalPrice,
}: OrderSpecificProductProps) {
  return (
    <li data-cy="product-item-info" className='h-20 shadow-sm md:h-52'>
      <Link href={`${APP_URL.products}/${productId}`} className="h-full w-full flex">
      <div className='flex-1 flex gap-2 md:gap-6'>
        <div className='relative w-[40%] min-w-[40%] aspect-square overflow-hidden'>
          <Image
            fill
            className='object-center object-cover'
            src={imgSrc || ""}
            alt='Product Img'
          />
        </div>
        <p data-cy='product-title' className="font-bold md:text-xl">{title}</p>
      </div>
      <div className='flex flex-col justify-between items-end text-end'>
        <div>
          <p data-cy='product-price' className='text-destructive font-semibold md:text-lg'>{formatPriceToVND(price)}/kg</p>
          {/* if has original price but different that means the price has been reduced */}
          {originalPrice && originalPrice!==price && (
            <p data-cy='product-original-price' className='text-sm line-through md:text-base'>
              {formatPriceToVND(originalPrice)}/kg
            </p>
          )}
        </div>
        <p data-cy='product-quantity' className="text-sm md:text-base">
          Số lương: <span>{quantity}Kg</span>
        </p>
      </div>
      </Link>
    </li>
  );
}
