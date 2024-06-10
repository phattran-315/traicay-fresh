"use client";
import { HOST_PHONE_NUMBER, ZALO_NUMBER } from "@/constants/configs.constant";
import { cn } from "@/lib/utils";
import { Order, Product } from "@/payload/payload-types";
import { formatPriceToVND, sliceOrderId } from "@/utils/util.utls";
import { useState } from "react";
import CancelOrderRequest from "@/components/molecules/cancel-order-request";
import FeedbackBox from "@/components/molecules/feed-back-box";
import OrderStatusTitleInfo from "./order-status-title-info";

interface OrderStatusInfoProps {
  orderId: string;
  shippingAddress: Order["shippingAddress"];
  totalPrice: number;
  orderStatus: Order["status"];
  deliveryStatus: Order["deliveryStatus"];
  items: Order["items"];
  orderNotes?: Order["orderNotes"];
}
const OrderStatusInfo = ({
  orderId,
  shippingAddress,
  totalPrice,
  orderNotes,
  items,
  deliveryStatus,
  orderStatus,
}: OrderStatusInfoProps) => {
  const [isOpenCancelRequest, setIsOpenCancelRequest] = useState(false);
  const toggleOpenCancelRequest = () => setIsOpenCancelRequest((prev) => !prev);
  const orderSpecificDetails = items?.reduce((acc, item) => {
    const productDetails = item.product as Product;
    return `${acc}${acc ? " , " : ""} ${item.quantity}Kg ${
      productDetails.title
    }`;
    return acc;
  }, "");
  // TODO: IPNURL
  // TODO: pullIsPaid useQuery (enable:isPaid===false,refetchInterval)

  return (
    <div className='mt-8'>
      <div
        data-cy='title-box-order-status'
        className={cn("font-bold text-2xl", {
          "text-primary":
            orderStatus === "confirmed" || orderStatus === "pending",
          "text-destructive":
            orderStatus === "failed" || orderStatus === "canceled",
        })}
      >
        <div className='flex items-center flex-col justify-center gap-3 text-center mb-4'>
          <OrderStatusTitleInfo orderStatus={orderStatus} />
        </div>
      </div>
      <div className='py-2 px-3 space-y-2 mt-6 bg-gray-200 rounded-md border border-gray-800'>
        <div className='flex justify-between'>
          {/* get only the last ten characters of the id */}
          <p data-cy='order-status-id'>
            Đơn hàng: <span>{sliceOrderId(orderId)}</span>
          </p>
          {orderStatus === "pending" && deliveryStatus === "pending" && (
            <CancelOrderRequest
              orderId={orderId}
              isOpen={isOpenCancelRequest}
              btnClassName="!p-0 !h-auto"
              btnVariant={{variant:'text-destructive'}}
              onToggleOpenCancelRequest={toggleOpenCancelRequest}
            />
          )}
        </div>
        <div>
          <p data-cy='order-specific-order-status'>
            Chi tiết đơn hàng:
            <span className='italic'>{orderSpecificDetails}</span>
          </p>
        </div>
        <div>
          <p data-cy='user-info-order-status'>
            Người nhận:{" "}
            <span className='font-bold'>
              {shippingAddress.userName} - {shippingAddress.userPhoneNumber}
            </span>{" "}
          </p>
        </div>
        <div>
          <p data-cy='shipping-address-order-status'>
            Địa chỉ nhận hàng: <span>{shippingAddress.address}</span>
          </p>
        </div>
        <div>
          <p data-cy='total-cost-order-status'>
            Tổng tiền:{" "}
            <span className='text-destructive font-semibold'>
              {formatPriceToVND(totalPrice)}
            </span>
          </p>
        </div>
        <div>
          <p data-cy='order-confirmation-status'>
            Trạng thái:{" "}
            <span
              className={cn("font-bold", {
                "text-primary": orderStatus === "confirmed",
                "text-accent": orderStatus === "pending",
                "text-destructive":
                  orderStatus === "canceled" || orderStatus == "failed",
              })}
            >
              {orderStatus === "pending" && "Đợi xác nhận"}
              {orderStatus === "confirmed" && "Thành công"}
              {orderStatus === "failed" && "Thất bại"}
              {orderStatus === "canceled" && "Đã hủy"}
            </span>
          </p>
        </div>
        <div>
              <p data-cy='delivery-status-order'>
                Tình trạng đơn hàng:{" "}
                <span
                  className={cn({
                    "text-primary":
                      deliveryStatus === "delivered" ||
                      deliveryStatus === "delivering",
                    "text-destructive": deliveryStatus === "canceled",
                    "text-accent": deliveryStatus === "pending",
                  })}
                >
                  {deliveryStatus === "pending" && "Đang chuẩn bị hàng"}
                  {deliveryStatus === "canceled" && "Giao hàng thất bai"}
                  {deliveryStatus === "delivering" && "Đang giao hàng"}
                  {deliveryStatus === "delivered" && "Đã giao hàng"}
                </span>
              </p>
            </div>
        {orderNotes && (
          <div>
            <p data-cy='notes-order'>
              Ghi chú: <span>{orderNotes}</span>
            </p>
          </div>
        )}
        <div>
          <p>
            Moị thắc mắc vui lòng liên hệ{" "}
            <a
              data-cy='zalo-order-status'
              className='font-bold'
              href={`https://zalo.me/${ZALO_NUMBER}`}
              target='_blank'
            >
              Zalo
            </a>{" "}
            hoặc gọi đến số{" "}
            <a
              data-cy='tel-order-status'
              className='font-bold'
              href={`tel:${HOST_PHONE_NUMBER}`}
            >
              {HOST_PHONE_NUMBER}
            </a>
          </p>
        </div>
      </div>
      <FeedbackBox />
    </div>
  );
};

export default OrderStatusInfo;
