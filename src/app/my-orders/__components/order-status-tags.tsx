"use client";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_TAGS, IOrderStatusTag } from "./order-list";




interface OrderStatusTagsProps {
  onSetOrderStatusTag: (tag: IOrderStatusTag) => void;
  currentTag: IOrderStatusTag;
}
const OrderStatusTags = ({
  onSetOrderStatusTag,
  currentTag,
}: OrderStatusTagsProps) => {

const ORDER_TAG_STATUS: { label: string; status: string }[] = [
    { label: "Tất cả", status: "all" },
    { label: "Chờ xác nhận", status: ORDER_STATUS_TAGS.PENDING },
    { label: "Đang giao", status: ORDER_STATUS_TAGS.DELIVERING },
    { label: "Đã nhận", status: ORDER_STATUS_TAGS.DELIVERED },
    { label: "Đã hủy", status: ORDER_STATUS_TAGS.CANCELED },
  ];
  return (
    <ul className='flex shadow-md mb-4 overflow-y-auto md:m-0 md:flex-col md:shadow-none'>
      {ORDER_TAG_STATUS.map((status) => (
        <li key={status.label}>
          <button
            onClick={() =>
              onSetOrderStatusTag(status.status as IOrderStatusTag)
            }
            className={cn(
              "divide-x block py-2 px-4 w-full flex-center whitespace-nowrap md:text-lg",
              {
                "border-b-2 border-primary": status.status === currentTag,
              }
            )}
          >
            {status.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default OrderStatusTags;
