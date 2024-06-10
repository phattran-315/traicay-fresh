"use client";
import { IoReceiptOutline } from "react-icons/io5";
import { FaMotorcycle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants/navigation.constant";
import { Order, Product } from "@/payload/payload-types";
import {
  formatPriceToVND,
  getImgUrlMedia,
  sliceOrderId,
} from "@/utils/util.utls";
import Image from "next/image";
import Link from "next/link";
import DeliveryStatus from "./delivery-status";
import { cn } from "@/lib/utils";
interface OrderItemProps {
  totalPrice: number;
  orderId: string;
  items: Order["items"];
  deliveryStatus: Order["deliveryStatus"];
}
const OrderItem = ({
  totalPrice,
  items,
  deliveryStatus,
  orderId,
}: OrderItemProps) => {
  return (
    <li
      data-cy='order-item-my-order'
      className='border border-gray-300 rounded-md'
    >
      <div className='text-sm px-3 py-2 bg-gray-200 flex justify-between border-b border-b-gray-200'>
        <div
          data-cy='order-id-my-order'
          className='md:flex md:items-center md:gap-2'
        >
          <div className='hidden md:block'>
            <IoReceiptOutline size={25} />
          </div>
          Đơn hàng: <span>{sliceOrderId(orderId)}</span>
        </div>
        <div className='md:flex md:items-center md:gap-2'>
          <div className='hidden md:block'>
            <FaMotorcycle
              className={cn({
                "text-primary":
                  deliveryStatus === "delivered" ||
                  deliveryStatus === "delivering",
                "text-destructive": deliveryStatus === "canceled",
                "text-accent": deliveryStatus === "pending",
              })}
              size={25}
            />
          </div>
          <DeliveryStatus deliveryStatus={deliveryStatus} />
        </div>
      </div>
      <Link
        data-cy='order-item-link-my-order'
        href={`${APP_URL.myOrders}/${orderId || ""}`}
        className='px-4 py-3 block'
      >
        <ul className='space-y-2'>
          {items.map((item) => {
            const product = item.product as Product;
            const productPrice =
              product.priceAfterDiscount || product.originalPrice;
            const imgSrc = getImgUrlMedia(product.thumbnailImg);
            return (
              <li
                data-cy='product-details-box'
                key={item.id}
                className='grid grid-cols-[8.5fr_1.5fr]'
              >
                <div className='flex gap-3'>
                  <div className='relative w-[25%] min-w-[25%] aspect-square overflow-hidden lg:w-[15%] lg:min-w-[15%]'>
                    <Image
                      fill
                      className='object-center object-cover'
                      src={imgSrc || ""}
                      alt='Product Img'
                    />
                  </div>
                  <div className='flex flex-col justify-between flex-1'>
                    <p
                      data-cy='product-title-my-order'
                      className='font-bold'
                    >{`${product.title} (${item.quantity}Kg)`}</p>
                    {/* <p data-cy='total-price-my-order' className="text-sm text-destructive">
                    Thành tiền:{" "}
                    <span>
                    {formatPriceToVND(productPrice * item.quantity!)}
                    </span>
                  </p> */}
                  </div>
                </div>
                <div className='flex justify-end'>
                  <p data-cy='price-my-order' className='text-sm '>
                    {formatPriceToVND(productPrice)}/kg
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className='flex gap-2 flex-col items-end mt-6 py-3 border-t border-t-gray-200'>
          <p data-cy='total-price-my-order' className='text-xl font-bold'>
            Tổng tiền:{" "}
            <span className='text-destructive'>
              {formatPriceToVND(totalPrice)}
            </span>
          </p>
          {/* <div className='flex justify-center mt-4'> */}
          <Button variant='outline'>Xem chi tiết</Button>
          {/* </div> */}
        </div>
      </Link>
    </li>
  );
};

export default OrderItem;
