import { cn } from "@/lib/utils";
import { Order } from "@/payload/payload-types";
import React from "react";

interface DeliveryStatusProps {
  deliveryStatus: Order["deliveryStatus"];
  className?:string
}
const DeliveryStatus = ({className, deliveryStatus }: DeliveryStatusProps) => {
  return (
    <p
    data-cy='delivery-status'
      className={cn(`${className}`,{
        "text-primary":
          deliveryStatus === "delivered" || deliveryStatus === "delivering",
        "text-destructive": deliveryStatus === "canceled",
        "text-accent": deliveryStatus === "pending",
      })}
    >
      {deliveryStatus === "pending" && "Đang chuẩn bị hàng"}
      {deliveryStatus === "canceled" && "Đã hủy"}
      {deliveryStatus === "delivering" && "Đang giao hàng"}
      {deliveryStatus === "delivered" && "Đã nhận"}
    </p>
  );
};

export default DeliveryStatus;
