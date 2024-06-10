import { Order } from "@/payload/payload-types";
import React from "react";
import { BsFillBagXFill } from "react-icons/bs";
import { IoBagCheck } from "react-icons/io5";
interface OrderStatusTitleInfoProps {
  orderStatus: Order["status"];
}
const OrderStatusTitleInfo = ({ orderStatus }: OrderStatusTitleInfoProps) => {
  let title = "Đặt hàng thành công";
  let description =
    " Cảm ơn bạn đã tin tưởng và đặt hàng. Chúng tôi sẽ sớm gửi ngay đơn hàng đến bạn.";

  if (orderStatus === "canceled") {
    title = "Hủy đơn hàng thành công";
    description = `Cảm ơn bạn đã đặt hàng, nhưng vì một lý do nào đó khiến bạn không muốn
        đặt hàng nữa, nếu bạn có góp ý xin vui lòng góp ý cho chúng tôi để có
        cơ hội phục vụ bạn tốt hơn (góp ý ở bên dưới). Xin chân thành cảm ơn.`;
  }
  if (orderStatus === "failed") {
    title = "Đặt hàng thất bại";
    description = `Cảm ơn bạn đã tin tưởng và đặt hàng. Nhưng vì lý do nào đó đơn hàng đã
        đặt không thành công. Xin lỗi về sự bất tiện này , mong bạn đặt lại
        đơn hàng sau ít phút`;
  }
  return (
    <>
      {orderStatus === "canceled" || orderStatus === "failed" ? (
        <BsFillBagXFill size={35} className='text-destructive' />
      ) : (
        <IoBagCheck size={35} className='text-primary' />
      )}
      <p data-cy='title-order-status'>{title}</p>
      <p
        data-cy='title-description-order-status'
        className='text-base font-bold text-gray-800'
      >
        {description}
      </p>
    </>
  );
};

export default OrderStatusTitleInfo;
